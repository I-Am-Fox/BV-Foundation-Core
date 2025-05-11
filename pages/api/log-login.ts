// pages/api/log-login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const ipRaw = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const ipAddress = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw;
        const userAgent = req.headers['user-agent'] || 'unknown';

        const { error } = await supabase.from('login_logs').insert([
            {
                ip_address: ipAddress,
                user_agent: userAgent,
            }
        ]);

        if (error) {
            console.error('Login log error:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ success: true });
    } catch (err: any) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ error: err.message });
    }
}
