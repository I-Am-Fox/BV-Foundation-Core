// pages/api/asset-list.ts
import { Octokit } from 'octokit';
import type { NextApiRequest, NextApiResponse } from 'next';
import matter from 'gray-matter';

const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO = process.env.GH_REPO!;
const GH_BRANCH = 'main';
const GH_TOKEN = process.env.GH_TOKEN!;

const octokit = new Octokit({ auth: GH_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: treeData } = await octokit.rest.git.getTree({
      owner: GH_OWNER,
      repo: GH_REPO,
      tree_sha: GH_BRANCH,
      recursive: 'true',
    });

    const mdxFiles = treeData.tree.filter(
      (file: any) =>
        file.type === 'blob' && file.path.startsWith('content/lore/') && file.path.endsWith('.mdx')
    );

    const seenAssets = new Set<string>();
    const results: {
      asset: string;
      classification: string;
      title: string;
      path: string;
      hasDossier: boolean;
      types: string[];
    }[] = [];

    const assetMap: Record<
      string,
      { classification: string; title: string; path: string; types: string[] }
    > = {};

    for (const file of mdxFiles) {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner: GH_OWNER,
        repo: GH_REPO,
        path: file.path,
        ref: GH_BRANCH,
      });

      if (!('content' in fileData)) continue;
      const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const { data: frontmatter } = matter(decoded);

      if (!frontmatter.asset || typeof frontmatter.asset !== 'string') continue;
      const assetName = frontmatter.asset.trim();
      if (assetName.toUpperCase().includes('[REDACTED]')) continue;

      const type = (frontmatter.title || '').toLowerCase().includes('dossier')
        ? 'dossier'
        : frontmatter.title?.toLowerCase().includes('log')
          ? 'log'
          : frontmatter.title?.toLowerCase().includes('analysis')
            ? 'analysis'
            : 'other';

      if (!assetMap[assetName]) {
        assetMap[assetName] = {
          classification: frontmatter.classification || '',
          title: frontmatter.title || file.path.split('/').pop() || '',
          path: file.path,
          types: [type],
        };
      } else {
        if (!assetMap[assetName].types.includes(type)) {
          assetMap[assetName].types.push(type);
        }
      }
    }

    for (const assetName in assetMap) {
      const entry = assetMap[assetName];
      results.push({
        asset: assetName,
        classification: entry.classification,
        title: entry.title,
        path: entry.path,
        hasDossier: entry.types.includes('dossier'),
        types: entry.types,
      });
    }

    res.status(200).json(results);
  } catch (error: any) {
    console.error('[Asset List Error]', error.message || error);
    res.status(500).json({ error: 'Failed to fetch asset list.' });
  }
}
