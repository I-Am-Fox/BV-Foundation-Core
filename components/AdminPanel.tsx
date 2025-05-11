// components/AdminPanel.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabaseclient } from '../lib/supabaseclient';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabaseclient.auth.getUser();
      if (!data?.user || data.user.email !== ADMIN_EMAIL) {
        router.push('/');
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-green-300 font-mono">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="bg-black text-green-300 font-mono min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-green-400">
        Welcome, {user?.user_metadata?.display_name || user?.email}
      </h1>
      <p className="mb-6">You have administrative privileges.</p>

      <p className="text-sm opacity-80">(Submissions panel coming next!)</p>
    </div>
  );
}
