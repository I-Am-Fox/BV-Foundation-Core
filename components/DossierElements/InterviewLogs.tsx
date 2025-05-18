// components/InterviewLog.tsx

import React from 'react';

// Main log box
export function InterviewLog({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#202124] border border-neutral-700 rounded-lg px-6 py-5 text-neutral-100 font-mono text-base shadow-md max-w-2xl mx-auto my-8 leading-relaxed">
      {children}
    </div>
  );
}

// Dialogue line
export function Dialogue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <span className="font-bold text-neutral-200">{label}:</span>{' '}
      <span className="text-neutral-100">{children}</span>
    </div>
  );
}

// Action/stage direction
export function Action({ children }: { children: React.ReactNode }) {
  return <div className="italic text-neutral-400 pl-4 mb-2">{children}</div>;
}

export function SystemError({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-900 border border-red-700 rounded-lg px-6 py-5 text-red-200 font-mono text-base shadow-md max-w-2xl mx-auto my-8 leading-relaxed">
      {children}
    </div>
  );
}

export function Drift({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#202124] border border-neutral-700 rounded-lg px-6 py-5 text-neutral-100 font-mono text-base shadow-md max-w-2xl mx-auto my-8 leading-relaxed">
      <div className="italic text-neutral-400 pl-4 mb-2">{children}</div>
    </div>
  );
}

export function IncidentTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#18181b] border border-neutral-700 rounded-lg font-mono text-sm shadow-md max-w-3xl mx-auto my-8 overflow-x-auto">
      <table className="w-full table-fixed border-separate border-spacing-y-1">
        <thead>
          <tr className="text-neutral-300 bg-[#222]">
            <th className="px-3 py-2 font-bold">Date</th>
            <th className="px-3 py-2 font-bold">Trigger/Observation</th>
            <th className="px-3 py-2 font-bold">Outcome</th>
            <th className="px-3 py-2 font-bold">Notes</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function IncidentRow({
  date,
  trigger,
  outcome,
  notes,
}: {
  date: string;
  trigger: string;
  outcome: string;
  notes: string;
}) {
  return (
    <tr className="bg-[#202124] hover:bg-[#232323]">
      <td className="px-3 py-2 text-neutral-400 whitespace-nowrap">{date}</td>
      <td className="px-3 py-2">{trigger}</td>
      <td className="px-3 py-2 text-neutral-100">{outcome}</td>
      <td className="px-3 py-2 text-neutral-400">{notes}</td>
    </tr>
  );
}
