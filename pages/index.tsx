import { useEffect, useState } from "react";

export default function Home() {
    const [consoleLines, setConsoleLines] = useState<string[]>([]);
    const [showLoading, setShowLoading] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);

    useEffect(() => {
        const sequence = [
            "[BOOT] Initializing secure terminal interface...",
            "[SYS] Establishing encrypted uplink...",
            "[AUTH] Running Black Veil identity verification...",
            "[ACCESS] Clearance level confirmed: ALPHA",
            "[ENTRY] Welcome, Operative."
        ];

        let delay = 700;
        sequence.forEach((line, index) => {
            setTimeout(() => {
                setConsoleLines(prev => [...prev, line]);
                if (index === sequence.length - 1) {
                    setTimeout(() => setShowLoading(true), 1200);
                    setTimeout(() => setAccessGranted(true), 3500);
                }
            }, delay * (index + 1));
        });
    }, []);

    if (!accessGranted) {
        return (
            <div className="min-h-screen bg-black text-green-400 font-mono text-sm flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#0f0_1px,transparent_1px)] bg-[length:100%_2px] opacity-10 pointer-events-none animate-scanlines"></div>
                <div className="w-full max-w-2xl p-4">
                    <div className="bg-black border border-green-700 p-6 rounded shadow-inner shadow-green-900 backdrop-blur-sm">
            <pre className="whitespace-pre-line animate-fade text-shadow-glow leading-relaxed">
              {consoleLines.join("\n")}
                {showLoading ? "\n> Loading BLACK VEIL ARCHIVE..." : <span className="animate-blink">_</span>}
            </pre>
                    </div>
                </div>
                <style jsx global>{`
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          @keyframes scanlines {
            0% { background-position-y: 0; }
            100% { background-position-y: 100%; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .animate-blink {
            animation: blink 1s step-start infinite;
          }
          .animate-fade {
            animation: flicker 0.4s ease-in-out forwards;
          }
          .animate-scanlines {
            animation: scanlines 2s linear infinite;
          }
          .text-shadow-glow {
            text-shadow: 0 0 2px #0f0, 0 0 8px #0f0;
          }
        `}</style>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 tracking-widest">BLACK VEIL ARCHIVE</h1>
            <p className="mb-6 text-lg max-w-xl text-center text-gray-300">
                A repository of sanctioned intelligence, character profiles, and recorded anomalies within the Black Veil domain.
            </p>
            <nav className="space-x-4">
                <a href="/lore" className="uppercase text-sm hover:text-green-400 transition-colors">Lore</a>
                <a href="/characters" className="uppercase text-sm hover:text-green-400 transition-colors">Characters</a>
                <a href="/classified" className="uppercase text-sm hover:text-green-400 transition-colors">Classified</a>
                <a href="/timeline" className="uppercase text-sm hover:text-green-400 transition-colors">Timeline</a>
            </nav>
            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }
            `}</style>
        </main>
    );
}
