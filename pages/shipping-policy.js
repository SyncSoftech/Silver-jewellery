
// File: /pages/shipping-policy.js
import Head from 'next/head'

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>Shipping Policy - Silver E-commers</title>
        <meta name="description" content="Shipping policy for Silver E-commers" />
      </Head>

      <main className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">Shipping Policy</h1>
          <p className="mt-2 text-sm text-gray-600">Efficient shipping — transparent rules</p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Processing Time</h2>
          <p className="text-sm text-gray-700">Most orders are processed within 1-3 business days. Custom or personalized products may take longer and will be noted on the product page.</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Shipping Methods & Costs</h2>
          <p className="text-sm text-gray-700">We work with multiple courier partners. Shipping costs are calculated at checkout based on package weight, delivery location, and chosen speed (standard/express).</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">International Shipping</h2>
          <p className="text-sm text-gray-700">International customers may be subject to customs duties, taxes, and import fees. These are the customer's responsibility and are not included in product or shipping prices.</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Delivery Issues</h2>
          <ul className="list-disc pl-5 mt-3 text-sm text-gray-700 space-y-2">
            <li>If a package is lost in transit, we will work with the courier to investigate and assist with a resolution.</li>
            <li>If the customer provides an incorrect shipping address, additional charges for re-shipment may apply.</li>
          </ul>
        </section>

        <footer className="text-sm text-gray-600 mt-6">For assistance, email <a href="mailto:support@silverecommers.example" className="text-blue-600 underline">support@silverecommers.example</a>.</footer>
      </main>
    </div>
  )
}
