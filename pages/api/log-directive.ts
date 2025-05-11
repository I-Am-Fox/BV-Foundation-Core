// pages/api/log-directive.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // safe here, only runs on server
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ipRaw = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ipAddress = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw;
  const userAgent = req.headers['user-agent'] || 'unknown';

  const { error } = await supabase.from('directive_logs').insert([
    {
      ip_address: ipAddress,
      user_agent: userAgent,
    },
  ]);

  if (error) {
    console.error('Failed to log IP address:', error);
    return res.status(500).json({ error: 'Failed to log access' });
  }

  return res.status(200).json({ success: true });
}
