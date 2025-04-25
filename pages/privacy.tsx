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
          This privacy notice tells you what to expect us to do with your personal information.
        </p>

        <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">Contact Details</h2>
        <p className="text-sm opacity-80">
          Email: <span className="text-green-200">blackveilfoundation@proton.me</span>
        </p>

        <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">
          What Information We Collect, Use, and Why
        </h2>
        <p className="text-sm opacity-80">
          We collect or use the following information for the operation of customer accounts and
          guarantees:
        </p>
        <ul className="text-sm list-disc list-inside">
          <li>Account information, including registration details</li>
          <li>Information used for security purposes</li>
        </ul>
        <p className="text-sm opacity-80">
          We collect or use the following information to comply with legal requirements:
        </p>
        <ul className="text-sm list-disc list-inside">
          <li>Contact information</li>
        </ul>
        <p className="text-sm opacity-80">
          We collect or use the following personal information for dealing with queries, complaints
          or claims:
        </p>
        <ul className="text-sm list-disc list-inside">
          <li>Names and contact details</li>
          <li>Account information</li>
        </ul>

        <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">
          Lawful Bases and Data Protection Rights
        </h2>
        <p className="text-sm opacity-80">
          Under UK data protection law, we must have a "lawful basis" for collecting and using your
          personal information. Which lawful basis we rely on may affect your data protection
          rights:
        </p>
        <ul className="text-sm list-disc list-inside">
          <li>
            <strong>Right of access:</strong> Request copies of your personal information
          </li>
          <li>
            <strong>Right to rectification:</strong> Correct or complete inaccurate or incomplete
            data
          </li>
          <li>
            <strong>Right to erasure:</strong> Ask for deletion of your personal data
          </li>
          <li>
            <strong>Right to restriction:</strong> Ask us to limit how we use your information
          </li>
          <li>
            <strong>Right to object:</strong> Object to data processing
          </li>
          <li>
            <strong>Right to data portability:</strong> Ask us to transfer your data elsewhere
          </li>
          <li>
            <strong>Right to withdraw consent:</strong> You may withdraw consent at any time
          </li>
        </ul>
        <p className="text-sm opacity-80">
          We must respond to your request within one month. To make a request, please use the
          contact details at the top of this notice.
        </p>

        <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">
          Our Lawful Bases for Processing
        </h2>
        <p className="text-sm opacity-80">We rely on the following lawful bases:</p>
        <ul className="text-sm list-disc list-inside">
          <li>
            <strong>Consent:</strong> You have given clear permission. You may withdraw consent at
            any time.
          </li>
          <li>
            <strong>Legal obligation:</strong> We must process data to comply with the law.
          </li>
        </ul>

        <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">
          Where We Get Personal Information From
        </h2>
        <p className="text-sm opacity-80">We collect data directly from you.</p>

        <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">
          How Long We Keep Information
        </h2>
        <p className="text-sm opacity-80">
          We retain data only as long as necessary. Please contact us for more detail about specific
          retention timelines.
        </p>

        <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">
          Who We Share Information With
        </h2>
        <ul className="text-sm list-disc list-inside">
          <li>
            <strong>Netlify:</strong> Hosting platform for domain and site content
          </li>
          <li>
            <strong>Supabase:</strong> Authentication, database, and submission system services
          </li>
        </ul>

        <h2 className="text-xl text-green-300 font-semibold mt-6 mb-2">How to Complain</h2>
        <p className="text-sm opacity-80">
          If you have concerns about how your data is used, contact us using the email above. If
          you're unsatisfied with our response, you can file a complaint with the Information
          Commissioner's Office (ICO):
        </p>
        <p className="text-sm opacity-80">
          Information Commissioner's Office
          <br />
          Wycliffe House
          <br />
          Water Lane
          <br />
          Wilmslow
          <br />
          Cheshire SK9 5AF
          <br />
          Helpline: 0303 123 1113
          <br />
          Website:{' '}
          <a href="https://www.ico.org.uk/make-a-complaint" className="underline">
            www.ico.org.uk/make-a-complaint
          </a>
        </p>

        <h2 className="text-sm mt-6">Last updated</h2>
        <p className="text-sm opacity-80">April 2024</p>
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
              This site collects anonymized usage metadata to ensure system security and
              performance. Data is never sold or shared with third parties, and is only retained for
              as long as necessary.
            </p>
            <p className="text-sm">
              Continued use of this website constitutes consent to these practices under the UK
              GDPR.
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
