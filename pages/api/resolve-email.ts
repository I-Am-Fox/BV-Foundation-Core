// pages/api/resolve-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // MUST be the secret service role key (not public)
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing username' });
  }

  // Step 1: Look up the user ID by username in the public profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (profileError || !profile?.id) {
    return res.status(404).json({ error: 'Username not found' });
  }

  // Step 2: Look up the actual email in the private auth.users table
  const { data: userResult, error: userError } = await supabase.auth.admin.getUserById(profile.id);

  if (userError || !userResult?.user?.email) {
    return res.status(500).json({ error: 'Could not resolve email address' });
  }

  return res.status(200).json({ email: userResult.user.email });
}
