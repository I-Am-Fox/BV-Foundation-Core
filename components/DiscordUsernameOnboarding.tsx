import { useState } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const router = useRouter();

export default function DiscordUsernameOnboarding({ onComplete }: { onComplete?: () => void }) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [username, setUsername] = useState(session?.user?.user_metadata?.display_name || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Username: letters, numbers, underscores, 3-24 chars
  const isUsernameValid = (name: string) => /^[a-zA-Z0-9_]{3,24}$/.test(name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isUsernameValid(username)) {
      setError('Username must be 3-24 letters, numbers, or underscores (no spaces or symbols).');
      return;
    }

    setLoading(true);

    // 1. Check for uniqueness in profiles table
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

    // 2. Insert profile row
    const uuid = session?.user?.id;
    if (!uuid) {
      setError('Session expired. Please sign in again.');
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

    // 3. Update user_metadata.display_name to match username
    const { error: metaError } = await supabase.auth.updateUser({
      data: { display_name: username },
    });
    if (metaError) {
      setError('User profile updated, but failed to sync display name.');
      setLoading(false);
      return;
    }

    setLoading(false);
    if (onComplete) onComplete();
    router.push('/lore');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-green-800 rounded p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-green-300 mb-4 text-center">Pick a Username</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 mb-3 border border-gray-700 rounded bg-gray-900 text-white focus:ring-2 focus:ring-green-400 transition"
            type="text"
            placeholder="Choose a username"
            value={username}
            maxLength={24}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm font-bold mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 focus:ring-2 focus:ring-green-400 text-black font-bold py-2 mt-2 rounded transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Setting up…' : 'Save Username'}
          </button>
        </form>
      </div>
    </div>
  );
}
