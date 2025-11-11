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

import Head from 'next/head'
import Hero from '../components/Hero'
import NewProducts from '../components/products'
import Image from "next/image";
import { Inter } from 'next/font/google'
import RecentlyViewed from '@/components/RecentlyViewed'


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
      link: "#",
    },
    {
      title: "EARRINGS",
      img: "/Earrings.png",
      link: "#",
    },
    {
      title: "NECKLACES",
      img: "/Necklaces.png",
      link: "#",
    },
    {
      title: "RINGS",
      img: "/Rings.png",
      link: "#",
    },
  ];
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="e-commerce" />
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
   
<div >
  
    <section className="py-16 bg-white">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">POPULAR COLLECTIONS</h2>
        <div className="flex justify-center mt-3 space-x-2 text-gray-500">
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
        {collections.map((item, i) => (
          <div key={i} className="text-center group bg-gray-100 hover:bg-[#F2E4CC] p-5">
            <div className="w-full flex justify-center">
              <Image
                src={item.img}
                width={200}
                height={200}
                alt={item.title}
                className="transition-all duration-300 group-hover:scale-105"
              />
            </div>

            <h3 className="text-xl -mt-10 font-medium tracking-wider">{item.title}</h3>

            <div className=" mb-2 border-b-2 border-yellow-500 w-12 mx-auto" />

            <a
              href={item.link}
              className="text-gray-600 hover:text-black text-sm tracking-wide underline decoration-yellow-500"
            >
              See the Collection
            </a>
          </div>
        ))}
      </div>
    </section>
  
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
  </>
  )
}