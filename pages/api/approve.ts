
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const { filename } = req.body;

    if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    const fromPath = path.join(process.cwd(), 'content', 'submissions', filename);
    const toPath = path.join(process.cwd(), 'content', 'lore', filename);

    try {
        if (!fs.existsSync(fromPath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        fs.renameSync(fromPath, toPath);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to move file' });
    }
}
