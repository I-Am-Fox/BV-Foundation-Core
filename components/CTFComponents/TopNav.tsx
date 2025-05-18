import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function GlitchTopNav() {
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
    <nav className="relative w-full bg-black border-b border-red-700 px-6 py-3 font-mono text-red-400 uppercase tracking-wide text-sm z-50 shadow-[0_2px_8px_#99000050]">
      {/* Glitch scanline overlay */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="w-full h-full scanline-glitch" />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center relative z-20">
        {/* Left: Logo/Title */}
        <div className="font-bold text-lg glitch-title select-none">
          <Link href="/" className="hover:text-red-200 transition glitch-title-inner">
            BLACK VEIL FOUNDATION
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex justify-center gap-8 text-sm">
          {navLinks.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={`relative transition 
                before:absolute before:-bottom-1 before:left-0 before:h-0.5 
                before:w-full before:scale-x-0 hover:before:scale-x-100 
                before:bg-red-500 before:transition-transform before:origin-left
                ${
                  isActive(href)
                    ? 'glitch-nav-active text-red-100 before:scale-x-100'
                    : 'glitch-nav'
                }`}
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
                  className="hover:text-red-200 transition"
                >
                  Welcome, {username || 'User'} ▾
                </button>
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-44 bg-black border border-red-600 text-red-300 shadow-lg font-mono text-xs z-50">
                    <li>
                      <Link
                        href={`/profile/${username}`}
                        className="block px-4 py-2 hover:bg-red-800"
                      >
                        Profile Settings
                      </Link>
                    </li>
                    {session.user.email === ADMIN_EMAIL && (
                      <li>
                        <Link href="/admin-panel" className="block px-4 py-2 hover:bg-red-800">
                          Admin Panel
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-800"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth" className="hover:text-red-200 transition">
                  Login
                </Link>
                <Link href="/auth?mode=signup" className="hover:text-red-200 transition">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-red-300 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 px-6 pb-4 border-t border-red-700 relative z-30 bg-black/95">
          {navLinks.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={`block py-2 border-b border-red-800 ${isActive(href) ? 'glitch-nav-active text-red-100' : 'glitch-nav'} hover:text-red-200`}
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </Link>
          ))}
          <div className="mt-4 border-t border-red-800 pt-2">
            {session ? (
              <>
                <span className="block py-1">Welcome, {username || 'User'}</span>
                <Link href={`/profile/${username}`} className="block py-1 hover:text-red-200">
                  Profile Settings
                </Link>
                {session.user.email === ADMIN_EMAIL && (
                  <Link href="/admin-panel" className="block py-1 hover:text-red-200">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-1 hover:text-red-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="block py-1 hover:text-red-200">
                  Login
                </Link>
                <Link href="/auth?mode=signup" className="block py-1 hover:text-red-200">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Glitch CSS for scanlines, flicker, and RGB split */}
      <style jsx>{`
        .scanline-glitch {
          width: 100vw;
          height: 100vh;
          background: repeating-linear-gradient(
            0deg,
            #19191b 0px,
            #19191b 7px,
            #2b181b 7px,
            #2b181b 14px
          );
          opacity: 0.1;
          animation: scanNav 3s infinite linear;
        }
        @keyframes scanNav {
          0% {
            opacity: 0.1;
          }
          45% {
            opacity: 0.18;
          }
          100% {
            opacity: 0.1;
          }
        }
        .glitch-title {
          position: relative;
          text-shadow:
            2px 0 #ff2b2b88,
            -2px 0 #43fff9a8,
            0 2px #fff8;
          animation: glitchTitle 2.5s infinite steps(2, jump-none);
        }
        .glitch-title-inner {
          display: inline-block;
          animation: flickerTextNav 2.2s infinite alternate;
        }
        @keyframes glitchTitle {
          0% {
            filter: none;
          }
          20% {
            filter: blur(0.5px) hue-rotate(5deg);
            left: 0px;
          }
          22% {
            left: 2px;
          }
          25% {
            filter: none;
            left: 0px;
          }
          50% {
            filter: blur(0.5px);
            left: -2px;
          }
          70% {
            filter: none;
            left: 0px;
          }
          100% {
            filter: none;
          }
        }
        @keyframes flickerTextNav {
          0%,
          100% {
            color: #fff;
          }
          50% {
            color: #ffdede;
          }
        }
        .glitch-nav {
          text-shadow:
            1.5px 0 #ff2b2b60,
            -1.5px 0 #43fff960,
            0 1.5px #fff5;
          transition: text-shadow 0.12s;
        }
        .glitch-nav:hover {
          text-shadow:
            3px 0 #ff2b2baa,
            -3px 0 #43fff9aa,
            0 3px #fff;
        }
        .glitch-nav-active {
          color: #fff;
          text-shadow:
            2px 0 #ff2b2baa,
            -2px 0 #43fff9aa,
            0 2px #fff;
          animation: flickerActive 1.4s infinite alternate;
        }
        @keyframes flickerActive {
          0%,
          100% {
            filter: none;
          }
          60% {
            filter: brightness(1.25) drop-shadow(0 0 4px #ff0000b0);
          }
        }
      `}</style>
    </nav>
  );
}
