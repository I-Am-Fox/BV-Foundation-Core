// components/TopNav.tsx
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function TopNav() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();

        if (!error && data?.username) {
          setUsername(data.username);
        }
      }
    };

    fetchUsername();
  }, [session, supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  return (
    <nav className="w-full bg-black text-green-400 px-4 py-2 border-b border-green-700 text-sm font-mono">
      <div className="flex items-center justify-center relative">
        <ul className="flex gap-4 mx-auto">
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
        </ul>

        {session && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-green-300 transition ml-4"
            >
              Welcome, {username || 'User'}
            </button>
            <ul
              className={`absolute right-0 mt-2 w-56 bg-black border border-green-600 text-left text-green-300 shadow-lg z-10 transition-all duration-200 ease-in-out transform origin-top-right ${
                dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <li>
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-green-800"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile Settings
                </Link>
              </li>
              {session.user.email === ADMIN_EMAIL && (
                <li>
                  <Link
                    href="/admin-panel"
                    className="block px-4 py-2 hover:bg-green-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-green-800"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}

        {!session && (
          <ul className="flex gap-4 ml-auto">
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
          </ul>
        )}
      </div>
    </nav>
  );
}
