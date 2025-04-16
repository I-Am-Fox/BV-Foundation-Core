import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useState } from 'react';
import Link from 'next/link';
import type { GetStaticProps } from 'next';

type Entry = {
  slug: string;
  frontMatter: {
    title: string;
    classification: string;
    asset?: string;
  };
};

type LoreIndexProps = {
  entries: Entry[];
};

export const getStaticProps: GetStaticProps<LoreIndexProps> = async () => {
  const loreDirectory = path.join(process.cwd(), 'content/lore');
  const files = fs.readdirSync(loreDirectory)
      .filter(file => file.endsWith('.mdx') && !file.startsWith('UNCLASSIFIED'));

  const entries = files.map((filename) => {
    const filePath = path.join(loreDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter } = matter(fileContent);
    return {
      slug: filename.replace(/\.mdx$/, ''),
      frontMatter: {
        title: frontMatter.title || 'Untitled',
        classification: (frontMatter.classification || 'UNCLASSIFIED').toUpperCase(),
        asset: frontMatter.asset?.trim() || 'Unknown Asset',
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

  const toggleExpand = (classification: string) => {
    setExpanded(expanded === classification ? null : classification);
    setSubExpanded(null);
  };

  const toggleSubExpand = (asset: string) => {
    setSubExpanded(subExpanded === asset ? null : asset);
  };

  const classifications = Array.from(new Set(
      entries
          .map(entry => entry.frontMatter.classification)
  ));

  return (
      <div className="bg-black text-white px-6 py-10 min-h-screen font-mono scanlines">
        <h1 className="text-4xl font-bold text-green-400 tracking-widest glow mb-8 terminal-caret">
          BLACK VEIL // CLASSIFIED ARCHIVE
        </h1>

        <div className="rounded-md border border-yellow-500 bg-yellow-900/10 p-4 mb-6">
          <p className="font-mono text-yellow-400 font-semibold">
            ⚠️ MUST READ — CORE INDEX
          </p>
          <p className="text-sm text-yellow-300 font-mono mt-1">
            • This document outlines classification protocols, clearance procedures, and access levels.<br />
            <a
                href="/lore/UNCLASSIFIED_black-veil-classification-index"
                className="underline text-yellow-200 hover:text-yellow-100 transition-colors"
            >
              Open Classification Index →
            </a>
          </p>
        </div>

        <div className="space-y-4">
          {classifications.map((classification) => (
              <div key={classification}>
                <button
                    onClick={() => toggleExpand(classification)}
                    className="w-full bg-black text-left border border-green-500 px-4 py-2 text-green-300 hover:bg-green-900 transition-all duration-500"
                >
                  ▶ {classification}
                </button>

                <div className={`overflow-hidden transition-all duration-500 ${expanded === classification ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-4 mt-2 space-y-2">
                    {[...new Set(
                        entries
                            .filter(e => e.frontMatter.classification === classification)
                            .map(e => e.frontMatter.asset || 'Unknown Asset')
                    )].map(asset => (
                        <div key={asset}>
                          <button
                              onClick={() => toggleSubExpand(asset)}
                              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                          >
                            📁 {asset}
                          </button>
                          <div className={`overflow-hidden transition-all duration-500 pl-6 ${subExpanded === asset ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <ul className="list-disc list-inside text-green-300">
                              {entries
                                  .filter(e =>
                                      e.frontMatter.classification === classification &&
                                      e.frontMatter.asset === asset
                                  )
                                  .map(e => (
                                      <li key={e.slug}>
                                        <Link href={`/lore/${e.slug}`} className="hover:text-green-100 underline">
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
      </div>
  );
}
