// pages/api/approve-submission.ts
import { Octokit } from 'octokit';
import type { NextApiRequest, NextApiResponse } from 'next';

const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO = process.env.GH_REPO!;
const GH_TOKEN = process.env.GH_TOKEN!;
const SOURCE_BRANCH = 'submissions';
const DEST_BRANCH = 'main';

const octokit = new Octokit({ auth: GH_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.body;
  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'Missing file name' });
  }

  try {
    const path = `content/lore/${file}`;

    // Get the file content from submissions branch
    const { data: sourceContent } = await octokit.rest.repos.getContent({
      owner: GH_OWNER,
      repo: GH_REPO,
      path,
      ref: SOURCE_BRANCH,
    });

    if (!('content' in sourceContent)) {
      return res.status(404).json({ error: 'File content not found in submissions' });
    }

    const decodedContent = Buffer.from(sourceContent.content, 'base64').toString('utf-8');

    // Get the latest commit on the main branch
    const { data: mainRef } = await octokit.git.getRef({
      owner: GH_OWNER,
      repo: GH_REPO,
      ref: `heads/${DEST_BRANCH}`,
    });

    const { data: mainCommit } = await octokit.git.getCommit({
      owner: GH_OWNER,
      repo: GH_REPO,
      commit_sha: mainRef.object.sha,
    });

    // Create blob
    const { data: blob } = await octokit.git.createBlob({
      owner: GH_OWNER,
      repo: GH_REPO,
      content: decodedContent,
      encoding: 'utf-8',
    });

    // Create tree
    const { data: tree } = await octokit.git.createTree({
      owner: GH_OWNER,
      repo: GH_REPO,
      base_tree: mainCommit.tree.sha,
      tree: [
        {
          path,
          mode: '100644',
          type: 'blob',
          sha: blob.sha,
        },
      ],
    });

    // Commit to main branch
    const { data: commit } = await octokit.git.createCommit({
      owner: GH_OWNER,
      repo: GH_REPO,
      message: `Approve: ${file}`,
      tree: tree.sha,
      parents: [mainCommit.sha],
    });

    await octokit.git.updateRef({
      owner: GH_OWNER,
      repo: GH_REPO,
      ref: `heads/${DEST_BRANCH}`,
      sha: commit.sha,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Approve error:', error.message || error);
    res.status(500).json({ error: 'Failed to approve file.' });
  }
}
