// pages/api/load-submission.ts
import { Octokit } from 'octokit';
import type { NextApiRequest, NextApiResponse } from 'next';

const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO = process.env.GH_REPO!;
const GH_TOKEN = process.env.GH_TOKEN!;

const octokit = new Octokit({ auth: GH_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { branch, file } = req.query;

  if (typeof branch !== 'string' || typeof file !== 'string') {
    return res.status(400).json({ error: 'Missing branch or file parameter.' });
  }

  const fullPath = `content/submissions/${file}`;

  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner: GH_OWNER,
      repo: GH_REPO,
      path: fullPath,
      ref: branch,
    });

    if (!('content' in fileData)) {
      return res.status(404).json({ error: 'File content not found.' });
    }

    const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
    res.status(200).send(decoded);
  } catch (error: any) {
    console.error('[GitHub Load Error]', error.message);
    res.status(500).json({ error: 'Failed to load file from GitHub.' });
  }
}
