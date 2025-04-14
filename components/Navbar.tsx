
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <ul className="flex gap-6 text-sm uppercase tracking-widest">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/lore">Lore</Link></li>
        <li><Link href="/characters">Characters</Link></li>
        <li><Link href="/classified">Classified</Link></li>
        <li><Link href="/timeline">Timeline</Link></li>
      </ul>
    </nav>
  );
}
