// pages/api/approve-submission.ts
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
    const { data } = await octokit.rest.pulls.merge({
      owner: GH_OWNER,
      repo: GH_REPO,
      pull_number: prNumber,
      merge_method: 'squash',
    });

    res.status(200).json({ message: `PR #${prNumber} merged.` });
  } catch (err: any) {
    console.error('[Approve Error]', err.message);
    res.status(500).json({ error: 'Failed to approve submission.' });
  }
}
