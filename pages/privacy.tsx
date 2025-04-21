import { useState } from 'react';

export default function PrivacyPage() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="bg-black text-green-300 font-mono min-h-screen px-8 py-12 relative">
      <h1 className="text-3xl font-bold tracking-widest glow text-green-400 mb-6 border-b border-green-500 pb-2">
        PRIVACY PROTOCOLS // CODE 99
      </h1>

      <div className="space-y-4">
        <p className="text-sm opacity-80">
          All transmissions, interactions, and archived data within the BLACK VEIL NETWORK are
          monitored under Directive XIII. Any unauthorized access is logged and reviewed by Security
          Oversight Unit CORVUS.
        </p>
        <p className="text-sm opacity-80">
          Collected metadata includes timestamp, location grid, classification clearance, and
          anomaly exposure level. No biometric identifiers are stored without agent consent.
        </p>
        <p className="text-sm opacity-80">
          By remaining on this page, you acknowledge the above protocols. For full disclosure,
          request FORM-V19 through secure channels.
        </p>
      </div>

      <div className="mt-10">
        <button
          onClick={() => setShowOverlay(true)}
          className="text-yellow-300 border border-yellow-500 px-4 py-2 text-xs hover:bg-yellow-900/10 transition-all"
        >
          Open Data Collection Disclosure
        </button>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="border border-yellow-500 bg-yellow-900/20 text-yellow-300 p-6 max-w-lg shadow-lg space-y-4">
            <h2 className="text-xl font-bold border-b border-yellow-500 pb-2">
              ⚠️ DATA COLLECTION DISCLOSURE
            </h2>
            <p className="text-sm">
              BLACK VEIL archives non-identifiable transmission metadata. No voice, biometric, or
              embedded psychometric data is stored without explicit [CLEARANCE-5] authorization.
            </p>
            <p className="text-sm">Continued usage constitutes passive consent under Protocol-7.</p>
            <button
              onClick={() => setShowOverlay(false)}
              className="mt-4 bg-yellow-500 text-black font-bold px-4 py-1 text-xs hover:bg-yellow-400 transition-all"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
