import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function TopNav() {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        if (data?.username) setUsername(data.username);
      }
    };
    fetchUsername();
  }, [session, supabase]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const navLinks = [
    { name: 'Index', href: '/' },
    { name: 'Lore', href: '/lore' },
    { name: 'Roleplay', href: '/characters' },
    { name: 'Locations', href: '/locations' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <nav className="w-full bg-black border-b border-green-700 px-6 py-3 font-mono text-green-400 uppercase tracking-wide text-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        {/* Left: Logo/Title */}
        <div className="text-green-300 font-bold text-lg">
          <Link href="/" className="hover:text-green-200 transition">
            BLACK VEIL FOUNDATION
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex justify-center gap-8 text-sm">
          {navLinks.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={`relative hover:text-green-200 transition 
                before:absolute before:-bottom-1 before:left-0 before:h-0.5 
                before:w-full before:scale-x-0 hover:before:scale-x-100 
                before:bg-green-300 before:transition-transform before:origin-left
                ${isActive(href) ? 'text-green-200 before:scale-x-100' : ''}`}
            >
              {name}
            </Link>
          ))}
        </div>

        {/* Right: Auth + Hamburger */}
        <div className="flex justify-end items-center gap-4">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="hover:text-green-200 transition"
                >
                  Welcome, {username || 'User'} ▾
                </button>
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-44 bg-black border border-green-600 text-green-300 shadow-lg font-mono text-xs z-50">
                    <li>
                      <Link href="/pages/profile-[username]" className="block px-4 py-2 hover:bg-green-800">
                        Profile Settings
                      </Link>
                    </li>
                    {session.user.email === ADMIN_EMAIL && (
                      <li>
                        <Link href="/admin-panel" className="block px-4 py-2 hover:bg-green-800">
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
                )}
              </div>
            ) : (
              <>
                <Link href="/auth" className="hover:text-green-200 transition">
                  Login
                </Link>
                <Link href="/auth?mode=signup" className="hover:text-green-200 transition">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-green-300 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-6 pb-4 border-t border-green-700">
          {navLinks.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={`block py-2 border-b border-green-800 ${isActive(href) ? 'text-green-200' : ''} hover:text-green-200`}
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </Link>
          ))}
          <div className="mt-4 border-t border-green-800 pt-2">
            {session ? (
              <>
                <span className="block py-1">Welcome, {username || 'User'}</span>
                <Link href="/pages/profile-[username]" className="block py-1 hover:text-green-200">
                  Profile Settings
                </Link>
                {session.user.email === ADMIN_EMAIL && (
                  <Link href="/admin-panel" className="block py-1 hover:text-green-200">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-1 hover:text-green-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="block py-1 hover:text-green-200">
                  Login
                </Link>
                <Link href="/auth?mode=signup" className="block py-1 hover:text-green-200">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
