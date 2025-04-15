import MatrixRain from '../components/MatrixRain';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-green-400 font-mono">
      <MatrixRain />
      <main className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-widest neon-text typewriter mb-4">BLACK VEIL ARCHIVE</h1>
        <p className="mb-6 max-w-xl text-sm md:text-base text-green-300">
          A repository of sanctioned intelligence, character profiles, and recorded anomalies within the Black Veil domain.
        </p>
        <nav className="terminal-nav shadow-md border border-green-600 p-2 px-4 rounded-lg backdrop-blur-sm">
          <a href="/lore" className="terminal-link">LORE</a>
          <a href="/characters" className="terminal-link">CHARACTERS</a>
          <a href="/classified" className="terminal-link">CLASSIFIED</a>
          <a href="/timeline" className="terminal-link">TIMELINE</a>
          <span className="caret ml-2">|</span>
        </nav>
      </main>
    </div>
  );
}
