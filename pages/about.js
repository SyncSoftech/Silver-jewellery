



// File: /pages/about.js
import Head from 'next/head'


export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>About Us - Silver E-commers</title>
        <meta name="description" content="About Silver E-commers: our story, mission and values" />
      </Head>


      <main className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">About Silver E-commers</h1>
          <p className="mt-2 text-sm text-gray-600">Crafting beautiful silver jewellery with care, transparency and trust.</p>
        </header>


        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Our Story</h2>
          <p className="text-sm text-gray-700">Silver E-commers started with a love for fine silver pieces and a desire to make quality jewellery accessible online. We combine traditional craftsmanship with modern e-commerce convenience so customers can find lasting pieces they love.</p>
        </section>


        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-sm text-gray-700">To provide ethically sourced, well-crafted silver jewellery backed by clear policies, reliable shipping and excellent customer support.</p>
        </section>


        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Values</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>Quality: We curate products that meet high standards.</li>
            <li>Transparency: Clear policies and fair handling of orders.</li>
            <li>Customer-first: We listen, help, and aim to resolve issues quickly.</li>
            <li>Sustainability: We seek responsible sourcing where possible.</li>
          </ul>
        </section>


        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Meet the Team</h2>
          <p className="text-sm text-gray-700">A small passionate team of designers, curators and support staff working to bring you timeless silver jewellery.</p>
        </section>


        <section className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-sm text-gray-700">Have questions or want to collaborate? Email us at <a href="mailto:hello@silverecommers.example" className="text-blue-600 underline">hello@silverecommers.example</a> or use our contact form.</p>
        </section>


        <footer className="text-sm text-gray-600 mt-6">Thank you for supporting Silver E-commers — we hope our pieces become a part of your story.</footer>
      </main>
    </div>
  )
}