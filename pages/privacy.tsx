import { useState } from 'react';

export default function PrivacyPage() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-white font-mono relative">
      <h1 className="text-3xl font-bold text-green-400 mb-6 border-b border-green-500 pb-2">
        Privacy Policy
      </h1>

      <div className="mb-6">
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
              ⚠️ Data Collection Notice
            </h2>
            <p className="text-sm">
              This site collects anonymized usage metadata to ensure system security and
              performance. Data is never sold or shared with third parties and is only retained for
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

      <section className="mb-8">
        <p className="opacity-80 text-sm">
          This privacy notice tells you what to expect us to do with your personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-green-300 font-semibold mb-2">Contact Details</h2>
        <p className="text-sm opacity-80">
          Email: <span className="text-green-200">blackveilfoundation@proton.me</span>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-green-300 font-semibold mb-2">
          What Information We Collect, Use, and Why
        </h2>
        <p className="text-sm opacity-80">
          We collect or use the following information for the operation of customer accounts and
          guarantees:
        </p>
        <ul className="text-sm list-disc list-inside">
          <li>Account information, including registration details</li>
          <li>Information used for security purposes</li>
          <li>IP addresses</li>
          <li>Session metadata (e.g., device, browser information)</li>
        </ul>
        <p className="text-sm opacity-80 mt-2">
          We collect or use the following information to comply with legal requirements:
        </p>
        <ul className="text-sm list-disc list-inside">
          <li>Contact information</li>
        </ul>
        <p className="text-sm opacity-80 mt-2">
          We collect or use the following personal information for dealing with queries, complaints
          or claims:
        </p>
        <ul className="text-sm list-disc list-inside">
          <li>Names and contact details</li>
          <li>Account information</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-green-300 font-semibold mb-2">
          Lawful Bases and Data Protection Rights
        </h2>
        <p className="text-sm opacity-80">
          Under UK data protection law, we must have a "lawful basis" for collecting and using your
          personal information. Which lawful basis we rely on may affect your data protection
          rights:
        </p>
        <ul className="text-sm list-disc list-inside mt-2">
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
        <p className="text-sm opacity-80 mt-2">
          We must respond to your request within one month. To make a request, please use the
          contact details at the top of this notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-green-300 font-semibold mb-2">
          Our Lawful Bases for Processing
        </h2>
        <ul className="text-sm list-disc list-inside">
          <li>
            <strong>Consent:</strong> You have given clear permission. You may withdraw consent at
            any time.
          </li>
          <li>
            <strong>Legal obligation:</strong> We must process data to comply with the law.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-green-300 font-semibold mb-2">
          Where We Get Personal Information From
        </h2>
        <p className="text-sm opacity-80">We collect data directly from you.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-green-300 font-semibold mb-2">How Long We Keep Information</h2>
        <p className="text-sm opacity-80">
          We retain data only as long as necessary. Please contact us for more detail about specific
          retention timelines.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-green-300 font-semibold mb-2">Internal Access & Moderation</h2>

        <ul className="text-sm list-disc list-inside">
          <li>
            <strong>Netlify:</strong> Hosting platform for domain and site content
          </li>
          <li>
            <strong>Supabase:</strong> Authentication, database, and submission system services
          </li>
        </ul>
        <p className="text-sm opacity-80 mt-2">
          In order to maintain system integrity and prevent abuse, designated site administrators
          (Namely; TehLuna) have access to certain user metadata such as IP addresses and last
          access timestamps. This data is visible only within secured moderation tools, is never
          shared externally, and is used solely for security, anti-abuse, or diagnostic purposes.
        </p>
        <p className="text-sm opacity-80 mt-2">
          We may also use this data to contact you if we suspect your account has been compromised
          or if we need to verify your identity.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl text-green-300 font-semibold mb-2">How to Complain</h2>
        <p className="text-sm opacity-80">
          If you have concerns about how your data is used, contact us using the email above. If
          you're unsatisfied with our response, you can file a complaint with the Information
          Commissioner's Office (ICO):
        </p>
        <p className="text-sm opacity-80 mt-2">
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
          <a href="https://www.ico.org.uk/make-a-complaint" className="underline text-green-400">
            www.ico.org.uk/make-a-complaint
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-sm mt-6">Last updated</h2>
        <p className="text-sm opacity-80">May 2025</p>
      </section>
    </div>
  );
}
