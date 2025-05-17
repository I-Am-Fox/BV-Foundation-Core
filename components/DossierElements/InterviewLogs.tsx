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
