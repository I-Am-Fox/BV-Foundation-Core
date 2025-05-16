import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import MatrixRain from '../components/MatrixRain';
import DiscordUsernameOnboarding from '../components/DiscordUsernameOnboarding';

export default function Auth() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [needsUsername, setNeedsUsername] = useState(false);
  const [checkedProfile, setCheckedProfile] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  // Username validation: letters, numbers, underscores, 3-24 chars
  const isUsernameValid = (name: string) => /^[a-zA-Z0-9_]{3,24}$/.test(name);

  // After Discord OAuth, check if user is missing a profile row
  useEffect(() => {
    const checkProfile = async () => {
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('uuid', session.user.id)
          .maybeSingle();
        setNeedsUsername(!data);
        setCheckedProfile(true);
      } else {
        setCheckedProfile(true);
      }
    };
    checkProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  // Email/password sign up and login
  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (mode === 'signup') {
      if (!isUsernameValid(username)) {
        setError('Username must be 3-24 letters, numbers, or underscores (no spaces or symbols).');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (!agreedToTerms || !agreedToPrivacy) {
        setError('Please agree to Terms and Privacy Policy.');
        setLoading(false);
        return;
      }

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingProfile) {
        setError('Username already taken');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: username } },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const uuid = data.user?.id;
      if (!uuid) {
        setError('Account created, but missing user ID.');
        setLoading(false);
        return;
      }

      const { error: profileInsertError } = await supabase
        .from('profiles')
        .insert([{ uuid, username }]);

      if (profileInsertError) {
        setError('Profile creation failed');
        setLoading(false);
        return;
      }

      router.push('/lore');
      setLoading(false);
      return;
    }

    // Login
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/lore');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Discord OAuth handler
  const handleDiscordLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({ provider: 'discord' });
      // User will be redirected away and back; onboarding will be triggered via useEffect above
    } catch (err: any) {
      setError(err.message || 'Discord login failed');
    } finally {
      setLoading(false);
    }
  };

  // Show onboarding if Discord user is missing a username
  if (session?.user && checkedProfile && needsUsername) {
    return <DiscordUsernameOnboarding onComplete={() => setNeedsUsername(false)} />;
  }

  // Main Auth UI
  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4 z-10">
      <MatrixRain />
      <div className="w-full max-w-md bg-neutral-900 border border-green-800 rounded p-6 shadow-2xl z-10">
        <h1 className="text-2xl font-bold text-green-300 mb-4 text-center">
          {mode === 'login' ? 'Welcome back' : 'Join the Archive'}
        </h1>

        <button
          onClick={handleDiscordLogin}
          className="w-full bg-discord py-2 mb-4 rounded font-bold flex items-center justify-center transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          disabled={loading}
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            fill="currentColor"
            className="mr-2"
            viewBox="0 0 24 24"
          >
            <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515..."></path>
          </svg>
          Sign in with Discord
        </button>

        <div className="my-3 flex items-center">
          <hr className="flex-1 border-gray-700" />
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        <input
          className="w-full p-2 mb-3 border rounded bg-gray-800 text-white"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {mode === 'signup' && (
          <input
            className="w-full p-2 mb-3 border rounded bg-gray-800 text-white"
            type="text"
            placeholder="Username (display name)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={24}
          />
        )}

        <input
          className="w-full p-2 mb-3 border rounded bg-gray-800 text-white"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === 'signup' && (
          <>
            <input
              className="w-full p-2 mb-3 border rounded bg-gray-800 text-white"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <label className="flex items-center text-xs text-green-300 mb-1">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                className="mr-2 accent-green-500"
              />
              I agree to the{' '}
              <a href="/terms" className="underline ml-1" target="_blank" rel="noopener noreferrer">
                Terms of Use
              </a>
            </label>

            <label className="flex items-center text-xs text-green-300 mb-3">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={() => setAgreedToPrivacy(!agreedToPrivacy)}
                className="mr-2 accent-green-500"
              />
              I agree to the{' '}
              <a
                href="/privacy"
                className="underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </label>
          </>
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || (mode === 'signup' && (!agreedToTerms || !agreedToPrivacy))}
          className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2 mt-2 disabled:opacity-50"
        >
          {loading ? 'Loading...' : mode === 'login' ? 'Access Network' : 'Request Access'}
        </button>

        <p className="text-center text-sm text-green-400 mt-4">
          {mode === 'login' ? 'Need an account?' : 'Already have access?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="underline font-bold text-white"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
