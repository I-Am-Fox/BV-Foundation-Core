
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO = process.env.GH_REPO!;
const GH_BRANCH = 'submissions'; // Target branch for staging submissions
const GH_TOKEN = process.env.GH_TOKEN!;

const octokit = new Octokit({ auth: GH_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err || !files.file) {
            return res.status(400).json({ error: 'File upload failed.' });
        }

        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
        const filename = uploadedFile.originalFilename!;

        if (!filename.match(/^(ALPHA|BETA|DELTA|THETA|OCTANE)_.+\.mdx$/)) {
            return res.status(400).json({ error: 'Invalid filename format.' });
        }

        const fileContent = fs.readFileSync(uploadedFile.filepath, 'utf-8');

        try {
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
                content: fileContent,
                encoding: 'utf-8',
            });

            const commitPath = `content/submissions/${filename}`;

            const { data: newTree } = await octokit.git.createTree({
                owner: GH_OWNER,
                repo: GH_REPO,
                base_tree: latestCommit.tree.sha,
                tree: [
                    {
                        path: commitPath,
                        mode: '100644',
                        type: 'blob',
                        sha: blobData.sha,
                    },
                ],
            });

            const { data: newCommit } = await octokit.git.createCommit({
                owner: GH_OWNER,
                repo: GH_REPO,
                message: `Submit: ${filename}`,
                tree: newTree.sha,
                parents: [latestCommitSha],
            });

            await octokit.git.updateRef({
                owner: GH_OWNER,
                repo: GH_REPO,
                ref: `heads/${GH_BRANCH}`,
                sha: newCommit.sha,
            });

            return res.status(200).json({ success: true });
        } catch (e) {
            console.error('Submit error:', (e as any).response?.data || e);
            return res.status(500).json({ error: 'Failed to commit to GitHub' });
        }
    });
}
