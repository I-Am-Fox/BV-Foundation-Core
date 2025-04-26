// components/TopNav.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabaseclient } from '../lib/supabaseclient';

export default function TopNav() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabaseclient.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabaseclient.auth.signOut();
    setUser(null);
    window.location.href = '/'; // Force refresh after logout
  };

  return (
      <nav className="w-full bg-black text-green-400 px-4 py-2 border-b border-green-700 text-sm font-mono">
        <ul className="flex gap-4 justify-center">
          <li>
            <Link href="/">Index</Link>
          </li>
          <li>
            <Link href="/lore">Lore</Link>
          </li>
          <li>
            <Link href="/characters">Classified – Roleplay</Link>
          </li>
          <li>
            <Link href="/timeline">Timeline</Link>
          </li>

          {!loading && (
              <>
                {user ? (
                    <>
                      {user.app_metadata?.role === 'admin' && (
                          <li>
                            <Link href="components/AdminPanel.tsx">Admin Panel</Link>
                          </li>
                      )}
                      <li>
                        <button onClick={handleLogout} className="hover:text-green-300 transition">
                          Logout
                        </button>
                      </li>
                    </>
                ) : (
                    <>
                      <li>
                        <Link href="/auth" className="hover:text-green-300 transition">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link href="/auth" className="hover:text-green-300 transition">
                          Signup
                        </Link>
                      </li>
                    </>
                )}
              </>
          )}
        </ul>
      </nav>
  );
}
