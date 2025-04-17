
// pages/api/auth.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { password } = req.body;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!password) {
    return res.status(400).json({ error: 'No password provided' });
  }

  if (password === correctPassword) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: 'Access denied' });
  }
}
