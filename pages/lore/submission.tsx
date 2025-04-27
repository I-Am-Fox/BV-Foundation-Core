// pages/submission.tsx
import React from 'react';
import DossierEditor from '../../components/DossierEditor';
import { withPageAuth } from 'supabase/auth-helpers-nextjs'

function SubmitPage() {
    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">New Asset Dossier</h1>
            <DossierEditor />
        </div>
    )
}

export const getServerSideProps = withPageAuth({
    redirectTo: '/login'
})

export default SubmitPage
