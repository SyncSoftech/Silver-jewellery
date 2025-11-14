
// File: /pages/privacy-policy.js
import Head from 'next/head'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>Privacy Policy - Silver E-commers</title>
        <meta name="description" content="Privacy policy for Silver E-commers" />
      </Head>

      <main className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-600">We respect your privacy and protect your data.</p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>Personal details: name, email, phone, shipping & billing addresses.</li>
            <li>Order & payment information necessary to fulfill purchases.</li>
            <li>Device and browsing data, cookies, and analytics for site improvement.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">How We Use Your Data</h2>
          <p className="text-sm text-gray-700">We use your information to process orders, communicate about orders and offers, improve our services, and comply with legal obligations. We will not sell your personal data to third parties.</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Cookies & Tracking</h2>
          <p className="text-sm text-gray-700">We use cookies and similar technologies to personalize your experience and for analytics. You can manage cookie preferences in your browser.</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Data Retention & Rights</h2>
          <p className="text-sm text-gray-700">We keep data only as long as needed for business or legal purposes. You may request access, correction, or deletion of your personal information by contacting us at <a href="mailto:privacy@silverecommers.example" className="text-blue-600 underline">privacy@silverecommers.example</a>. For EU residents, you have rights under GDPR (access, rectification, erasure, restriction, data portability, and objection).</p>
        </section>

        <footer className="text-sm text-gray-600 mt-6">Questions? Contact <a href="mailto:privacy@silverecommers.example" className="text-blue-600 underline">privacy@silverecommers.example</a>.</footer>
      </main>
    </div>
  )
}
