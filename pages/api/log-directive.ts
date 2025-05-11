// pages/api/log-directive.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // only safe in API routes
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ipAddress = Array.isArray(ip) ? ip[0] : ip;

  const userAgent = req.headers['user-agent'] || null;

  await supabase.from('directive_logs').insert([
    {
      ip_address: ipAddress,
      user_agent: userAgent,
    },
  ]);

  res.status(200).json({ success: true });
}
