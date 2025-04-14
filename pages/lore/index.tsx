import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export async function getStaticProps() {
  const files = fs.readdirSync(path.join(process.cwd(), 'content/lore'));
  const entries = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, '');
    const fileContent = fs.readFileSync(path.join('content/lore', filename), 'utf-8');
    const { data, content } = matter(fileContent);
    return {
      slug,
      title: data.title || slug,
      classification: data.classification || 'Unclassified',
      asset: data.asset || 'Unknown',
      date: new Date(data.date || '2025-01-01').toISOString(),
      tags: data.tags || [],
      excerpt: content.split('\n').find((line) => line.trim().length > 0)?.slice(0, 200) + '...'
    };
  });

  const sorted = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { props: { entries: sorted } };
}

export default function LoreIndex({ entries }) {
  const [openGroups, setOpenGroups] = useState({});
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [useDossierStyle, setUseDossierStyle] = useState(true);

  const filtered = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === '' || entry.classification === filter;
    return matchesSearch && matchesFilter;
  });

  const unclassified = filtered.filter(e => e.classification === 'Unclassified');
  const classified = filtered.filter(e => e.classification !== 'Unclassified');
  const grouped = classified.reduce((acc, entry) => {
    if (!acc[entry.classification]) acc[entry.classification] = {};
    if (!acc[entry.classification][entry.asset]) acc[entry.classification][entry.asset] = [];
    acc[entry.classification][entry.asset].push(entry);
    return acc;
  }, {});

  const toggle = (key) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
      <div className="bg-black min-h-screen text-white py-10 px-6 font-mono">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl text-green-400 font-bold mb-8 tracking-widest">BLACK VEIL // CLASSIFIED ARCHIVE</h1>

          {/* Must Read Section */}
          {unclassified.length > 0 && (
              <div className="mb-10 p-4 border border-yellow-500 bg-zinc-800 rounded">
                <h2 className="text-yellow-400 text-lg font-bold mb-2 uppercase">⚠ MUST READ — CORE INDEX</h2>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {unclassified.map(entry => (
                      <li key={entry.slug}>
                        <Link href={`/lore/${entry.slug}`} className="text-blue-400 hover:underline">
                          {entry.title}
                        </Link>
                      </li>
                  ))}
                </ul>
              </div>
          )}

          {/* Classification Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
            <div>
              <label className="block mb-1 text-sm text-green-400">Filter by Classification:</label>
              <select onChange={(e) => setFilter(e.target.value)} value={filter} className="bg-gray-900 border border-green-500 p-2 rounded">
                <option value="">All</option>
                {[...new Set(entries.map(e => e.classification))].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm text-green-400">Search by Title:</label>
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                     className="bg-gray-900 border border-green-500 p-2 rounded w-full sm:w-64" />
            </div>
            <div>
              <label className="block mb-1 text-sm text-green-400">View Mode:</label>
              <button
                  onClick={() => setUseDossierStyle(!useDossierStyle)}
                  className="bg-gray-800 border border-green-600 text-green-300 px-4 py-2 rounded hover:bg-green-900">
                {useDossierStyle ? 'Switch to Dashboard' : 'Switch to Dossier'}
              </button>
            </div>
          </div>

          {/* Classified Groups */}
          {Object.entries(grouped).map(([classification, assets]) => (
              <div key={classification} className="mb-6">
                <button
                    className="w-full text-left font-semibold bg-zinc-900 p-4 rounded border border-green-600 hover:bg-zinc-800 shadow-md transition-colors"
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
                          transition={{ duration: 0.3 }}
                          className="ml-4 mt-3 space-y-4 border-l-2 border-green-700 pl-4"
                      >
                        {Object.entries(assets).map(([asset, entries]) => (
                            <div key={asset}>
                              <div className="text-green-300 font-semibold text-sm mb-1">{asset}</div>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                {entries.map((entry) => (
                                    <li key={entry.slug}>
                                      <Link href={`/lore/${entry.slug}`} className="text-blue-400 hover:underline">
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
          ))}
        </div>
      </div>
  );
}