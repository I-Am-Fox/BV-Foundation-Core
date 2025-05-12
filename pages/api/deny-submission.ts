// pages/api/deny-submission.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GH_TOKEN });
const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO = process.env.GH_REPO!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prNumber } = req.body;
  if (!prNumber) return res.status(400).json({ error: 'Missing PR number' });

  try {
    await octokit.rest.pulls.update({
      owner: GH_OWNER,
      repo: GH_REPO,
      pull_number: prNumber,
      state: 'closed',
    });

    res.status(200).json({ message: `PR #${prNumber} closed.` });
  } catch (err: any) {
    console.error('[Deny Error]', err.message);
    res.status(500).json({ error: 'Failed to deny submission.' });
  }
}
