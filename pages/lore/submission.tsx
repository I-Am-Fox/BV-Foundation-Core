// pages/submission.tsx
import React from 'react';
import DossierEditor from '../../components/DossierEditor';
import { createServerClient } from '@supabase/ssr';
import type { GetServerSideProps } from 'next';
import { serialize } from 'cookie';

export default function SubmitPage() {
  /* … */
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          // NextApiRequestCookies is a record<string, string>
          return req.cookies[name] ?? null;
        },
        set: (name, value, options) => {
          // Append a Set-Cookie header
          const str = serialize(name, value, options);
          // if you have other cookies to write, you might need to merge headers
          res.setHeader('Set-Cookie', str);
        },
        remove: (name, options) => {
          // To delete: set maxAge=0
          const str = serialize(name, '', { ...options, maxAge: 0 });
          res.setHeader('Set-Cookie', str);
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: { destination: '/auth', permanent: false },
    };
  }

  return { props: {} };
};
