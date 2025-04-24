import { useState } from 'react';

export default function PrivacyPage() {
    const [showOverlay, setShowOverlay] = useState(false);

    return (
        <div className="bg-black text-green-300 font-mono min-h-screen px-8 py-12 relative">
            <h1 className="text-3xl font-bold tracking-widest glow text-green-400 mb-6 border-b border-green-500 pb-2">
                PRIVACY POLICY
            </h1>

            <div className="space-y-4">
                <p className="text-sm opacity-80">
                    This website is committed to protecting your privacy and ensuring compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This privacy policy outlines how we collect, use, store, and protect your data.
                </p>

                <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">Information We Collect</h2>
                <ul className="text-sm opacity-80 list-disc list-inside">
                    <li>Email address and password (for account creation and login)</li>
                    <li>Session metadata (access timestamps, IP address, browser version, etc.)</li>
                    <li>Interaction data (pages visited, forms submitted)</li>
                    <li>Submitted content (e.g. Markdown files, titles, metadata)</li>
                </ul>

                <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">How We Use Your Data</h2>
                <ul className="text-sm opacity-80 list-disc list-inside">
                    <li>To authenticate users and provide access to secure sections of the site</li>
                    <li>To review, approve, and manage submitted content</li>
                    <li>To improve user experience and site performance</li>
                    <li>To comply with legal obligations</li>
                </ul>

                <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">Your Rights Under UK GDPR</h2>
                <ul className="text-sm opacity-80 list-disc list-inside">
                    <li>You have the right to access the personal data we hold about you</li>
                    <li>You have the right to request correction or deletion of your data</li>
                    <li>You have the right to withdraw consent at any time</li>
                    <li>You have the right to file a complaint with the Information Commissioner's Office (ICO)</li>
                </ul>

                <p className="text-sm opacity-80">
                    To exercise your rights or request deletion of your data or account, please contact us at:
                    <br />
                    <span className="text-green-200">privacy@blackveil.foundation</span>
                </p>

                <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">Data Storage and Security</h2>
                <p className="text-sm opacity-80">
                    Your account credentials are securely hashed and stored using Supabase authentication. We use encrypted connections and industry-standard best practices to protect all stored data.
                </p>

                <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">Cookies and Tracking</h2>
                <p className="text-sm opacity-80">
                    This website may use cookies or session storage for authentication, functionality, and user preferences. We do not use tracking cookies or third-party analytics without user consent.
                </p>
            </div>

            <div className="mt-10">
                <button
                    onClick={() => setShowOverlay(true)}
                    className="text-yellow-300 border border-yellow-500 px-4 py-2 text-xs hover:bg-yellow-900/10 transition-all"
                >
                    View Data Collection Disclosure
                </button>
            </div>

            {showOverlay && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
                    <div className="border border-yellow-500 bg-yellow-900/20 text-yellow-300 p-6 max-w-lg shadow-lg space-y-4">
                        <h2 className="text-xl font-bold border-b border-yellow-500 pb-2">
                            ⚠️ DATA COLLECTION NOTICE
                        </h2>
                        <p className="text-sm">
                            This site collects anonymized usage metadata to ensure system security and performance.
                            Data is never sold or shared with third parties, and is only retained for as long as necessary.
                        </p>
                        <p className="text-sm">
                            Continued use of this website constitutes consent to these practices under the UK GDPR.
                        </p>
                        <button
                            onClick={() => setShowOverlay(false)}
                            className="mt-4 bg-yellow-500 text-black font-bold px-4 py-1 text-xs hover:bg-yellow-400 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
