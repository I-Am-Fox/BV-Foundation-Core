// pages/submission.tsx
import React from 'react';
import DossierEditor from '../../components/DossierEditor';
import { createBrowserClient } from '@supabase/ssr';
import type { NextApiRequest, NextApiResponse } from 'next';

function SubmitPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">New Asset Dossier</h1>
      <DossierEditor />
    </div>
  );
}

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  // initialize a server-side supabase client tied to the incoming request
  const supabase = createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // check if there's an active session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default SubmitPage;
