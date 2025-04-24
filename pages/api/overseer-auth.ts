import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function validatePassword(providedPassword: string, storedHashedPassword: string): boolean {
    const hashedPassword = hashPassword(providedPassword);
    return hashedPassword === storedHashedPassword;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const { password } = req.body;
        const hashedOverseerPassword = process.env.OVERSEER_PASSWORD;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        if (!hashedOverseerPassword) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const isValid = validatePassword(password, hashedOverseerPassword);

        if (isValid) {
            return res.status(200).json({ success: true, message: 'Overseer clearance granted' });
        } else {
            return res.status(401).json({ success: false, error: 'Access denied. Invalid clearance code.' });
        }
    } catch (error) {
        console.error('Overseer auth error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
