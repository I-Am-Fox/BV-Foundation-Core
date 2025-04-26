// pages/confirm.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabaseclient } from '../../lib/supabaseclient';

export default function ConfirmPage() {
    const router = useRouter();

    useEffect(() => {
        const confirmEmail = async () => {
            const { error } = await supabaseclient.auth.exchangeCodeForSession(router.asPath);
            if (!error) {
                // Redirect to login or dashboard after successful confirmation
                router.push('/login');
            }
        };

        if (router.isReady) {
            confirmEmail();
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white font-mono">
            <div className="text-center">
                <h1 className="text-2xl text-green-400 font-bold mb-4">Confirming your email...</h1>
                <p className="text-sm text-green-300">Please wait while we finalize your account activation.</p>
            </div>
        </div>
    );
}
