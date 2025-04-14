
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
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
    </main>
  );
}
