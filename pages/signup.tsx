// pages/signup.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabaseclient } from '../lib/supabaseclient';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    const { error } = await supabaseclient.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your inbox to confirm your email before logging in.');
      setError('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white font-mono">
      <div className="p-6 border border-green-600 bg-green-900/10 rounded shadow-md w-full max-w-sm">
        <h2 className="text-green-400 text-lg font-bold mb-4">Create Black Veil Access</h2>
        <input
          type="email"
          className="w-full mb-3 p-2 bg-black border border-green-500 text-white placeholder-green-400"
          placeholder="email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-3 p-2 bg-black border border-green-500 text-white placeholder-green-400"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-2"
        >
          Request Access
        </button>
        {message && <p className="mt-3 text-sm text-green-300">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>
    </div>
  );
}
