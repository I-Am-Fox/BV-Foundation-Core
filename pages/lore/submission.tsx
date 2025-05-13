// pages/submission.tsx
import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import DossierEditor from '../../components/LoreElements/DossierEditor';

export default function SubmitPage() {
  return (
    <div className="flex justify-center px-4 py-8">
      {/* constrain width and center */}
      <div className="w-full max-w-3xl">
        <DossierEditor />
      </div>
    </div>
  );
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
