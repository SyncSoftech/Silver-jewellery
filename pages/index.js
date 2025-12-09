// "use client";


// import Head from 'next/head'
// import { useState, useEffect } from "react";
// import Hero from '../components/Hero'
// import NewProducts from '../components/products'
// import Image from "next/image";
// import { Inter } from 'next/font/google'
// import RecentlyViewed from '@/components/RecentlyViewed'
// import Link from 'next/link'

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


//   const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);
// const [bdayForm, setBdayForm] = useState({ name: "", birthday: "" });

// useEffect(() => {
//   const token = localStorage.getItem("token");
//   const userRaw = localStorage.getItem("user");
//   if (!token || !userRaw) return;

//   let user;
//   try {
//     user = JSON.parse(userRaw);
//   } catch {
//     return;
//   }

//   if (!user?._id || !user?.name) return;

//   fetch(`/api/birthday/user?userId=${user._id}`)
//     .then(res => res.json())
//     .then(data => {
//       if (!data.data) {
//         // No birthday saved → show popup
//         setBdayForm({
//           name: user.name,
//           birthday: ""
//         });
//         setShowBirthdayPopup(true);
//       }
//     })
//     .catch(() => {});
// }, []);
// const handleBirthdaySubmit = async () => {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   const res = await fetch("/api/birthday/user", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       userId: user._id,
//       name: bdayForm.name,
//       birthday: bdayForm.birthday
//     }),
//   });

//   const data = await res.json();
//   if (data.success) {
//     setShowBirthdayPopup(false);
//   }
// };


//   const collections = [
//     {
//       title: "BRACELETS",
//       img: "/Bracelets.png",
//       link: "/bracelets",
//     },
//     {
//       title: "EARRINGS",
//       img: "/Earrings.png",
//       link: "/earrings",
//     },
//     {
//       title: "NECKLACES",
//       img: "/Necklaces.png",
//       link: "/necklaces",
//     },
//     {
//       title: "RINGS",
//       img: "/Rings.png",
//       link: "/rings",
//     },
//   ];

//   return (
//     <>
//       <Head>
//         <title>Elegant Silver Jewelry Collection</title>
//         <meta name="description" content="Exquisite handcrafted silver jewelry for women" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
    
//       <Hero/>
      
//       <RecentlyViewed 
//         recentlyViewed={recentlyViewed}
//         addToCart={addToCart}
//         wishlist={wishlist}
//         addToWishlist={addToWishlist}
//         removeFromWishlist={removeFromWishlist}
//       />
   
//       <div className="bg-gradient-to-b from-white via-rose-50/30 to-white">
//        {/* Popular Collections Section */}
// <section className="py-20 relative overflow-hidden">
//   {/* Decorative Elements */}
//   <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
//   <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
  
//   <div className="text-center mb-16 relative z-10">
//     <p className="text-rose-400 text-sm tracking-[0.3em] font-light mb-3 uppercase">Curated Collections</p>
//     <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-4 tracking-tight">
//       Popular Collections
//     </h2>
//     <div className="flex justify-center items-center gap-3 mt-4">
//       <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-300"></div>
//       <div className="flex gap-1.5">
//         <span className="text-rose-400 text-xl">✦</span>
//         <span className="text-rose-300 text-lg">✦</span>
//         <span className="text-rose-400 text-xl">✦</span>
//       </div>
//       <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-300"></div>
//     </div>
//   </div>

//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 sm:px-6 relative z-10 justify-items-center">
//     {collections.map((item, i) => (
//       <div key={i} className="w-full max-w-xs group">
//         {/* Use Link + anchor so layout is predictable */}
//         <Link href={item.link} passHref>
//           <span className="inline-block w-full">
//             <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 mx-auto">
//               {/* Gradient Overlay on Hover */}
//               <div className="absolute inset-0 bg-gradient-to-t from-rose-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
              
//               {/* Image Container */}
//               <div className="relative w-full h-64 flex items-center justify-center bg-gradient-to-br from-slate-50 to-rose-50/50 p-6 overflow-hidden">
//                 {/* Sparkle Effect */}
//                 <div className="absolute top-4 right-4 w-2 h-2 bg-rose-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
//                 <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-75"></div>
                
//                 <Image
//                   src={item.img}
//                   width={220}
//                   height={220}
//                   alt={item.title}
//                   className="transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 relative z-20 drop-shadow-xl object-contain max-w-full"
//                 />
//               </div>

//               {/* Content */}
//               <div className="relative p-6 text-center bg-white">
//                 <h3 className="text-xl font-serif font-semibold tracking-wide text-slate-800 mb-3 group-hover:text-rose-600 transition-colors duration-300">
//                   {item.title}
//                 </h3>

//                 <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mb-4"></div>

//                 <div className="flex items-center justify-center gap-2">
//                   <span className="relative inline-block">
//                     Explore Collection
//                     <span className="absolute bottom-0 left-0 w-0 h-px bg-rose-400 group-hover:w-full transition-all duration-300"></span>
//                   </span>
//                   <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </span>
//         </Link>
//       </div>
//     ))}
//   </div>
// </section>


//         {/* Divider with decorative element */}
//         <div className="flex items-center justify-center py-8">
//           <div className="h-px w-24 bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
//           <div className="mx-4 text-rose-300 text-2xl">✧</div>
//           <div className="h-px w-24 bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
//         </div>
  
//         {/* New Products Section */}
//         <NewProducts 
//           addToCart={addToCart} 
//           buyNow={buyNow}
//           cart={cart}
//           subTotal={subTotal}
//           removeFromCart={removeFromCart}
//           clearCart={clearCart}
//           wishlist={wishlist}
//           addToWishlist={addToWishlist}
//           removeFromWishlist={removeFromWishlist}
//           clearWishlist={clearWishlist}
//           moveToCart={moveToCart}
//         />
//       </div>
//  {showBirthdayPopup && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]">
//     <div className="bg-white p-6 rounded-lg w-80 shadow-xl animate-fadeIn">
//       <h2 className="text-lg font-semibold text-center mb-4 text-rose-600">
//         🎉 Tell Us Your Birthday!
//       </h2>

//       <p className="text-sm text-gray-600 mb-3 text-center">
//         So we can send you a special birthday gift 🎁  
//       </p>

//       <label className="block text-sm font-medium">Name</label>
//       <input
//         type="text"
//         value={bdayForm.name}
//         onChange={(e) => setBdayForm({ ...bdayForm, name: e.target.value })}
//         className="w-full p-2 border rounded mb-3"
//       />

//       <label className="block text-sm font-medium">Birthday</label>
//       <input
//         type="date"
//         value={bdayForm.birthday}
//         onChange={(e) => setBdayForm({ ...bdayForm, birthday: e.target.value })}
//         className="w-full p-2 border rounded mb-4"
//       />

//       <button
//         onClick={handleBirthdaySubmit}
//         className="w-full bg-rose-600 text-white py-2 rounded-lg font-medium hover:bg-rose-700 transition"
//       >
//         Save
//       </button>
//     </div>
//   </div>
// )}

//       <style jsx>{`
//         @keyframes ping {
//           75%, 100% {
//             transform: scale(2);
//             opacity: 0;
//           }
//         }
        
//         .animate-ping {
//           animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
//         }
        
//         .delay-75 {
//           animation-delay: 0.75s;
//         }

//         @keyframes fadeIn {
//         from { opacity: 0; transform: scale(0.9); }
//         to { opacity: 1; transform: scale(1); }
//       }
//       .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
//       `}</style>

//     </>
//   )
// }



// "use client";

// import Head from 'next/head'
// import { useState, useEffect } from "react";
// import Hero from '../components/Hero'
// import NewProducts from '../components/products'
// import Image from "next/image";
// import { Inter } from 'next/font/google'
// import RecentlyViewed from '@/components/RecentlyViewed'
// import Link from 'next/link'

// const inter = Inter({ subsets: ['latin'] })

// // ⭐ FRONTEND-SAFE JWT DECODER (NO SECRET NEEDED)
// function decodeToken(token) {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     return JSON.parse(atob(base64)); // decode payload
//   } catch (e) {
//     console.error("Token decode failed:", e);
//     return null;
//   }
// }

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

//   const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);
//   const [bdayForm, setBdayForm] = useState({ name: "", birthday: "" });

//   // ⭐ Popup Logic — Works Even After Login Redirect
//   useEffect(() => {
//     console.log("Birthday watcher started");

//     let checkInterval = setInterval(() => {
//       const token = localStorage.getItem("token");
//       if (!token) return; // user not logged in yet

//       const decoded = decodeToken(token);
//       console.log("Decoded Token:", decoded);

//       if (!decoded || !decoded.user) return;

//       const userId = decoded.user;
//       const userName = decoded.name || "";

//       clearInterval(checkInterval);

//       fetch(`/api/birthday/user?userId=${userId}`)
//         .then((res) => res.json())
//         .then((data) => {
//           console.log("Birthday API:", data);

//           if (!data.data) {
//             setBdayForm({
//               name: userName,
//               birthday: ""
//             });
//             setShowBirthdayPopup(true);
//           }
//         })
//         .catch((err) => console.log("Birthday API error:", err));
//     }, 1000);

//     return () => clearInterval(checkInterval);
//   }, []);

//   const handleBirthdaySubmit = async () => {
//     const token = localStorage.getItem("token");
//     const decoded = decodeToken(token);
//     const userId = decoded?.user;

//     const res = await fetch("/api/birthday/user", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId,
//         name: bdayForm.name,
//         birthday: bdayForm.birthday
//       }),
//     });

//     const data = await res.json();
//     if (data.success) {
//       setShowBirthdayPopup(false);
//     }
//   };

//   // Collections List
//   const collections = [
//     { title: "BRACELETS", img: "/Bracelets.png", link: "/bracelets" },
//     { title: "EARRINGS", img: "/Earrings.png", link: "/earrings" },
//     { title: "NECKLACES", img: "/Necklaces.png", link: "/necklaces" },
//     { title: "RINGS", img: "/Rings.png", link: "/rings" }
//   ];

//   return (
//     <>
//       <Head>
//         <title>Elegant Silver Jewelry Collection</title>
//         <meta name="description" content="Exquisite handcrafted silver jewelry for women" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <Hero />

//       <RecentlyViewed 
//         recentlyViewed={recentlyViewed}
//         addToCart={addToCart}
//         wishlist={wishlist}
//         addToWishlist={addToWishlist}
//         removeFromWishlist={removeFromWishlist}
//       />

//       <div className="bg-gradient-to-b from-white via-rose-50/30 to-white">

// {/* Popular Collections */}
// <section className="py-20 relative overflow-hidden">

//   <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
//   <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

//   <div className="text-center mb-16 relative z-10">
//     <p className="text-rose-400 text-sm tracking-[0.3em]">Curated Collections</p>
//     <h2 className="text-5xl font-serif text-slate-800">Popular Collections</h2>
//   </div>

//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 relative z-10">
//     {collections.map((item, i) => (
//       <Link key={i} href={item.link}>
//         <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 p-6">
//           <Image src={item.img} width={220} height={220} alt={item.title} className="mx-auto" />
//           <h3 className="text-xl font-serif text-center mt-4">{item.title}</h3>
//         </div>
//       </Link>
//     ))}
//   </div>
// </section>

// {/* Divider */}
// <div className="flex items-center justify-center py-8">
//   <div className="h-px w-24 bg-rose-200"></div>
//   <div className="mx-4 text-rose-300 text-2xl">✧</div>
//   <div className="h-px w-24 bg-rose-200"></div>
// </div>

// {/* New Products */}
// <NewProducts 
//   addToCart={addToCart}
//   buyNow={buyNow}
//   cart={cart}
//   subTotal={subTotal}
//   removeFromCart={removeFromCart}
//   clearCart={clearCart}
//   wishlist={wishlist}
//   addToWishlist={addToWishlist}
//   removeFromWishlist={removeFromWishlist}
//   clearWishlist={clearWishlist}
//   moveToCart={moveToCart}
// />

// </div>

// {/* ⭐ BIRTHDAY POPUP */}
// {showBirthdayPopup && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
//     <div className="bg-white p-6 rounded-lg w-80 shadow-xl animate-fadeIn">
//       <h2 className="text-lg font-semibold text-center mb-4 text-rose-600">
//         🎉 Tell Us Your Birthday For Special Birthday Offer!
//       </h2>

//       <label className="block text-sm font-medium">Name</label>
//       <input
//         type="text"
//         value={bdayForm.name}
//         onChange={(e) => setBdayForm({ ...bdayForm, name: e.target.value })}
//         className="w-full p-2 border rounded mb-3"
//       />

//       <label className="block text-sm font-medium">Birthday</label>
//       <input
//         type="date"
//         value={bdayForm.birthday}
//         onChange={(e) => setBdayForm({ ...bdayForm, birthday: e.target.value })}
//         className="w-full p-2 border rounded mb-4"
//       />

//       <button
//         onClick={handleBirthdaySubmit}
//         className="w-full bg-rose-600 text-white py-2 rounded-lg"
//       >
//         Save
//       </button>
//     </div>
//   </div>
// )}

// <style jsx>{`
// @keyframes fadeIn {
//   from { opacity: 0; transform: scale(0.9); }
//   to { opacity: 1; transform: scale(1); }
// }
// .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
// `}</style>

//     </>
//   )
// }



"use client";

import Head from 'next/head'
import { useState, useEffect } from "react";
import Hero from '../components/Hero'
import NewProducts from '../components/products'
import Image from "next/image";
import { Inter } from 'next/font/google'
import RecentlyViewed from '@/components/RecentlyViewed'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

// ⭐ FRONTEND SAFE JWT DECODER
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (e) {
    console.error("Token decode failed:", e);
    return null;
  }
}

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

  // ⭐ POPUP STATES
  const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);
  const [bdayForm, setBdayForm] = useState({ name: "", birthday: "" });
  const [birthdayWishPopup, setBirthdayWishPopup] = useState(false);
  const [birthdayCoupon, setBirthdayCoupon] = useState("");

  // ⭐ MAIN BIRTHDAY LOGIC
  useEffect(() => {
    let interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = decodeToken(token);
      if (!decoded || !decoded.user) return;

      const userId = decoded.user;
      const userName = decoded.name || "";

      clearInterval(interval);

      // Fetch birthday data
      const res = await fetch(`/api/birthday/user?userId=${userId}`);
      const data = await res.json();

      if (!data.data) {
        // Ask user to enter birthday
        setBdayForm({ name: userName, birthday: "" });
        setShowBirthdayPopup(true);
        return;
      }

      // ⭐ Check if today is birthday
      const today = new Date();
      const bday = new Date(data.data.birthday);

      const isToday =
        today.getDate() === bday.getDate() &&
        today.getMonth() === bday.getMonth();

      if (!isToday) return;

    // ⭐ AUTO GEN BDAY COUPON IF NOT EXISTS
const year = today.getFullYear();
const prefix = userName.substring(0, 3).toUpperCase();
const couponCode = `BDAY-${prefix}-${year}`;

// Check if coupon exists
const couponRes = await fetch(`/api/coupons?search=${couponCode}`);
const couponData = await couponRes.json();

let finalCoupon = "";

// If coupon exists → use it
if (couponData?.data?.length > 0) {
  finalCoupon = couponData.data[0].code;
} 
else {
  // ⭐ Auto-generate birthday coupon
  const createRes = await fetch("/api/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: couponCode,
      description: `Happy Birthday ${userName}! 🎉`,
      discountType: "percentage",
      value: 20,              // ⭐ 20% OFF birthday discount
      minOrderAmount: 0,
      maxDiscount: null,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // ⭐ 7 days validity
      applyToAll: true
    }),
  });

  const newCoupon = await createRes.json();

  if (newCoupon.success) {
    finalCoupon = newCoupon.data.code;
  }
}

// Show popup
setBirthdayCoupon(finalCoupon);
setBirthdayWishPopup(true);

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ⭐ SAVE BIRTHDAY
  const handleBirthdaySubmit = async () => {
    const token = localStorage.getItem("token");
    const decoded = decodeToken(token);
    const userId = decoded?.user;

    const res = await fetch("/api/birthday/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        name: bdayForm.name,
        birthday: bdayForm.birthday,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setShowBirthdayPopup(false);
    }
  };

  /* UI Starts */

  const collections = [
    { title: "BRACELETS", img: "/Bracelets.png", link: "/bracelets" },
    { title: "EARRINGS", img: "/Earrings.png", link: "/earrings" },
    { title: "NECKLACES", img: "/Necklaces.png", link: "/necklaces" },
    { title: "RINGS", img: "/Rings.png", link: "/rings" },
  ];

  return (
    <>
      <Head>
        <title>Elegant Silver Jewelry Collection</title>
      </Head>

      <Hero />

      <RecentlyViewed
        recentlyViewed={recentlyViewed}
        addToCart={addToCart}
        wishlist={wishlist}
        addToWishlist={addToWishlist}
        removeFromWishlist={removeFromWishlist}
      />

       <div className="bg-gradient-to-b from-white via-rose-50/30 to-white">

 {/* Popular Collections */}
 <section className="py-20 relative overflow-hidden">
   <div className="absolute top-0 left-0 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
   <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
   <div className="text-center mb-16 relative z-10">
     <p className="text-rose-400 text-sm tracking-[0.3em]">Curated Collections</p>
     <h2 className="text-5xl font-serif text-slate-800">Popular Collections</h2>
   </div>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 relative z-10">
     {collections.map((item, i) => (
      <Link key={i} href={item.link}>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 p-6">
          <Image src={item.img} width={220} height={220} alt={item.title} className="mx-auto" />
          <h3 className="text-xl font-serif text-center mt-4">{item.title}</h3>
        </div>
      </Link>
    ))}
  </div>
</section>

{/* Divider */}
<div className="flex items-center justify-center py-8">
  <div className="h-px w-24 bg-rose-200"></div>
  <div className="mx-4 text-rose-300 text-2xl">✧</div>
  <div className="h-px w-24 bg-rose-200"></div>
</div>

{/* New Products */}
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

      {/* ⭐ BIRTHDAY DATA POPUP */}
      {showBirthdayPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-80 shadow-xl animate-fadeIn">
            <h2 className="text-lg font-semibold text-center mb-4 text-rose-600">
              🎉 Tell Us Your Birthday!
            </h2>

            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={bdayForm.name}
              onChange={(e) => setBdayForm({ ...bdayForm, name: e.target.value })}
              className="w-full p-2 border rounded mb-3"
            />

            <label className="block text-sm font-medium">Birthday</label>
            <input
              type="date"
              value={bdayForm.birthday}
              onChange={(e) => setBdayForm({ ...bdayForm, birthday: e.target.value })}
              className="w-full p-2 border rounded mb-4"
            />

            <button
              onClick={handleBirthdaySubmit}
              className="w-full bg-rose-600 text-white py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* 🎉 ⭐ BIRTHDAY WISH POPUP ⭐ */}
      {birthdayWishPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[99999]">
          <div className="bg-white p-6 rounded-xl w-80 text-center shadow-xl animate-fadeIn">
            <h2 className="text-2xl font-bold text-rose-600 mb-2">🎉 Happy Birthday! 🎉</h2>

            <p className="text-gray-700">Wishing you a joyful and sparkling year ahead! ✨</p>

            {birthdayCoupon ? (
              <>
                <p className="mt-4 font-semibold text-gray-800">Your Special Coupon:</p>
                <p className="text-3xl font-bold text-rose-600 mt-1">{birthdayCoupon}</p>
                <p className="text-sm text-gray-500 mt-2">Valid for 7 days ❤️</p>
              </>
            ) : (
              <p className="text-gray-500 mt-3">Generating your birthday gift… 🎁</p>
            )}

            <button
              onClick={() => setBirthdayWishPopup(false)}
              className="w-full bg-rose-600 text-white py-2 rounded-lg mt-5"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </>
  );
}
