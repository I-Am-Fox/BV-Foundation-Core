// pages/classified.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import NavClassified from '../components/NavClassified';

export default function ClassifiedPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [command, setCommand] = useState('');
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

    useEffect(() => {
        const hasAccess = localStorage.getItem('bv_overseer_access');
        const expires = localStorage.getItem('bv_overseer_expires');
        if (hasAccess === 'true') setAuthenticated(true);
        if (expires && Date.now() > parseInt(expires)) {
            localStorage.removeItem('bv_overseer_access');
            localStorage.removeItem('bv_overseer_expires');
            setAuthenticated(false);
        }
    }, []);

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/api/overseer-auth', { password });
            if (res.data.success) {
                localStorage.setItem('bv_overseer_access', 'true');
                localStorage.setItem('bv_last_access', new Date().toISOString());
                localStorage.setItem('bv_overseer_expires', (Date.now() + 5 * 60 * 1000).toString());
                setAuthenticated(true);
                setError('');
            }
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Access denied.');
        }
    };

    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const input = command.trim();
            let output = `[CMD] > ${input}`;
            if (input.toLowerCase() === 'execute directive_14') {
                output += `\n[OK] Protocol memory echo initialized.`;
            } else if (input.toLowerCase() === 'unlock directive_19') {
                output += `\n[FAIL] Directive_19 is locked under Overseer node.`;
            } else {
                output += `\n[ERROR] Unrecognized system directive.`;
            }
            setConsoleOutput((prev) => [...prev, output]);
            setCommand('');
        }
    };

    if (!authenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white font-mono flicker">
                <div className="p-6 border border-red-600 bg-red-950/80 rounded shadow-lg">
                    <h2 className="text-red-400 text-lg font-bold mb-2">RESTRICTED ACCESS // OVERSIGHT CONTROL</h2>
                    <input
                        type="password"
                        className="w-full p-2 border border-red-500 bg-black text-white outline-none"
                        placeholder="ENTER CLEARANCE CODE"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleSubmit}
                        className="mt-3 w-full bg-red-600 hover:bg-red-500 text-black font-bold py-1"
                    >
                        ENGAGE OVERRIDE
                    </button>
                    {error && <p className="mt-3 text-sm text-red-300 animate-pulse">{error}</p>}
                    {!error && (
                        <p className="text-xs text-red-500 mt-2 animate-pulse">
                            Initializing override handshake...<br />
                            Breach attempt logged...<br />
                            Awaiting Directive confirmation...
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black text-red-300 p-8 font-mono min-h-screen flicker">
            <NavClassified />
            <h1 className="text-3xl font-bold text-red-400 border-b border-red-600 pb-2 mb-6">
                CLASSIFIED MANIFEST // OVERSIGHT LOG
            </h1>

            <section className="mb-8">
                <h2 className="text-xl text-red-300 font-semibold mb-2">System Classifications</h2>
                <ul className="space-y-1 text-sm">
                    <li><strong>ALPHA CLASS:</strong> Dimensional-impact anomalies. Level 5 required.</li>
                    <li><strong>THETA CLASS:</strong> Temporal and memory distortion. Level 4 clearance.</li>
                    <li><strong>DELTA CLASS:</strong> Corrupted entities. Obfuscation recommended.</li>
                    <li><strong>OCTANE CLASS:</strong> Physically volatile anomalies. Combat tags apply.</li>
                    <li><strong>FIELD AGENTS:</strong> Active human elements. Lower clearance observation.</li>
                    <li><strong>UNRESOLVED:</strong> Archived stasis files. Classification pending.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl text-red-300 font-semibold mb-2">Directive Protocol Index</h2>
                <ul className="text-sm space-y-1">
                    <li><span className="text-yellow-400">✔</span> Directive_14 — Memory Echo Protocol</li>
                    <li><span className="text-red-500">✖</span> Directive_19 — ███████████████</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl text-red-300 font-semibold mb-2">Submission Flowchart</h2>
                <pre className="text-xs text-red-400 bg-black border border-red-700 p-4 whitespace-pre-wrap">
[INTAKE] → [SCREENING: Protocol-C] → [STAGING: Submissions] → [ARCHIVE LIVE /lore]
                </pre>
            </section>

            <section className="mb-4">
                <h2 className="text-xl text-red-300 font-semibold mb-2">Command Input</h2>
                <input
                    type="text"
                    className="w-full bg-black border border-red-600 text-red-300 px-2 py-1 font-mono text-sm"
                    placeholder="> enter directive..."
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleCommand}
                />
                <div className="mt-4 bg-black border border-red-700 p-4 text-xs whitespace-pre-wrap space-y-1">
                    {consoleOutput.map((line, i) => (
                        <p key={i} className="text-red-400">{line}</p>
                    ))}
                </div>
            </section>

            <p className="text-xs text-red-500 mt-4">
                LAST OVERRIDE: {localStorage.getItem('bv_last_access')}
            </p>
        </div>
    );
}
