
//pages/shipping-replace.js
import Head from 'next/head'

export default function ShippingReplace() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>Shipping & Replacement - Silver E-commers</title>
        <meta name="description" content="Shipping and replacement policy for Silver E-commers" />
      </Head>

      <main className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">Shipping & Replacement Policy</h1>
          <p className="mt-2 text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Order Processing & Shipping</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>Orders are processed within 1-3 business days (excluding holidays) unless otherwise stated on the product page.</li>
            <li>Shipping times vary by location and chosen shipping method. Estimated delivery times are provided at checkout.</li>
            <li>We are not responsible for delays caused by the courier, customs clearance, or force majeure events.</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Cancellation Policy</h2>
          <p className="text-sm text-gray-700">You may cancel your order <strong>before it has been shipped</strong>. To cancel, contact our support team immediately with your order number. If the order has already been dispatched, cancellation will not be possible — please refer to the replacement policy below.</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Replacement After Delivery</h2>
          <p className="text-sm text-gray-700">If you receive a wrong, defective, or damaged item, please raise a replacement request within <strong>7 days</strong> of delivery. When raising a request, include clear photos of the item and packaging and a description of the issue.</p>
          <ul className="list-disc pl-5 space-y-2 mt-3 text-sm text-gray-700">
            <li>After a replacement request is submitted, our support team will review the case and may request additional information or evidence.</li>
            <li>We reserve the right to accept or decline any replacement request based on inspection of the evidence and the product condition.</li>
            <li>In certain situations, replacements or exchanges may incur additional charges (for example: different-size exchange, product value difference, or if the item shows signs of wear or damage after delivery). These charges will be communicated before the replacement is shipped.</li>
            <li>Replacement shipping costs: If the replacement is accepted due to our error (wrong/damaged product), we will cover reasonable return & replacement shipping costs. If the replacement is requested for reasons not covered under this policy (customer preference, size change, etc.), return/replacement shipping costs may be charged to the customer.</li>
            <li>Once a replacement is shipped, the original item must be returned to us as instructed. Failure to return the original item when required may result in charges to your account.</li>
          </ul>
          <p className="mt-3 text-sm text-gray-700"><em>Note:</em> After an item has been shipped from the seller to the customer, there is <strong>no general return policy</strong> — only replacement requests for specific issues (wrong/defective/damaged) will be considered.</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Inspection & Condition</h2>
          <p className="text-sm text-gray-700">Please inspect your order on delivery. If you notice visible damage to the parcel, please refuse delivery or record the damage with the delivery agent and contact our support immediately. Replacement eligibility may depend on the item's condition when returned.</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">How to Request a Replacement</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
            <li>Email our support at <strong>support@silverecommers.example</strong> with your order number and photos.</li>
            <li>Provide a clear description of the defect or issue.</li>
            <li>Follow any return-shipping instructions provided by the support team.</li>
          </ol>
        </section>

        <footer className="text-sm text-gray-600 mt-6">Questions? Contact us at <a href="mailto:support@silverecommers.example" className="text-blue-600 underline">support@silverecommers.example</a>.</footer>
      </main>
    </div>
  )
}