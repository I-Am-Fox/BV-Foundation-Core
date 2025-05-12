// pages/api/deny-submission.ts
import { Octokit } from 'octokit';
import type { NextApiRequest, NextApiResponse } from 'next';

const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO = process.env.GH_REPO!;
const GH_TOKEN = process.env.GH_TOKEN!;
const GH_BRANCH = 'submissions';

const octokit = new Octokit({ auth: GH_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.body;
  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'Missing file name' });
  }

  try {
    const path = `content/lore/${file}`;

    // Get latest commit on submissions branch
    const { data: refData } = await octokit.git.getRef({
      owner: GH_OWNER,
      repo: GH_REPO,
      ref: `heads/${GH_BRANCH}`
    });

    const { data: latestCommit } = await octokit.git.getCommit({
      owner: GH_OWNER,
      repo: GH_REPO,
      commit_sha: refData.object.sha
    });

    // Create new tree without the file
    const { data: baseTree } = await octokit.git.getTree({
      owner: GH_OWNER,
      repo: GH_REPO,
      tree_sha: latestCommit.tree.sha,
      recursive: 'true'
    });

    const newTreeItems = baseTree.tree.filter((item: { path?: string }) => item.path !== path);

    const { data: newTree } = await octokit.git.createTree({
      owner: GH_OWNER,
      repo: GH_REPO,
      tree: newTreeItems as any[],
      base_tree: latestCommit.tree.sha
    });

    const { data: newCommit } = await octokit.git.createCommit({
      owner: GH_OWNER,
      repo: GH_REPO,
      message: `Deny: ${file}`,
      tree: newTree.sha,
      parents: [latestCommit.sha]
    });

    await octokit.git.updateRef({
      owner: GH_OWNER,
      repo: GH_REPO,
      ref: `heads/${GH_BRANCH}`,
      sha: newCommit.sha
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Deny error:', error.message || error);
    res.status(500).json({ error: 'Failed to delete submission.' });
  }
}