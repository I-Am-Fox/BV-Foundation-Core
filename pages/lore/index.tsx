import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useState } from 'react';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import ContributeModal from '../../components/ContributeModal';
import Directive from '../../components/Directive';
import ContainmentMonitor from '../../components/ContainmentMonitor';

type Entry = {
  slug: string;
  frontMatter: {
    title: string;
    classification: string;
    asset: string;
  };
};

type LoreIndexProps = {
  entries: Entry[];
};

export const getStaticProps: GetStaticProps<LoreIndexProps> = async () => {
  const loreDirectory = path.join(process.cwd(), 'content/lore');

  const files = fs
    .readdirSync(loreDirectory)
    .filter((file) => file.endsWith('.mdx') && !file.startsWith('UNCLASSIFIED'));

  const entries = files.map((filename) => {
    const filePath = path.join(loreDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter } = matter(fileContent);
    return {
      slug: filename.replace(/\.mdx$/, ''),
      frontMatter: {
        title: frontMatter.title || 'Untitled',
        classification: (frontMatter.classification || 'UNCLASSIFIED').toUpperCase(),
        asset:
          typeof frontMatter.asset === 'string' && frontMatter.asset.trim()
            ? frontMatter.asset.trim()
            : 'Unknown Asset',
      },
    };
  });

  return {
    props: {
      entries,
    },
  };
};

export default function LoreIndex({ entries }: LoreIndexProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [subExpanded, setSubExpanded] = useState<string | null>(null);
  const [showContribute, setShowContribute] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleExpand = (classification: string) => {
    if (allExpanded) return;
    setExpanded(expanded === classification ? null : classification);
    setSubExpanded(null);
  };

  const toggleSubExpand = (asset: string) => {
    setSubExpanded(subExpanded === asset ? null : asset);
  };

  const toggleAll = () => {
    setAllExpanded(!allExpanded);
    if (!allExpanded) {
      setExpanded(null);
      setSubExpanded(null);
    }
  };

  const existing = new Set(entries.map((entry) => entry.frontMatter.classification));
  const classifications = [
    'FIELD AGENTS',
    'ALPHA CLASS',
    'ANCHOR CLASS',
    'BETA CLASS',
    'DELTA CLASS',
    'OCTANE CLASS',
    'REVENANT CLASS',
    'THETA CLASS',
  ].filter((c) => existing.has(c) || ['ALPHA CLASS', 'DELTA CLASS'].includes(c));

  return (
    <div className="bg-black text-white px-6 py-10 min-h-screen font-mono scanlines">
      <h1 className="text-4xl font-bold text-green-400 tracking-widest glow mb-8 terminal-caret text-center">
        BLACK VEIL // CLASSIFIED ARCHIVE
      </h1>

      <>
        <Directive />
      </>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-md border border-yellow-500 bg-yellow-900/10 p-4">
          <p className="font-mono text-yellow-400 font-semibold">⚠️ MUST READ — CORE INDEX</p>
          <p className="text-sm text-yellow-300 font-mono mt-1">
            • This document outlines classification protocols, clearance procedures, and access
            levels.
            <br />
            <Link
              href="/lore/UNCLASSIFIED_black-veil-classification-index"
              className="underline text-yellow-200 hover:text-yellow-100 transition-colors"
            >
              Open Classification Index →
            </Link>
          </p>
        </div>

        <div className="rounded-md border border-red-500 bg-red-900/10 p-4">
          <p className="font-mono text-red-400 font-semibold">🛠️ CONTRIBUTE TO BLACK VEIL</p>
          <p className="text-sm text-red-300 font-mono mt-1">
            • Submit intel, assets, or redacted entries.
            <br />• All submissions are screened by Protocol‑C.
          </p>
          <div className="mt-4 flex items-center">
            <Link
              href="/lore/submission"
              className="text-xs underline text-red-200 hover:text-red-100 transition"
            >
              Begin Submission →
            </Link>
            <Link
              href="/lore/submission-help"
              className="ml-auto text-xs underline text-red-200 hover:text-red-100 transition"
            >
              Submission Help →
            </Link>
          </div>
        </div>

        <ContainmentMonitor entries={entries} />
      </div>

      {/* Expand All Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleAll}
          className="text-sm px-3 py-1 border border-green-400 text-green-300 hover:bg-green-800 rounded"
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="space-y-4">
        {classifications.map((classification) => (
          <div key={classification}>
            <button
              onClick={() => toggleExpand(classification)}
              className={`w-full text-left px-4 py-2 transition-all duration-500 ${
                classification === 'FIELD AGENTS'
                  ? 'bg-black border border-red-500 text-red-300 hover:bg-red-900'
                  : 'bg-black border border-green-500 text-green-300 hover:bg-green-900'
              }`}
            >
              ▶ {classification}
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                allExpanded || expanded === classification
                  ? 'max-h-[1000px] opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pl-4 mt-2 space-y-2">
                {[
                  ...new Set(
                    entries
                      .filter((e) => e.frontMatter.classification === classification)
                      .map((e) => e.frontMatter.asset || 'Unknown Asset')
                  ),
                ].map((asset) => (
                  <div key={asset}>
                    <button
                      onClick={() => toggleSubExpand(asset)}
                      className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                    >
                      📁 {asset}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 pl-6 ${
                        allExpanded || subExpanded === asset
                          ? 'max-h-[1000px] opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <ul className="list-disc list-inside text-green-300">
                        {entries
                          .filter(
                            (e) =>
                              e.frontMatter.classification === classification &&
                              e.frontMatter.asset === asset
                          )
                          .map((e) => (
                            <li key={e.slug}>
                              <Link
                                href={`/lore/${e.slug}`}
                                className="hover:text-green-100 underline"
                              >
                                {e.frontMatter.title}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showContribute && <ContributeModal onClose={() => setShowContribute(false)} />}
    </div>
  );
}
