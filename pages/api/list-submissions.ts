// pages/api/list-submissions.ts
import { Octokit } from 'octokit';
import type { NextApiRequest, NextApiResponse } from 'next';

const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO = process.env.GH_REPO!;
const GH_BRANCH = process.env.GH_BRANCH || 'submissions';
const GH_TOKEN = process.env.GH_TOKEN!;

const octokit = new Octokit({ auth: GH_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Step 1: Get all open PRs targeting the submissions branch
    const { data: pullRequests } = await octokit.rest.pulls.list({
      owner: GH_OWNER,
      repo: GH_REPO,
      state: 'open',
      base: GH_BRANCH,
      per_page: 100,
    });

    const result = [];

    // Step 2: For each PR, scan for .mdx files in content/submissions/
    for (const pr of pullRequests) {
      const branch = pr.head.ref;

      const { data: treeData } = await octokit.rest.git.getTree({
        owner: GH_OWNER,
        repo: GH_REPO,
        tree_sha: branch,
        recursive: 'true',
      });

      const mdxFiles = treeData.tree
        .filter(
          (file: any) =>
            file.type === 'blob' &&
            file.path.startsWith('content/submissions/') &&
            file.path.endsWith('.mdx')
        )
        .map((file: any) => file.path.replace('content/submissions/', ''));

      if (mdxFiles.length > 0) {
        result.push({
          prNumber: pr.number,
          title: pr.title,
          branch,
          files: mdxFiles,
        });
      }
    }

    res.status(200).json(result);
  } catch (err: any) {
    console.error('[GitHub PR Fetch Error]', err.message);
    res.status(500).json({ error: 'Failed to list submission PRs.' });
  }
}
