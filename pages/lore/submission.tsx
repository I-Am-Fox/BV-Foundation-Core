// pages/submission.tsx
import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import DossierEditor from '../../components/DossierEditor';

export default function SubmitPage() {
  return <DossierEditor />;
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: { destination: '/auth', permanent: false },
    };
  }

  return {
    props: {
      initialSession: session,
    },
  };
};
