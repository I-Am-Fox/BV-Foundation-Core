// pages/profile-[username].tsx
import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function ProfilePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [lastChanged, setLastChanged] = useState<Date | null>(null);
  const [changeHistory, setChangeHistory] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [accountCreated, setAccountCreated] = useState<string>('');
  const [lastLogin, setLastLogin] = useState<string>('');

  useEffect(() => {
    if (!session?.user) return;

    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, updated_at')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setUsername(data.username);
        setLastChanged(data.updated_at ? new Date(data.updated_at) : null);
      }

      const historyRes = await supabase
        .from('username_history')
        .select('username')
        .eq('user_id', session.user.id)
        .order('changed_at', { ascending: false })
        .limit(3);

      if (historyRes.data) {
        setChangeHistory(historyRes.data.map((entry) => entry.username));
      }

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (user?.created_at) {
        const created = new Date(user.created_at);
        setAccountCreated(isNaN(created.getTime()) ? 'Not available' : created.toLocaleString());
      } else {
        setAccountCreated('Not available');
      }

      if (user?.last_sign_in_at) {
        const lastLoginDate = new Date(user.last_sign_in_at);
        setLastLogin(
          isNaN(lastLoginDate.getTime()) ? 'Not available' : lastLoginDate.toLocaleString()
        );
      } else {
        setLastLogin('Not available');
      }
    })();
  }, [session]);

  const getTimeRemaining = () => {
    if (!lastChanged) return 0;
    const diff = new Date().getTime() - lastChanged.getTime();
    return Math.max(0, 86400000 - diff);
  };

  const formatCountdown = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const handleUsernameUpdate = async () => {
    const remaining = getTimeRemaining();
    if (remaining > 0) {
      setError(`You can change your username again in ${formatCountdown(remaining)}.`);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username, updated_at: new Date().toISOString() })
      .eq('id', session!.user.id);

    const { error: historyError } = await supabase
      .from('username_history')
      .insert([{ user_id: session!.user.id, username }]);

    if (updateError || historyError) {
      setError('❌ Failed to update username.');
    } else {
      setMessage('✅ Username updated successfully.');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setError('❌ Passwords do not match or are empty.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmPasswordChange = async () => {
    setShowConfirmModal(false);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError('❌ Failed to update password.');
    } else {
      setMessage('✅ Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = confirm(
      'Are you sure you want to permanently delete your account? This cannot be undone.'
    );
    if (!confirmation) return;

    const { error } = await supabase.auth.admin.deleteUser(session!.user.id);
    if (error) {
      setError('❌ Failed to delete account.');
    } else {
      setMessage('✅ Account deleted. Redirecting...');
      setTimeout(() => router.push('/'), 2000);
    }
  };

  if (!session?.user) return <p className="text-white p-4">Loading...</p>;

  const isAdmin = session.user.email === ADMIN_EMAIL;
  const role = isAdmin ? 'Admin' : 'User';
  const roleColor = isAdmin ? 'text-red-500' : 'text-green-400';
  const roleDescription = isAdmin
    ? 'Admins have elevated privileges including access to the submission panel and GitHub actions.'
    : 'Users can manage their own profile and submit content for review.';

  const remaining = getTimeRemaining();

  return (
    <div className="min-h-screen bg-black text-green-300 p-6 font-mono">
      <h1 className="text-xl mb-6 border-b border-green-700 pb-2">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Role */}
        <div className="border border-green-700 p-4">
          <h2 className="text-lg font-bold mb-2">Account Role</h2>
          <p className={`text-2xl font-bold ${roleColor}`}>{role}</p>
          <p className="text-sm mt-2 text-green-400">{roleDescription}</p>
          <div className="mt-4 text-sm">
            <p>
              <span className="text-green-500">Created:</span> {accountCreated}
            </p>
            <p>
              <span className="text-green-500">Last Login:</span> {lastLogin}
            </p>
          </div>
        </div>

        {/* Username Update */}
        <div className="border border-green-700 p-4">
          <h2 className="text-lg font-bold mb-2">Username</h2>
          <input
            className="w-full p-2 mb-2 bg-black border border-green-600 text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={handleUsernameUpdate}
            className="bg-green-700 hover:bg-green-600 text-black font-bold py-1 px-4"
          >
            Update Username
          </button>
          {remaining > 0 && (
            <p className="text-sm text-yellow-400 mt-2">
              You can update your username again in {formatCountdown(remaining)}.
            </p>
          )}
        </div>

        {/* Password Update */}
        <div className="border border-green-700 p-4">
          <h2 className="text-lg font-bold mb-2">Change Password</h2>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 mb-2 bg-black border border-green-600 text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 mb-2 bg-black border border-green-600 text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            onClick={handlePasswordUpdate}
            className="bg-green-700 hover:bg-green-600 text-black font-bold py-1 px-4"
          >
            Update Password
          </button>
        </div>

        {/* Username History */}
        <div className="border border-green-700 p-4">
          <h2 className="text-lg font-bold mb-2">Recent Usernames</h2>
          <ul className="list-disc ml-4 text-green-400 text-sm">
            {changeHistory.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="mt-10 border border-red-700 p-4 bg-red-950">
        <h2 className="text-lg font-bold mb-2 text-red-400">Danger Zone</h2>
        <p className="text-sm mb-4 text-red-300">Once deleted, your account cannot be recovered.</p>
        <button
          disabled={isAdmin}
          onClick={handleDeleteAccount}
          className="bg-red-700 hover:bg-red-600 text-black font-bold py-1 px-4 disabled:opacity-40"
        >
          Delete My Account
        </button>
        {isAdmin && (
          <p className="text-xs text-red-300 mt-2">
            Administrators cannot delete their accounts via this panel.
          </p>
        )}
      </div>

      {/* Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20 transition-all">
          <div className="bg-green-950 p-6 border border-green-700 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to change your password?</p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setShowConfirmModal(false)} className="text-green-300">
                Cancel
              </button>
              <button
                onClick={confirmPasswordChange}
                className="text-black bg-green-500 px-4 py-1 font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="mt-6 text-green-400 text-sm">{message}</p>}
      {error && <p className="mt-6 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
