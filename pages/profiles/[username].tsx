import { useEffect, useState, ChangeEvent } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function ProfilePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { username: routeUsername } = router.query as { username?: string };

  // Profile loaded from DB
  const [profile, setProfile] = useState<null | {
    username: string;
    id: string;
    updated_at: string;
    avatar_url: string | null;
  }>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [changeHistory, setChangeHistory] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [accountCreated, setAccountCreated] = useState<string>('');
  const [lastLogin, setLastLogin] = useState<string>('');

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Username input (for editing)
  const [usernameInput, setUsernameInput] = useState('');
  const [lastChanged, setLastChanged] = useState<Date | null>(null);

  // Fetch profile based on routeUsername
  useEffect(() => {
    if (!routeUsername || typeof routeUsername !== 'string') return;
    (async () => {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, id, updated_at, avatar_url')
        .eq('username', routeUsername)
        .single();
      if (error || !data) {
        setProfile(null);
      } else {
        setProfile(data);
        setUsernameInput(data.username);
        setLastChanged(data.updated_at ? new Date(data.updated_at) : null);
        const { data: historyData } = await supabase
          .from('username_history')
          .select('username')
          .eq('user_id', data.id)
          .order('changed_at', { ascending: false })
          .limit(3);
        if (historyData) setChangeHistory(historyData.map((e) => e.username));
      }
      setProfileLoading(false);
    })();
  }, [routeUsername, supabase]);

  // Fetch accountCreated & lastLogin for current user
  useEffect(() => {
    if (!session?.user) return;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (user?.created_at) {
        const created = new Date(user.created_at);
        setAccountCreated(isNaN(created.getTime()) ? 'Not available' : created.toLocaleString());
      } else setAccountCreated('Not available');
      if (user?.last_sign_in_at) {
        const lastLoginDate = new Date(user.last_sign_in_at);
        setLastLogin(
          isNaN(lastLoginDate.getTime()) ? 'Not available' : lastLoginDate.toLocaleString()
        );
      } else setLastLogin('Not available');
    })();
  }, [session, supabase]);

  // Permission logic
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  const isOwner = session?.user?.id === profile?.id;

  if (profileLoading) return <p className="text-white p-4">Loading...</p>;
  if (!profile)
    return (
      <div className="min-h-screen bg-black text-red-400 p-6 font-mono">⚠️ Profile not found.</div>
    );
  if (!isOwner && !isAdmin && routeUsername !== 'admin')
    return (
      <div className="min-h-screen bg-black text-red-400 p-6 font-mono">
        ⚠️ You do not have permission to view this profile.
      </div>
    );

  // Avatar handlers
  const onSelectAvatar = (e: ChangeEvent<HTMLInputElement>) =>
    setAvatarFile(e.target.files?.[0] ?? null);
  const uploadAvatar = async () => {
    if (!avatarFile || !session) return;
    setUploadingAvatar(true);
    try {
      const userId = session.user.id;
      const filePath = `${userId}/avatar-${Date.now()}-${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, avatarFile);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('user-files').getPublicUrl(filePath);
      const publicUrl = data?.publicUrl;
      if (!publicUrl) throw new Error('No URL returned');
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);
      if (dbError) throw dbError;
      setProfile((prev) => prev && { ...prev, avatar_url: publicUrl });
      setAvatarFile(null);
      setMessage('✅ Avatar uploaded successfully.');
    } catch (err) {
      console.error(err);
      setError('❌ Upload failed: ' + (err as Error).message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Username change handlers
  const getTimeRemaining = () =>
    lastChanged ? Math.max(0, 86400000 - (Date.now() - lastChanged.getTime())) : 0;
  const formatCountdown = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };
  const handleUsernameUpdate = async () => {
    const remaining = getTimeRemaining();
    if (remaining > 0)
      return setError(`You can change your username again in ${formatCountdown(remaining)}.`);
    if (usernameInput.trim().length < 3) return setError('❌ Username too short.');
    const { data: conflict } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', usernameInput)
      .neq('id', profile.id)
      .maybeSingle();
    if (conflict) return setError('❌ Username already taken.');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: usernameInput, updated_at: new Date().toISOString() })
      .eq('id', profile.id);
    await supabase
      .from('username_history')
      .insert([{ user_id: profile.id, username: usernameInput }]);
    if (updateError) return setError('❌ Failed to update username.');
    setMessage('✅ Username updated successfully.');
    setProfile((prev) => prev && { ...prev, username: usernameInput });
    setLastChanged(new Date());
  };

  // Password change handlers
  const handlePasswordUpdate = () => {
    if (!newPassword || newPassword !== confirmPassword)
      return setError('❌ Passwords do not match or are empty.');
    setShowConfirmModal(true);
  };
  const confirmPasswordChange = async () => {
    setShowConfirmModal(false);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return setError('❌ Failed to update password.');
    setMessage('✅ Password updated successfully.');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Account deletion handler
  const handleDeleteAccount = async () => {
    if (
      !confirm('Are you sure you want to permanently delete your account? This cannot be undone.')
    )
      return;
    const { error } = await supabase.auth.admin.deleteUser(profile.id);
    if (error) return setError('❌ Failed to delete account.');
    setMessage('✅ Account deleted. Redirecting...');
    setTimeout(() => router.push('/'), 2000);
  };

  const remaining = getTimeRemaining();

  return (
    <div className="min-h-screen bg-black text-green-300 p-6 font-mono">
      <h1 className="text-xl mb-6 border-b border-green-700 pb-2">Profile Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Avatar Section */}
        <div className="border border-green-700 p-4">
          <h2 className="text-lg font-bold mb-2">Avatar</h2>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Your avatar"
              width={120}
              height={120}
              className="rounded-full mb-2"
            />
          ) : (
            <p className="text-red-400 mb-2">No avatar uploaded</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onSelectAvatar}
            disabled={!isOwner && !isAdmin}
            className="mb-2"
          />
          <button
            onClick={uploadAvatar}
            disabled={!avatarFile || uploadingAvatar || (!isOwner && !isAdmin)}
            className="bg-green-700 hover:bg-green-600 text-black font-bold py-1 px-4"
          >
            {uploadingAvatar ? 'Uploading…' : 'Upload Avatar'}
          </button>
        </div>

        {/* Account Role Section */}
        <div className="border border-green-700 p-4">
          <h2 className="text-lg font-bold mb-2">Account Role</h2>
          <p className={`text-2xl font-bold ${isAdmin ? 'text-red-500' : 'text-green-400'}`}>
            {isAdmin ? 'Admin' : 'User'}
          </p>
          <p className="text-sm mt-2 text-green-400">
            {isAdmin
              ? 'Admins have elevated privileges including access to the submission panel and GitHub actions.'
              : 'Users can manage their own profile and submit content for review.'}
          </p>
          <div className="mt-4 text-sm">
            <p>
              <span className="text-green-500">Created:</span> {accountCreated}
            </p>
            <p>
              <span className="text-green-500">Last Login:</span> {lastLogin}
            </p>
          </div>
        </div>

        {/* Username Section */}
        <div className="border border-green-700 p-4">
          <h2 className="text-lg font-bold mb-2">Username</h2>
          <input
            className="w-full p-2 mb-2 bg-black border border-green-600 text-white"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            disabled={!isOwner && !isAdmin}
          />
          <button
            onClick={handleUsernameUpdate}
            className="bg-green-700 hover:bg-green-600 text-black font-bold py-1 px-4"
            disabled={!isOwner && !isAdmin}
          >
            Update Username
          </button>
          {remaining > 0 && (
            <p className="text-sm text-yellow-400 mt-2">
              You can update your username again in {formatCountdown(remaining)}.
            </p>
          )}
        </div>

        {/* Change Password Section */}
        <div className="border border-green-700 p-4">
          <h2 className="text-lg font-bold mb-2">Change Password</h2>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 mb-2 bg-black border border-green-600 text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={!isOwner && !isAdmin}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 mb-2 bg-black border border-green-600 text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!isOwner && !isAdmin}
          />
          <button
            onClick={handlePasswordUpdate}
            className="bg-green-700 hover:bg-green-600 text-black font-bold py-1 px-4"
            disabled={!isOwner && !isAdmin}
          >
            Update Password
          </button>
        </div>

        {/* Recent Usernames */}
        <div className="border border-green-700 p-4">
          <h2 className="text-lg font-bold mb-2">Recent Usernames</h2>
          <ul className="list-disc ml-4 text-green-400 text-sm">
            {changeHistory.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Danger Zone */}
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

      {/* Confirm Password Modal */}
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

      {/* Messages */}
      {message && <p className="mt-6 text-green-400 text-sm">{message}</p>}
      {error && <p className="mt-6 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
