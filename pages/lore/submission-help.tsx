// pages/submission‑help.tsx

import React from 'react';

const TEMPLATE_SNIPPET = `---
title: "ASSET-ID “Codename” Dossier"
classification: "OCTANE CLASS"     # e.g. ALPHA, BETA, DELTA, OCTANE, THETA, FIELD AGENTS
asset: "ASSET-ID “Codename”"
date: 'YYYY-MM-DD'
---

import HeaderSection    from '@/components/LoreElements/HeaderSection'
import DossierTagList   from '@/components/LoreElements/DossierTagList'

<HeaderSection
  date="YYYY-MM-DD"
  objectClass="OCTANE CLASS"
  asset="ASSET-ID “Codename”"
/>

### [Codename] DOSSIER

**Classification:** OCTANE CLASS  
**Filed:** YYYY‑MM‑DD

## Summary
A brief (2–3 line) overview of this asset’s anomalous effects.

## Description
Detailed narrative, logs, test results, etc.

### Containment Procedures
…

### Incident Logs
- Log XX‑YY: …

### Analysis
…

## Tags - LEAVE EMPTY
<DossierTagList tags={[]} />
`;

const EXAMPLE_SNIPPET = `---
title: "CV-07 “Corvus” Dossier"
classification: "OCTANE CLASS"
asset: "CV-07 “Corvus”"
date: '2025-04-14'
---

import HeaderSection    from '@/components/LoreElements/HeaderSection'
import DossierTagList   from '@/components/LoreElements/DossierTagList'

<HeaderSection
  date="2025-04-14"
  objectClass="OCTANE CLASS"
  asset="CV-07 “Corvus”"
/>

### Corvus DOSSIER

**Classification:** OCTANE CLASS  
**Filed:** 2025‑04‑14

## Summary
An avian entity capable of mental projection and reality mirroring.

## Description
Detailed field reports and containment logs.

## Tags - LEAVE EMPTY
<DossierTagList tags={[]} />
`;

export default function SubmissionHelpPage() {
  return (
    <div className="bg-black text-green-300 font-mono min-h-screen px-8 py-12">
      <h1 className="text-3xl font-bold tracking-widest glow text-green-400 mb-6 border-b border-green-500 pb-2">
        SUBMISSION HELP // CODE 99
      </h1>

      <div className="space-y-4">
        <p className="text-sm opacity-80">
          For assistance with your submission, please refer to the guidelines below.
        </p>
        <p className="text-sm opacity-80">
          Ensure all files are properly formatted and classified before submission.
        </p>
        <p className="text-sm opacity-80">
          Use the classification system to categorize your submission accurately.
        </p>
      </div>

      {/* TWO‑COLUMN GRID */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* TEMPLATE BOX (outline only) */}
        <div className="rounded-md border border-green-500 p-4">
          <h2 className="text-2xl font-bold text-green-400 mb-4">📄 Dossier Template</h2>
          <pre className="overflow-auto text-sm font-mono text-green-200">
            <code>{TEMPLATE_SNIPPET}</code>
          </pre>
        </div>

        {/* EXAMPLE BOX (same outline) */}
        <div className="rounded-md border border-green-500 p-4">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">📌 Completed Example</h2>
          <pre className="overflow-auto text-sm font-mono text-yellow-200">
            <code>{EXAMPLE_SNIPPET}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
