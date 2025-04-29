// pages/lore/submission-help.tsx
import React from 'react';
import Link from 'next/link';

export default function SubmissionHelp() {
  return (
    <div className="bg-black text-green-300 font-mono min-h-screen px-8 py-12">
      <h1 className="text-4xl font-bold text-green-400 mb-6 tracking-widest">
        SUBMISSION WALKTHROUGH
      </h1>

      <p className="mb-6 text-sm opacity-80">
        You’re about to submit a new dossier at{' '}
        <Link href="/lore/submission" className="underline">
          /lore/submission
        </Link>
        . Follow these nine steps below to make sure every field is filled out correctly.
      </p>

      <ol className="list-decimal list-inside space-y-8 text-sm marker:text-green-400">
        <li>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Title</h2>
          <p>
            Give your dossier a full name. Include the asset number, its codename, and the word
            “Dossier.”
            <br />
            <em>Example:</em> <code>ASSET-007 “Eclipse Mirror” Dossier</code>
          </p>
        </li>

        <li>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Classification</h2>
          <p>Select one clearance level. Don’t type “CLASS”—the form will append it for you.</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>ALPHA</li>
            <li>BETA</li>
            <li>DELTA</li>
            <li>THETA</li>
            <li>OCTANE</li>
          </ul>
        </li>

        <li>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Asset</h2>
          <p>
            Re-enter the asset ID and codename. Use curly quotes around names to keep formatting
            consistent.
          </p>
        </li>

        <li>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Date</h2>
          <p>
            Pick a date with the built-in calendar. It shows as <code>DD/MM/YYYY</code> but under
            the hood it’s saved in <code>YYYY-MM-DD</code>.
          </p>
        </li>

        <li>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Summary</h2>
          <p>
            A brief (2–3 line) overview: what the anomaly does, where it was found, and why it
            matters.
          </p>
        </li>

        <li>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Description</h2>
          <p>
            Your detailed narrative: recovery story, lab tests, field logs. Break into paragraphs if
            you need to cover multiple phases.
          </p>
        </li>

        <li>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Containment Procedures</h2>
          <p>
            Step-by-step protocols for securing the asset. Include equipment, personnel roles,
            environmental controls, and monitoring.
          </p>
        </li>

        <li>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Incident Logs</h2>
          <p>Chronological entries. Each line should start with a date or code.</p>
          <pre className="bg-green-900/10 p-2 rounded text-xs mt-1 whitespace-pre-wrap">
            - 2025-06-01: Shard activated unexpectedly during transport - 2025-06-03: Unscheduled
            projection detected in containment cell
          </pre>
        </li>

        <li>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Analysis</h2>
          <p>
            Your conclusions: what the data suggests, potential risks, and next-step
            recommendations.
          </p>
        </li>
      </ol>

      <p className="mt-10 text-sm opacity-80">
        When you’ve completed all fields, hit the <strong>Submit</strong> button at the bottom of
        the form. Your entry will queue for admin review before going live.
      </p>

      <div className="mt-8">
        <Link
          href="/lore/submission"
          className="inline-block bg-green-500 text-black font-bold px-4 py-2 rounded hover:bg-green-400"
        >
          Go to Submission Form
        </Link>
      </div>
    </div>
  );
}
