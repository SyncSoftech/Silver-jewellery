

// File: /pages/terms-and-conditions.js
import Head from 'next/head'


export default function TermsAndConditions() {
return (
<div className="min-h-screen bg-gray-50 text-gray-800">
<Head>
<title>Terms & Conditions - Silver E-commers</title>
<meta name="description" content="Terms and conditions for using Silver E-commers" />
</Head>


<main className="max-w-4xl mx-auto p-6">
<header className="mb-6">
<h1 className="text-3xl font-extrabold">Terms & Conditions</h1>
<p className="mt-2 text-sm text-gray-600">Please read these terms carefully before using our site.</p>
</header>


<section className="bg-white p-6 rounded-lg shadow-sm mb-4">
<h2 className="text-xl font-semibold mb-2">Acceptance of Terms</h2>
<p className="text-sm text-gray-700">By accessing or using Silver E-commers, you agree to these terms. If you do not agree, do not use our services.</p>
</section>


<section className="bg-white p-6 rounded-lg shadow-sm mb-4">
<h2 className="text-xl font-semibold mb-2">Orders & Payment</h2>
<p className="text-sm text-gray-700">We reserve the right to accept or refuse any order. Payment must be completed at the time of ordering. Prices are as listed and may change without notice.</p>
</section>


<section className="bg-white p-6 rounded-lg shadow-sm mb-4">
<h2 className="text-xl font-semibold mb-2">Shipping, Returns & Replacements</h2>
<p className="text-sm text-gray-700">Shipping and replacement rules are governed by our Shipping & Replacement Policy. Cancellations are allowed only before shipping. After shipping there is no general return policy — only replacements for qualifying issues (wrong/damaged/defective) are considered. We reserve the right to accept or decline replacement requests.</p>
</section>


<section className="bg-white p-6 rounded-lg shadow-sm mb-4">
<h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
<p className="text-sm text-gray-700">To the maximum extent permitted by law, Silver E-commers is not liable for indirect, incidental, or consequential damages arising from your use of the site or products purchased.</p>
</section>


<section className="bg-white p-6 rounded-lg shadow-sm mb-4">
<h2 className="text-xl font-semibold mb-2">Governing Law</h2>
<p className="text-sm text-gray-700">These terms are governed by the laws of the jurisdiction where Silver E-commers is registered.</p>
</section>


<footer className="text-sm text-gray-600 mt-6">If you have questions about these terms, contact us at <a href="mailto:legal@silverecommers.example" className="text-blue-600 underline">legal@silverecommers.example</a>.</footer>
</main>
</div>
)
}