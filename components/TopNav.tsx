import Link from 'next/link';

export default function TopNav() {
    return (
        <nav className="w-full bg-black text-green-400 px-4 py-2 border-b border-green-700 text-sm font-mono">
            <ul className="flex gap-4 justify-center">
                <li><Link href="/">Index</Link></li>
                <li><Link href="/lore">Lore</Link></li>
                <li><Link href="/characters">Characters</Link></li>
                <li><Link href="/classified">Classified</Link></li>
                <li><Link href="/timeline">Timeline</Link></li>
            </ul>
        </nav>
    );
}
