
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  'DELTA': 'text-red-400',
  'BETA': 'text-yellow-400',
  'OCTANE': 'text-green-400',
  'ALPHA': 'text-green-300',
  'UNCLASSIFIED': 'text-gray-400',
};

export default function Sidebar({ children }: Readonly<{ children: React.ReactNode }>) {
  const [structure, setStructure] = useState<Record<string, Record<string, { slug: string; title: string }[]>>>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/lore-structure')
      .then(res => res.json())
      .then(setStructure);
  }, []);

  const toggle = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !(prev[key] ?? false) }));
  };

  return (
    <div className="flex">
      <aside className="w-72 bg-zinc-900 text-white p-4 border-r border-green-700 min-h-screen overflow-y-auto">
        <div className="text-green-400 text-lg font-bold mb-4 tracking-widest">BLACK VEIL</div>
        <nav className="space-y-3 text-sm">
          <a href="/" className="block hover:text-green-400">Home</a>
          <a href="/lore" className="block hover:text-green-400">Lore</a>
          <a href="/characters" className="block hover:text-green-400">Characters</a>
          <a href="/timeline" className="block hover:text-green-400">Timeline</a>
        </nav>
        <hr className="my-4 border-green-800" />
        <nav className="space-y-3 text-sm">
          {Object.entries(structure).map(([classification, assets]) => {
            const color = COLORS[classification.toUpperCase() as keyof typeof COLORS] ?? 'text-white';
            return (
              <div key={classification}>
                <button
                  className={`w-full text-left font-semibold ${color} hover:text-green-200`}
                  onClick={() => toggle(classification)}
                >
                  {openGroups[classification] ? '▾' : '▸'} {classification.toUpperCase()}
                </button>
                <AnimatePresence initial={false}>
                  {openGroups[classification] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 mt-1 space-y-2 border-l border-green-800 pl-3"
                    >
                      {Object.entries(assets).map(([asset, entries]: [string, { slug: string; title: string }[]]) => (
                        <div key={asset}>
                          <div className="text-green-300 font-mono text-xs mb-1">{asset}</div>
                          <ul className="space-y-1 text-xs list-disc list-inside text-blue-300">
                            {entries.map(entry => (
                              <li key={entry.slug}>
                                <Link href={`/lore/${entry.slug}`} className="hover:underline">
                                  {entry.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 bg-black text-white p-6 overflow-x-hidden">{children}</main>
    </div>
  );
}
