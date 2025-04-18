
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

    const fromPath = path.join(process.cwd(), 'content', 'submissions', filename);
    const toPath = path.join(process.cwd(), 'content', 'lore', filename);

    if (!fs.existsSync(fromPath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    try {
        const { data: pullRequests } = await octokit.pulls.list({
            owner: GH_OWNER,
            repo: GH_REPO,
            state: 'open',
            base: GH_BRANCH,
        });

        const matchingPr = pullRequests.find(pr => pr.title.includes(filename));

        if (!matchingPr) {
            return res.status(404).json({ error: 'No matching pull request found.' });
        }

        await octokit.pulls.merge({
            owner: GH_OWNER,
            repo: GH_REPO,
            pull_number: matchingPr.number,
            merge_method: 'squash',
        });

        fs.renameSync(fromPath, toPath);

        console.log(`File moved from ${fromPath} to ${toPath}`)

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
