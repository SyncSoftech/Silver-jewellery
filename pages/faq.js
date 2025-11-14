
// File: /pages/FAQs.js
import Head from 'next/head'

export default function FAQs() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>FAQs - Silver E-commers</title>
        <meta name="description" content="Frequently asked questions for Silver E-commers" />
      </Head>

      <main className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">Frequently Asked Questions</h1>
          <p className="mt-2 text-sm text-gray-600">Find quick answers to common questions.</p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-4">Orders & Payments</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold">1. How do I place an order?</h3>
              <p>Just select a product, choose size/color if applicable, and proceed to checkout. Complete payment to confirm your order.</p>
            </div>
            <div>
              <h3 className="font-semibold">2. Can I cancel my order?</h3>
              <p>You can cancel your order <strong>before it has been shipped</strong>. After shipping, cancellation is not possible.</p>
            </div>
            <div>
              <h3 className="font-semibold">3. What payment methods do you accept?</h3>
              <p>We accept UPI, credit/debit cards, wallet payments, and net banking.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-4">Shipping</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold">4. How long does delivery take?</h3>
              <p>Orders are processed in 1–3 business days. Delivery usually takes 3–7 days depending on your location.</p>
            </div>
            <div>
              <h3 className="font-semibold">5. How do I track my order?</h3>
              <p>You’ll receive a tracking link via email/SMS once your order is shipped.</p>
            </div>
            <div>
              <h3 className="font-semibold">6. Do you offer international shipping?</h3>
              <p>Yes, but customs duties and taxes may apply depending on your country.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-4">Replacement Policy</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold">7. Do you accept returns?</h3>
              <p><strong>No general return policy</strong>. We only accept <strong>replacement requests</strong> for wrong, damaged, or defective products.</p>
            </div>
            <div>
              <h3 className="font-semibold">8. How do I request a replacement?</h3>
              <p>Email us within 7 days of delivery with your order number, photos, and issue details.</p>
            </div>
            <div>
              <h3 className="font-semibold">9. Who decides if my replacement request is accepted?</h3>
              <p>The Silver E-commers support team will review your request and <strong>has the right to accept or decline</strong> based on product condition and evidence provided.</p>
            </div>
            <div>
              <h3 className="font-semibold">10. Will I be charged for replacement?</h3>
              <p>Replacements due to our error are free. Other replacements (size change, preference change) may incur additional charges.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-4">Products & Quality</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold">11. Are all items pure silver?</h3>
              <p>Yes, we sell 92.5 sterling silver jewellery unless otherwise specified.</p>
            </div>
            <div>
              <h3 className="font-semibold">12. Will the silver tarnish?</h3>
              <p>Silver naturally oxidizes over time, but regular cleaning keeps it shiny.</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-4">Other Questions</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold">13. How can I contact support?</h3>
              <p>Email us at <strong>support@silverecommers.example</strong> or use the contact page form.</p>
            </div>
            <div>
              <h3 className="font-semibold">14. Do you offer gift packaging?</h3>
              <p>Yes! You can choose gift packaging at checkout for an additional charge.</p>
            </div>
          </div>
        </section>

        <footer className="text-sm text-gray-600 mt-6">Still need help? Reach us at <a href="mailto:support@silverecommers.example" className="text-blue-600 underline">support@silverecommers.example</a>.</footer>
      </main>
    </div>
  )
}
