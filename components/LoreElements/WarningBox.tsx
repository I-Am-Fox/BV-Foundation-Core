import React from 'react';

export default function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-red-600 bg-red-900/20 p-4 my-4 text-sm text-red-300">
      ⚠ {children}
    </div>
  );
}
