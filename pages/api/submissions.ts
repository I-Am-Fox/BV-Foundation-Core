
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const submissionsDir = path.join(process.cwd(), 'content', 'submissions');

    try {
        if (!fs.existsSync(submissionsDir)) {
            return res.status(200).json({files: []});
        }

        const files = fs.readdirSync(submissionsDir).filter(file => file.endsWith('.mdx'));

        const parsed = files.map((filename) => {
            const fullPath = path.join(submissionsDir, filename);
            const rawContent = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(rawContent);

            return {
                filename,
                title: data.title ?? '[Untitled]',
                classification: data.classification ?? 'UNKNOWN',
                asset: data.asset ?? 'Unknown Asset',
            };
        });

        res.status(200).json({ files: parsed });
    } catch (err) {
        res.status(500).json({ error: 'Unable to load submissions.' });
    }
}
