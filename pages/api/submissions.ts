// pages/api/submissions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const submissionsDir = path.join(process.cwd(), 'content/submissions');

    if (!fs.existsSync(submissionsDir)) {
      return res.status(200).json([]);
    }

    const files = fs.readdirSync(submissionsDir).filter((file) => file.endsWith('.mdx'));

    const submissions = files.map((filename) => {
      const filePath = path.join(submissionsDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontMatter } = matter(fileContent);

      return {
        filename,
        title: frontMatter.title || 'Untitled',
        classification: frontMatter.classification || 'Unknown',
        asset: frontMatter.asset || 'Unknown Asset',
      };
    });

    return res.status(200).json(submissions);
  } catch (error) {
    console.error('Error loading submissions:', error);
    return res.status(500).json({ error: 'Failed to load submissions.' });
  }
}
