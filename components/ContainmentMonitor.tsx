import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Contained', 'Unstable', 'Unknown', 'Missing', 'Pending Reclassification'];

export default function ContainmentMonitor({
  entries,
}: {
  entries: { slug: string; frontMatter: { asset: string } }[];
}) {
  const [selection, setSelection] = useState<{ asset: string; status: string } | null>(null);

  useEffect(() => {
    if (entries.length > 0) {
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      const randomStatus = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];
      setSelection({ asset: randomEntry.frontMatter.asset, status: randomStatus });
    }
  }, [entries]);

  if (!selection) return null;

  return (
    <div className="rounded-md border border-yellow-500 bg-yellow-900/10 p-4">
      <p className="font-mono text-yellow-400 font-semibold">📡 LIVE CONTAINMENT MONITOR</p>
      <p className="text-sm text-yellow-300 font-mono mt-1">
        • {selection.asset}
        <br />• Status: <span className="text-green-400 font-bold">{selection.status}</span>
      </p>
    </div>
  );
}
