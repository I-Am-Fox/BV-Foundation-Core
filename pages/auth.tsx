import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Auth() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('signup');

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error } =
        mode === 'signup'
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      router.push('/lore');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-green-800 rounded p-6">
        <h1 className="text-2xl font-bold text-green-300 mb-4 text-center">
          {mode === 'login' ? 'Welcome back' : 'Join the Archive'}
        </h1>

        <input
          className="w-full p-2 mb-3 border rounded bg-gray-800 text-white"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

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
