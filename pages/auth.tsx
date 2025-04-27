import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabaseclient } from '../lib/supabaseclient';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setError('');
    setMessage('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const { data, error } = await supabaseclient.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });

      if (error) {
        setError(error.message);
      } else {
        if (data.session?.access_token) {
          await logIPAddress(data.session.access_token);
        }
        setMessage('Check your inbox to confirm your email before logging in.');
      }
    } else {
      const { data, error } = await supabaseclient.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
      } else {
        if (data.session?.access_token) {
          await logIPAddress(data.session.access_token);
        }
        router.push('/');
      }
    }
  };

  const logIPAddress = async (accessToken: string) => {
    try {
      await fetch('https://ecjkdjalxokhpcarjvzb.supabase.co/functions/v1/log-ip-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      console.error('Failed to log IP address:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white font-mono">
      <div className="p-6 border border-green-600 bg-green-900/10 rounded shadow-md w-full max-w-sm">
        <h2 className="text-green-400 text-lg font-bold mb-4">
          {mode === 'login' ? 'Black Veil Operator Login' : 'Request Black Veil Access'}
        </h2>

        {mode === 'signup' && (
          <input
            type="text"
            className="w-full mb-3 p-2 bg-black border border-green-500 text-white placeholder-green-400"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        )}

        <input
          type="email"
          className="w-full mb-3 p-2 bg-black border border-green-500 text-white placeholder-green-400"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-3 p-2 bg-black border border-green-500 text-white placeholder-green-400"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === 'signup' && (
          <input
            type="password"
            className="w-full mb-3 p-2 bg-black border border-green-500 text-white placeholder-green-400"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2 mt-2"
        >
          {mode === 'login' ? 'Access Network' : 'Request Access'}
        </button>

        <div className="text-center text-xs text-green-300 mt-4">
          {mode === 'login' ? (
            <span>
              Need an account?{' '}
              <button className="underline" onClick={() => setMode('signup')}>
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button className="underline" onClick={() => setMode('login')}>
                Log In
              </button>
            </span>
          )}
        </div>

        {message && <p className="mt-3 text-sm text-green-300">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>
    </div>
  );
}
