
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err || !files.file) {
            return res.status(400).json({ error: 'File upload failed.' });
        }

        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
        const filename = uploadedFile.originalFilename!;

        if (!filename.match(/^(ALPHA|BETA|DELTA|THETA|OCTANE)_.+\.mdx$/)) {
            return res.status(400).json({ error: 'Invalid filename format.' });
        }

        const savePath = path.join(process.cwd(), 'content', 'submissions');
        fs.mkdirSync(savePath, { recursive: true });

        const targetPath = path.join(savePath, filename);

        try {
            const fileData = fs.readFileSync(uploadedFile.filepath);
            fs.writeFileSync(targetPath, fileData);
            return res.status(200).json({ success: true });
        } catch (writeErr) {
            console.error('❌ Could not save file:', writeErr);
            return res.status(500).json({ error: 'Could not save file.' });
        }
    });
}
