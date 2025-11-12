// import Head from 'next/head'
// import Hero from '../components/Hero'
// import NewProducts from '../components/products'
// import Image from "next/image";
// import { Inter } from 'next/font/google'
// import { useEffect, useState } from 'react';

// const inter = Inter({ subsets: ['latin'] })

// export default function Home({ addToCart, buyNow, cart, subTotal, removeFromCart, clearCart }) {


//   const collections = [
//     {
//       title: "BRACELETS",
//       img: "/Bracelets.png",
//       link: "#",
//     },
//     {
//       title: "EARRINGS",
//       img: "/Earrings.png",
//       link: "#",
//     },
//     {
//       title: "NECKLACES",
//       img: "/Necklaces.png",
//       link: "#",
//     },
//     {
//       title: "RINGS",
//       img: "/Rings.png",
//       link: "#",
//     },
//   ];
//   return (
//     <>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="e-commerce" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
    
//      <Hero/>

   
// <div >
  
//     <section className="py-16 bg-white">
//       <div className="text-center mb-10">
//         <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">POPULAR COLLECTIONS</h2>
//         <div className="flex justify-center mt-3 space-x-2 text-gray-500">
//           <span>★</span>
//           <span>★</span>
//           <span>★</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
//         {collections.map((item, i) => (
//           <div key={i} className="text-center group bg-gray-100 hover:bg-[#F2E4CC] p-5">
//             <div className="w-full flex justify-center">
//               <Image
//                 src={item.img}
//                 width={200}
//                 height={200}
//                 alt={item.title}
//                 className="transition-all duration-300 group-hover:scale-105"
//               />
//             </div>

//             <h3 className="text-xl -mt-10 font-medium tracking-wider">{item.title}</h3>

//             <div className=" mb-2 border-b-2 border-yellow-500 w-12 mx-auto" />

//             <a
//               href={item.link}
//               className="text-gray-600 hover:text-black text-sm tracking-wide underline decoration-yellow-500"
//             >
//               See the Collection
//             </a>
//           </div>
//         ))}
//       </div>
//     </section>
  
//   <NewProducts 
//     addToCart={addToCart} 
//     buyNow={buyNow}
//     cart={cart}
//     subTotal={subTotal}
//     removeFromCart={removeFromCart}
//     clearCart={clearCart}
//   />

   
//      </div>
//   </>
//   )
// }

// import Head from 'next/head'
// import Hero from '../components/Hero'
// import NewProducts from '../components/products'
// import Image from "next/image";
// import { Inter } from 'next/font/google'
// import RecentlyViewed from '@/components/RecentlyViewed'


// const inter = Inter({ subsets: ['latin'] })

// export default function Home({ 
//   addToCart, 
//   buyNow, 
//   cart, 
//   subTotal, 
//   removeFromCart, 
//   clearCart,
//   wishlist,
//   addToWishlist,
//   removeFromWishlist,
//   clearWishlist,
//   moveToCart,
//   recentlyViewed,
// }) {


//   const collections = [
//     {
//       title: "BRACELETS",
//       img: "/Bracelets.png",
//       link: "#",
//     },
//     {
//       title: "EARRINGS",
//       img: "/Earrings.png",
//       link: "#",
//     },
//     {
//       title: "NECKLACES",
//       img: "/Necklaces.png",
//       link: "#",
//     },
//     {
//       title: "RINGS",
//       img: "/Rings.png",
//       link: "#",
//     },
//   ];
//   return (
//     <>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="e-commerce" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
    
//      <Hero/>
// <RecentlyViewed 
//   recentlyViewed={recentlyViewed}
//   addToCart={addToCart}
//   wishlist={wishlist}
//   addToWishlist={addToWishlist}
//   removeFromWishlist={removeFromWishlist}
// />
   
// <div >
  
//     <section className="py-16 bg-white">
//       <div className="text-center mb-10">
//         <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">POPULAR COLLECTIONS</h2>
//         <div className="flex justify-center mt-3 space-x-2 text-gray-500">
//           <span>★</span>
//           <span>★</span>
//           <span>★</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
//         {collections.map((item, i) => (
//           <div key={i} className="text-center group bg-gray-100 hover:bg-[#F2E4CC] p-5">
//             <div className="w-full flex justify-center">
//               <Image
//                 src={item.img}
//                 width={200}
//                 height={200}
//                 alt={item.title}
//                 className="transition-all duration-300 group-hover:scale-105"
//               />
//             </div>

//             <h3 className="text-xl -mt-10 font-medium tracking-wider">{item.title}</h3>

//             <div className=" mb-2 border-b-2 border-yellow-500 w-12 mx-auto" />

//             <a
//               href={item.link}
//               className="text-gray-600 hover:text-black text-sm tracking-wide underline decoration-yellow-500"
//             >
//               See the Collection
//             </a>
//           </div>
//         ))}
//       </div>
//     </section>
  
//   <NewProducts 
//     addToCart={addToCart} 
//     buyNow={buyNow}
//     cart={cart}
//     subTotal={subTotal}
//     removeFromCart={removeFromCart}
//     clearCart={clearCart}
//     wishlist={wishlist}
//     addToWishlist={addToWishlist}
//     removeFromWishlist={removeFromWishlist}
//     clearWishlist={clearWishlist}
//     moveToCart={moveToCart}
//   />

   
//      </div>
//   </>
//   )
// }



import Head from 'next/head'
import Hero from '../components/Hero'
import NewProducts from '../components/products'
import Image from "next/image";
import { Inter } from 'next/font/google'
import RecentlyViewed from '@/components/RecentlyViewed'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home({ 
  addToCart, 
  buyNow, 
  cart, 
  subTotal, 
  removeFromCart, 
  clearCart,
  wishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  recentlyViewed,
}) {

  const collections = [
    {
      title: "BRACELETS",
      img: "/Bracelets.png",
      link: "/bracelets",
    },
    {
      title: "EARRINGS",
      img: "/Earrings.png",
      link: "/earrings",
    },
    {
      title: "NECKLACES",
      img: "/Necklaces.png",
      link: "/necklaces",
    },
    {
      title: "RINGS",
      img: "/Rings.png",
      link: "/rings",
    },
  ];

  return (
    <>
      <Head>
        <title>Elegant Silver Jewelry Collection</title>
        <meta name="description" content="Exquisite handcrafted silver jewelry for women" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <Hero/>
      
      <RecentlyViewed 
        recentlyViewed={recentlyViewed}
        addToCart={addToCart}
        wishlist={wishlist}
        addToWishlist={addToWishlist}
        removeFromWishlist={removeFromWishlist}
      />
   
      <div className="bg-gradient-to-b from-white via-rose-50/30 to-white">
        {/* Popular Collections Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
          
          <div className="text-center mb-16 relative z-10">
            <p className="text-rose-400 text-sm tracking-[0.3em] font-light mb-3 uppercase">Curated Collections</p>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-4 tracking-tight">
              Popular Collections
            </h2>
            <div className="flex justify-center items-center gap-3 mt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-300"></div>
              <div className="flex gap-1.5">
                <span className="text-rose-400 text-xl">✦</span>
                <span className="text-rose-300 text-lg">✦</span>
                <span className="text-rose-400 text-xl">✦</span>
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-300"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 relative z-10">
            {collections.map((item, i) => (
              <div 
                key={i} 
                className="group relative"
              >
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-rose-600 text-sm font-medium tracking-wide transition-all duration-300 group/link"
                >
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  
                  {/* Image Container */}
                  <div className="relative w-full h-72 flex items-center justify-center bg-gradient-to-br from-slate-50 to-rose-50/50 p-8 overflow-hidden">
                    {/* Sparkle Effect */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-rose-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                    <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-75"></div>
                    
                    <Image
                      src={item.img}
                      width={220}
                      height={220}
                      alt={item.title}
                      className="transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 relative z-20 drop-shadow-xl"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative p-6 text-center bg-white">
                    <h3 className="text-xl font-serif font-semibold tracking-wide text-slate-800 mb-3 group-hover:text-rose-600 transition-colors duration-300">
                      {item.title}
                    </h3>

                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mb-4"></div>

                      <span className="relative">
                        Explore Collection
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-rose-400 group-hover/link:w-full transition-all duration-300"></span>
                      </span>
                      <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                  </div>
                </div>
            </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Divider with decorative element */}
        <div className="flex items-center justify-center py-8">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
          <div className="mx-4 text-rose-300 text-2xl">✧</div>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
        </div>
  
        {/* New Products Section */}
        <NewProducts 
          addToCart={addToCart} 
          buyNow={buyNow}
          cart={cart}
          subTotal={subTotal}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          wishlist={wishlist}
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
          clearWishlist={clearWishlist}
          moveToCart={moveToCart}
        />
      </div>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .delay-75 {
          animation-delay: 0.75s;
        }
      `}</style>
    </>
  )
}