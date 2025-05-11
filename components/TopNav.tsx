// components/TopNav.tsx
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function TopNav() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
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

          {session ? (
              <>
                {session.user.email === ADMIN_EMAIL && (
                    <li>
                      <Link href="/admin-panel">Admin Panel</Link>
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
                  <Link href="/auth?mode=signup" className="hover:text-green-300 transition">
                    Signup
                  </Link>
                </li>
              </>
          )}
        </ul>
      </nav>
  );
}
