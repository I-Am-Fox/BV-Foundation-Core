import Link from 'next/link';
import MatrixRain from '../components/MatrixRain';
import ConsoleTitle from '../components/ConsoleTitle';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden scanlines">
      <header className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 p-4 border border-red-500 bg-black/80 text-center z-20 rounded shadow-lg">
        <p className="text-red-500 text-sm md:text-lg uppercase tracking-wide">
          WARNING: THE FOUNDATION DATABASE IS
        </p>
        <p className="text-red-500 text-2xl md:text-4xl font-bold uppercase tracking-wider mt-2">
          CLASSIFIED
        </p>
        <p className="text-red-500 text-sm md:text-lg uppercase tracking-wide mt-2">
          UNAUTHORIZED PERSONNEL WILL BE TRACKED, LOCATED, AND DETAINED
        </p>
      </header>

      <MatrixRain />

      <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 text-center relative z-10">
        <ConsoleTitle
          words={['BLACK VEIL ARCHIVE', 'SANCTIONED ACCESS ONLY']}
          speed={175}
          pauseTime={5000}
          className="mb-4 glow terminal-caret"
        />

        <p className="text-sm md:text-base text-green-200 max-w-xl mb-6">
          A repository of sanctioned intelligence, character profiles, and recorded anomalies within
          the Black Veil domain.
        </p>

        <nav className="flex flex-wrap justify-center gap-3 px-4 py-2 border border-green-500 rounded shadow-lg bg-black/30 backdrop-blur">
          {['Lore', 'Classified', 'Timeline'].map((link) => (
            <Link key={link} href={`/${link.toLowerCase()}`}>
              <span className="text-green-300 hover:text-green-400 text-xs md:text-sm uppercase tracking-wide flicker-hover">
                {link}
              </span>
            </Link>
          ))}
          <span className="animate-pulse text-green-500 font-mono">|</span>
        </nav>
      </main>
    </div>
  );
};

export default Home;
