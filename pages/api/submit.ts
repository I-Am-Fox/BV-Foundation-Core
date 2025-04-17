
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

const validPrefixes = ['ALPHA_', 'BETA_', 'DELTA_', 'OCTANE_', 'THETA_'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const uploadsDir = path.join(process.cwd(), 'content', 'submissions');
    fs.mkdirSync(uploadsDir, { recursive: true });

    const form = new IncomingForm({
        uploadDir: uploadsDir,
        keepExtensions: true,
    });

    try {
        form.parse(req, async (err, fields, files) => {
            if (err || !files.file) {
                console.error('Formidable parse error:', err);
                return res.status(400).json({ error: 'File upload failed.' });
            }

            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            const originalPath = file.filepath;
            const originalName = file.originalFilename || '';
            const safeName = originalName.replace(/[^a-z0-9-_\.]/gi, '_');

            const hasValidPrefix = validPrefixes.some(prefix => safeName.startsWith(prefix));
            if (!hasValidPrefix) {
                fs.unlinkSync(originalPath); // delete temp uploaded file
                return res.status(400).json({ error: 'Invalid filename: must begin with classification prefix (e.g. ALPHA_, BETA_)' });
            }

            const finalPath = path.join(uploadsDir, safeName);

            try {
                fs.renameSync(originalPath, finalPath);
                return res.status(200).json({ success: true });
            } catch (moveErr) {
                console.error('File move error:', moveErr);
                return res.status(500).json({ error: 'Could not save file.' });
            }
        });
    } catch (outerErr) {
        console.error('Unexpected server error:', outerErr);
        return res.status(500).json({ error: 'Unexpected server error.' });
    }
}
