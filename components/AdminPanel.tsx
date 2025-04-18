
import { useEffect, useState } from 'react';
import CommitPreviewModal from "./CommitPreviewModal";

type SubmissionMeta = {
    filename: string;
    title?: string;
    classification?: string;
    asset?: string;
};

export default function AdminPanel() {
    const [authenticated, setAuthenticated] = useState(false);
    const [submissions, setSubmissions] = useState<SubmissionMeta[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [password, setPassword] = useState('');
    const [accessScreen, setAccessScreen] = useState(false);
    const [typed, setTyped] = useState('');

    const accessText = '✔ ACCESS GRANTED\n\n• Submissions visible below.';

    useEffect(() => {
        if (authenticated) {
            setAccessScreen(true);
            let i = 0;
            const interval = setInterval(() => {
                setTyped(accessText.slice(0, i));
                i++;
                if (i > accessText.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setAccessScreen(false);
                        fetch('/api/submissions')
                            .then(res => res.json())
                            .then(data => setSubmissions(data.files));
                    }, 800);
                }
            }, 35);
        }
    }, [authenticated]);

    const handleApproveAndPush = (filename: string) => {
        setSelectedFile(filename);
        setShowPreview(true);
    };

    const confirmApprove = async () => {
        if (!selectedFile) return;
        await fetch('/api/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: selectedFile })
        });
        setSubmissions(submissions.filter(f => f.filename !== selectedFile));
        setShowPreview(false);
        setSelectedFile(null);
    };

    const handleDeny = async (filename: string) => {
        await fetch('/api/deny', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename })
        });
        setSubmissions(submissions.filter(f => f.filename !== filename));
    };

    const handleLogin = async () => {
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await res.json();
        if (data.success) {
            setAuthenticated(true);
            setShowLogin(false);
        }
    };

    return (
        <>
            <div className="fixed top-2 right-4 z-50 group">
                <div className="text-xs text-green-900 group-hover:text-green-300 cursor-pointer font-mono"
                     onClick={() => setShowLogin(true)}>
                    admin
                </div>
            </div>

            {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-black p-6 rounded border border-green-500 w-80">
                        <p className="text-green-300 mb-4 text-sm font-mono">Enter Admin Password</p>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-2 py-1 bg-black border border-green-700 text-green-200 mb-4 text-sm font-mono"
                        />
                        <button
                            onClick={handleLogin}
                            className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 text-sm font-mono w-full"
                        >
                            Authenticate
                        </button>
                    </div>
                </div>
            )}

            {accessScreen && (
                <div className="fixed inset-0 z-40 bg-black flex items-center justify-center text-center px-4">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">{typed}</pre>
                </div>
            )}

            {authenticated && !accessScreen && (
                <div className="p-4 max-w-4xl mx-auto">
                    <h1 className="text-green-300 text-xl mb-4 font-mono">🗂 Pending Submissions</h1>
                    {submissions.length === 0 ? (
                        <p className="text-sm text-yellow-400 font-mono">No files in queue.</p>
                    ) : (
                        <ul className="space-y-2 font-mono text-green-200">
                            {submissions.map(file => (
                                <li key={file.filename} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-green-800 px-4 py-2 rounded bg-black bg-opacity-40">
                                    <div>
                                        <span className="text-green-100">{file.filename}</span>
                                        <span className="ml-2 text-yellow-400">[{file.classification}]</span>
                                        <span className="ml-2 text-green-300">{file.title}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap">
                                        <button
                                            onClick={() => handleApproveAndPush(file.filename)}
                                            className="text-xs px-2 py-1 bg-green-700 hover:bg-green-600 text-white"
                                        >
                                            Approve & Push
                                        </button>
                                        <button
                                            onClick={() => handleDeny(file.filename)}
                                            className="text-xs px-2 py-1 bg-red-700 hover:bg-red-600 text-white"
                                        >
                                            Deny
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {showPreview && selectedFile && (
                <CommitPreviewModal
                    filename={selectedFile}
                    onConfirm={confirmApprove}
                    onCancel={() => {
                        setShowPreview(false);
                        setSelectedFile(null);
                    }}
                />
            )}
        </>
    );
}
