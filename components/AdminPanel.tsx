// components/AdminPanel.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

type SubmissionFile = {
  file: string;
};

export default function AdminPanel() {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string>('');

  useEffect(() => {
    if (!session) return;

    const checkAccess = async () => {
      const email = session.user?.email;
      if (!email || email !== ADMIN_EMAIL) {
        router.push('/');
      } else {
        setLoading(false);
      }
    };

    checkAccess();
  }, [session, router]);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('/api/list-submissions');
      const data = await res.json();
      if (Array.isArray(data)) setSubmissions(data.map((file: string) => ({ file })));
    };

    if (!loading) fetchFiles();
  }, [loading]);

  const loadPreview = async (file: string) => {
    const res = await fetch(`/api/load-submission?branch=submissions&file=${encodeURIComponent(file)}`);
    const data = await res.text();
    setPreviewContent(data);
    setSelectedFile(file);
  };

  const handleApprove = async () => {
    if (!selectedFile) return;
    const res = await fetch('/api/approve-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: selectedFile }),
    });
    const result = await res.json();
    setActionMessage(result.message || 'File approved and merged.');
  };

  const handleDeny = async () => {
    if (!selectedFile) return;
    const res = await fetch('/api/deny-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: selectedFile }),
    });
    const result = await res.json();
    setActionMessage(result.message || 'File deleted.');
  };

  if (!session || loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-green-300 font-mono">
          Checking admin access...
        </div>
    );
  }

  return (
      <div className="bg-black text-green-300 font-mono min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Welcome, {session.user.user_metadata?.display_name || session.user.email}
        </h1>
        <p className="mb-4">You have administrative privileges.</p>

        <h2 className="text-xl text-green-400 mb-2">Pending Submissions</h2>
        <div className="flex gap-8">
          <ul className="w-1/4 border border-green-800 p-4 bg-green-900/10 max-h-[75vh] overflow-y-auto">
            {submissions.map((entry) => (
                <li
                    key={entry.file}
                    className="cursor-pointer hover:text-green-200 text-sm mb-2"
                    onClick={() => loadPreview(entry.file)}
                >
                  {entry.file}
                </li>
            ))}
          </ul>

          <div className="w-3/4 border border-green-800 p-4 bg-green-900/10 max-h-[75vh] overflow-y-auto">
            {selectedFile ? (
                <>
                  <h3 className="text-lg mb-2">
                    Preview: <span className="font-bold">{selectedFile}</span>
                  </h3>
                  <pre className="whitespace-pre-wrap text-sm bg-black p-4 border border-green-600 mb-4">
                {previewContent}
              </pre>
                  <div className="flex gap-4">
                    <button
                        onClick={handleApprove}
                        className="bg-green-600 hover:bg-green-500 text-black font-bold py-1 px-4"
                    >
                      Approve
                    </button>
                    <button
                        onClick={handleDeny}
                        className="bg-red-600 hover:bg-red-500 text-black font-bold py-1 px-4"
                    >
                      Deny
                    </button>
                  </div>
                  {actionMessage && <p className="mt-4 text-green-400 text-sm">{actionMessage}</p>}
                </>
            ) : (
                <p>Select a submission file to preview.</p>
            )}
          </div>
        </div>
      </div>
  );
}
