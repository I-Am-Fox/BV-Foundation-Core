
import fs from 'fs';
import path from 'path';
import { Octokit } from '@octokit/rest';
import type { NextApiRequest, NextApiResponse } from 'next';
import { logAction, sendDiscordAlert } from './utils';

const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO = process.env.GH_REPO!;
const GH_BRANCH = process.env.GH_BRANCH || 'main';
const GH_TOKEN = process.env.GH_TOKEN!;

const octokit = new Octokit({ auth: GH_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const { filename } = req.body;

    if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    if (filename.includes('/') || filename.includes('..')) {
        return res.status(400).json({ error: 'Disallowed filename structure.' });
    }

    const filePath = path.join(process.cwd(), 'content', 'submissions', filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const commitPath = `content/lore/${filename}`;

        const { data: refData } = await octokit.git.getRef({
            owner: GH_OWNER,
            repo: GH_REPO,
            ref: `heads/${GH_BRANCH}`,
        });

        const latestCommitSha = refData.object.sha;

        const { data: latestCommit } = await octokit.git.getCommit({
            owner: GH_OWNER,
            repo: GH_REPO,
            commit_sha: latestCommitSha,
        });

        const { data: blobData } = await octokit.git.createBlob({
            owner: GH_OWNER,
            repo: GH_REPO,
            content,
            encoding: 'utf-8'
        });

        const { data: newTree } = await octokit.git.createTree({
            owner: GH_OWNER,
            repo: GH_REPO,
            base_tree: latestCommit.tree.sha,
            tree: [{
                path: commitPath,
                mode: '100644',
                type: 'blob',
                sha: blobData.sha,
            }],
        });

        const { data: newCommit } = await octokit.git.createCommit({
            owner: GH_OWNER,
            repo: GH_REPO,
            message: `Approve: ${filename}`,
            tree: newTree.sha,
            parents: [latestCommitSha],
        });

        await octokit.git.updateRef({
            owner: GH_OWNER,
            repo: GH_REPO,
            ref: `heads/${GH_BRANCH}`,
            sha: newCommit.sha,
        });

        await fs.promises.unlink(filePath);

        await logAction('approved', filename);
        await sendDiscordAlert('approve', filename);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('❌ GitHub commit error:', {
            message: (err as any).message,
            response: (err as any).response?.data
        });
        res.status(500).json({ error: 'GitHub commit failed.' });
    }
}
