/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i.pinimg.com",  // Add this line
      "cs-utc-jewelry.myshopify.com",
      "img.freepik.com",
      "assets.ajio.com",
      "www.giva.co",
      "psjewellery.in",
      "m.media-amazon.com",
      // Add more domains if needed
    ],
  },
}

module.exports = nextConfig