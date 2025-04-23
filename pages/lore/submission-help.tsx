// pages/submission-help.tsx
import React from 'react';

export default function SubmissionHelpPage() {
  return (
    <div className="bg-black text-green-300 font-mono min-h-screen px-8 py-12">
      <h1 className="text-3xl font-bold tracking-widest glow text-green-400 mb-6 border-b border-green-500 pb-2">
        SUBMISSION HELP // FORM GUIDELINES
      </h1>

      <p className="text-sm opacity-80">
        Use the interactive form at <code>/submission</code> to enter your dossier details. Fill out
        each field carefully; the system will append " CLASS" to your chosen classification and
        format everything for review.
      </p>

      {/* TWO-COLUMN GRID */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FORM FIELD GUIDELINES */}
        <div className="rounded-md border border-green-500 p-4">
          <h2 className="text-2xl font-bold text-green-400 mb-4">✏️ Form Fields</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-green-200">
            <li>
              <strong>Title</strong>: Full dossier title (e.g.{' '}
              <code>ASSET-001 “Phantom Shard” Dossier</code>)
            </li>
            <li>
              <strong>Classification</strong>: Select one option; the editor will append{' '}
              <code>CLASS</code> automatically:
              <ul className="list-disc list-inside ml-4">
                <li>ALPHA</li>
                <li>BETA</li>
                <li>DELTA</li>
                <li>THETA</li>
                <li>OCTANE</li>
              </ul>
            </li>
            <li>
              <strong>Asset</strong>: Asset ID and codename (use curly quotes for names)
            </li>
            <li>
              <strong>Date</strong>: File date in <code>YYYY-MM-DD</code> format
            </li>
            <li>
              <strong>Summary</strong>: A 2–3 line overview of anomalous effects
            </li>
            <li>
              <strong>Description</strong>: Detailed narrative, test logs, field reports
            </li>
            <li>
              <strong>Containment Procedures</strong>: Protocols to secure the asset
            </li>
            <li>
              <strong>Incident Logs</strong>: Chronological logs, each on its own line
            </li>
            <li>
              <strong>Analysis</strong>: Summary of findings and recommendations
            </li>
          </ol>
        </div>

        {/* EXAMPLE SUBMISSION */}
        <div className="rounded-md border border-green-500 p-4">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">✅ Example Submission</h2>
          <div className="text-sm text-yellow-200 space-y-2">
            <p>
              <strong>Title:</strong> ASSET-007 “Eclipse Mirror” Dossier
            </p>
            <p>
              <strong>Classification:</strong> THETA CLASS
            </p>
            <p>
              <strong>Asset:</strong> ASSET-007 “Eclipse Mirror”
            </p>
            <p>
              <strong>Date:</strong> 2025-06-01
            </p>
            <p>
              <strong>Summary:</strong> A reflective shard that distorts light and shadow.
            </p>
            <p>
              <strong>Description:</strong> Recovered from an abandoned cathedral. When exposed to
              sunlight, the shard projects moving silhouettes that mimic human activity.
            </p>
            <p>
              <strong>Containment Procedures:</strong> Store in opaque lead-lined box. No direct
              light allowed within 10 meters. Monitor via infrared cameras.
            </p>
            <p>
              <strong>Incident Logs:</strong>
              <br />- Log 21-04: Projection activated unexpectedly in transport vehicle.
              <br />- Log 21-07: Silhouette phantom observed outside containment cell.
            </p>
            <p>
              <strong>Analysis:</strong> The shard appears to tap into residual memory of light
              exposure. Recommend further optical resonance tests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
