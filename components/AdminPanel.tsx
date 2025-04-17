
import { useState } from 'react';

export default function AdminPanel() {
    const [auth, setAuth] = useState(false);
    const [password, setPassword] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const result = await res.json();
        if (result.success) {
            setAuth(true);
            setShowLogin(false);
        } else {
            setError('Access Denied');
        }
    };

    return (
        <>
            {/* Hidden Admin Hover Button */}
            <div className="fixed top-4 right-4 z-40">
                <button
                    onClick={() => setShowLogin(true)}
                    className="text-xs text-red-900 hover:text-red-500 transition-opacity opacity-0 hover:opacity-100"
                >
                    admin
                </button>
            </div>

            {/* Modal Login */}
            {showLogin && !auth && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-black border border-red-500 p-6 rounded-md shadow-lg text-red-300 font-mono w-80">
                        <p className="mb-3 font-bold text-red-400 text-center">ADMIN AUTHORIZATION</p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="bg-red-900 text-red-100 border border-red-700 px-3 py-2 w-full text-xs mb-3"
                        />
                        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handleLogin}
                                className="text-xs underline hover:text-red-200 transition-all"
                            >
                                Authenticate
                            </button>
                            <button
                                onClick={() => setShowLogin(false)}
                                className="text-xs text-red-500 hover:text-red-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Post-auth panel */}
            {auth && (
                <div className="fixed bottom-6 right-6 z-40 bg-black border border-green-500 p-4 text-xs text-green-300 font-mono rounded-md shadow-lg">
                    <p className="mb-2 font-bold text-green-400">✔ ACCESS GRANTED</p>
                    <p className="mb-1">• Submissions visible below.</p>
                    <p className="opacity-70">[future] Approve to push → GitHub</p>
                </div>
            )}
        </>
    );
}
