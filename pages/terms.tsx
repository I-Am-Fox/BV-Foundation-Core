import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Terms of Use</h1>
      <p className="mb-4 italic">Last Updated: May 13, 2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-300 mb-2">1. Access & Eligibility</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <b>You must be at least 18 years old to create an account.</b>
          </li>
          <li>
            You agree to provide accurate information during registration and to keep it up to date.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-300 mb-2">2. Account Usage</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Your account is personal. Do not share your login credentials or impersonate others.
          </li>
          <li>
            If logging in with Discord or email, you are responsible for the activity tied to that
            account.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-300 mb-2">3. Submission Guidelines</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You may submit `.mdx` files for review through the Archive interface.</li>
          <li>
            All submissions must be your original work. Plagiarism, AI-generated content without
            disclosure, or unauthorized reposting is prohibited.
          </li>
          <li>
            Submissions may be reviewed, approved, edited, or removed at the discretion of the site
            administrator.
          </li>
          <li>
            Submissions may also be subject to previewing for AI in accordance with our policy on no
            AI content.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-300 mb-2">4. Content Ownership</h2>
        <p>
          You retain copyright over your submitted work. By submitting content, you grant the Black
          Veil Archive a non-exclusive, royalty-free license to display, store, and publish your
          submission within the Archive. (All content that is submitted is tied to your account and
          is displayed publicly.)
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-300 mb-2">5. Moderation & Conduct</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You agree not to use this site to harass, threaten, or impersonate others.</li>
          <li>
            Attempts to exploit the system, bypass moderation, or submit harmful material may result
            in account suspension or removal.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-300 mb-2">6. Data Usage</h2>
        <p>
          This site stores only the information necessary to maintain your account and submissions
          (e.g., email, display name, and optionally your chosen authentication method). Your data
          will never be sold or shared without consent. See our{' '}
          <a href="/privacy" className="underline text-green-400">
            Privacy Policy
          </a>{' '}
          for more details.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-300 mb-2">7. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Significant changes will be posted
          here and may prompt renewed consent.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-green-300 mb-2">8. Contact</h2>
        <p>
          For questions about these Terms, please contact the administrator directly via the
          Archive. This can either be through Discord, or through the email address
          (black-veil-foundation@proton.me).
        </p>
      </section>
    </div>
  );
}
