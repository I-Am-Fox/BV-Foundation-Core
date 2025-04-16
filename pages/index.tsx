import MatrixRain from '../components/MatrixRain';
import ConsoleTitle from '../components/ConsoleTitle';

export default function Home() {
    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden scanlines">
            <MatrixRain />
            <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 text-center relative z-10">
                <ConsoleTitle
                    words={[
                        'BLACK VEIL ARCHIVE',
                        'SANCTIONED ACCESS ONLY'
                    ]}
                    speed={175}
                    pauseTime={5000}
                    className="mb-4 glow terminal-caret"
                />

                <p className="text-sm md:text-base text-green-200 max-w-xl mb-6">
                    A repository of sanctioned intelligence, character profiles, and recorded anomalies within the Black Veil domain.
                </p>

                <nav className="flex flex-wrap justify-center gap-3 px-4 py-2 border border-green-500 rounded shadow-lg bg-black/30 backdrop-blur">
                    {['Lore', 'Classified', 'Timeline'].map(link => (
                        <a
                            key={link}
                            href={`/${link.toLowerCase()}`}
                            className="text-green-300 hover:text-green-400 text-xs md:text-sm uppercase tracking-wide flicker-hover"
                        >
                            {link}
                        </a>
                    ))}
                    <span className="animate-pulse text-green-500 font-mono">|</span>
                </nav>
            </main>
        </div>
    );
}