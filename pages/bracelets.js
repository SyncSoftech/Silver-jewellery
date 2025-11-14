

// import React from 'react'
// import Link from 'next/link'
// import Product from "@/models/Product"
// import mongoose from "mongoose";


// const Bracelets = ({ Bracelets, addToCart, buyNow }) => {
  

//   const handleAddToCart = (Bracelets, e) => {
//     e.stopPropagation();
//     if (addToCart) {
//       addToCart(Bracelets._id, 1, Bracelets.price, Bracelets.title, Bracelets.size || 'M', Bracelets.variant || 'Default', Bracelets.img);
//     }
//   };

//   const handleBuyNow = (Bracelets, e) => {
//     e.stopPropagation();
//     if (buyNow) {
//       buyNow(Bracelets._id, 1, Bracelets.price, Bracelets.title, Bracelets.size || 'M', Bracelets.variant || 'Default', Bracelets.img);
//     }
//   };
//   return (
//     <div className='min-h-screen ' style={{
//       background: 'radial-gradient(circle, #FFF2Ef,#E0CAC5)',
//     }} >
//       <section className="text-gray-600 body-font">
//         <div className="container px-5 py-24 mx-auto">
//           <div className="flex flex-wrap -m-4 justify-center">

//             {Object.keys(Bracelets).map((item) => {

//               return <div passHref={true} key={Bracelets[item]._id} className="lg:w-1/5 md:w-1/2 p-2 w-full cursor-pointer shadow-lg m-5 bg-white overflow-hidden" >
//                 <Link href={`/product/${Bracelets[item].slug}`}>
//                   <span className="block relative rounded overflow-hidden " >
//                     <img alt="ecommerce" className="object-cover " src={Bracelets[item].img} />
//                   </span>
//                 </Link>
//                 <Link href={`/product/${Bracelets[item].slug}`}>
//                   <div className="mt-4 text-left p-2 ">
//                     <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Bracelets</h3>
//                     <h2 className="text-gray-900 title-font text-base font-medium mb-2">{Bracelets[item].title}</h2>
//                     <p className="mt-1 font-semibold text-gray-900">₹{Bracelets[item].price}</p>
//                     <div className="mt-3">
//                       {Bracelets[item].size.includes('Free') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>Free</span>}
//                       {Bracelets[item].size.includes('S') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>S</span>}
//                       {Bracelets[item].size.includes('M') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>M</span>}
//                       {Bracelets[item].size.includes('L') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>L</span>}
//                       {Bracelets[item].size.includes('XL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XL</span>}
//                       {Bracelets[item].size.includes('XXL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XXL</span>}
//                     </div>
//                     <div className="mt-3 flex items-center">
//                       {Bracelets[item].color.includes('Silver') && <button className="border-2 border-gray-400 ml-1 bg-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Black') && <button className="border-2 border-gray-400 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Red') && <button className="border-2 border-gray-400 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-600 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Navy Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-950 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Green') && <button className="border-2 border-gray-400 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>}
//                     </div>
//                   </div>
//                 </Link>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={(e) => handleAddToCart(Bracelets[item], e)}
//                     className="w-1/2 bg-[#CA7F60] hover:bg-[#935338] text-white  py-2 rounded-md text-sm font-medium transition-all"
//                   >
//                     Add to Cart
//                   </button>
//                   <button
//                     onClick={(e) => handleBuyNow(Bracelets[item], e)}
//                     className="w-1/2 bg-black hover:bg-gray-800 text-white py-2 rounded-md text-sm font-medium transition-all"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>

//             })}

//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export async function getServerSideProps(context) {
//   if (!mongoose.connections[0].readyState) {
//     await mongoose.connect(process.env.MONGO_URI)
//   }
//   let Bracelets = await Product.find({ category: 'bracelets' })
//   let Bracelet = {}
//   for (let item of Bracelets) {
//     if (item.title in Bracelet) {
//       if (!Bracelet[item.title].color.includes(item.color) && item.availableQty > 0) {
//         Bracelet[item.title].color.push(item.color)
//       }
//       if (!Bracelet[item.title].size.includes(item.size) && item.availableQty > 0) {
//         Bracelet[item.title].size.push(item.size)
//       }
//     }
//     else {
//       Bracelet[item.title] = JSON.parse(JSON.stringify(item))
//       if (item.availableQty > 0) {
//         Bracelet[item.title].color = [item.color]
//         Bracelet[item.title].size = [item.size]
//       }
//     }
//   }

//   return {
//     props: { Bracelets: JSON.parse(JSON.stringify(Bracelet)) },
//   }
// }

// export default Bracelets


// import React from 'react'
// import Link from 'next/link'
// import Product from "@/models/Product"
// import mongoose from "mongoose";
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";


// const Bracelets = ({ Bracelets, addToCart, buyNow, wishlist = {}, addToWishlist, removeFromWishlist }) => {
  

//   const handleAddToCart = (Bracelets, e) => {
//     e.stopPropagation();
//     if (addToCart) {
//       addToCart(Bracelets._id, 1, Bracelets.price, Bracelets.title, Bracelets.size || 'M', Bracelets.variant || 'Default', Bracelets.img);
//     }
//   };

//   const handleBuyNow = (Bracelets, e) => {
//     e.stopPropagation();
//     if (buyNow) {
//       buyNow(Bracelets._id, 1, Bracelets.price, Bracelets.title, Bracelets.size || 'M', Bracelets.variant || 'Default', Bracelets.img);
//     }
//   };

//   const handleWishlistToggle = (product, e) => {
//     e.stopPropagation();
//     const isInWishlist = product._id in wishlist;
    
//     if (isInWishlist) {
//       if (removeFromWishlist) {
//         removeFromWishlist(product._id);
//       }
//     } else {
//       if (addToWishlist) {
//         addToWishlist(product._id, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
//       }
//     }
//   };

//   return (
//     <div className='min-h-screen ' style={{
//       background: 'radial-gradient(circle, #FFF2Ef,#E0CAC5)',
//     }} >
//       <section className="text-gray-600 body-font">
//         <div className="container px-5 py-24 mx-auto">
//           <div className="flex flex-wrap -m-4 justify-center">

//             {Object.keys(Bracelets).map((item) => {
//               const isInWishlist = Bracelets[item]._id in wishlist;

//               return <div passHref={true} key={Bracelets[item]._id} className="lg:w-1/5 md:w-1/2 p-2 w-full cursor-pointer shadow-lg m-5 bg-white overflow-hidden relative" >
                
//                 {/* Wishlist Heart Icon */}
//                 <button
//                   onClick={(e) => handleWishlistToggle(Bracelets[item], e)}
//                   className="absolute left-3 top-3 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all duration-200 z-10"
//                   title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   {isInWishlist ? (
//                     <AiFillHeart className="text-red-500 text-xl" />
//                   ) : (
//                     <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-xl" />
//                   )}
//                 </button>

//                 <Link href={`/product/${Bracelets[item].slug}`}>
//                   <span className="block relative rounded overflow-hidden " >
//                     <img alt="ecommerce" className="object-cover " src={Bracelets[item].img} />
//                   </span>
//                 </Link>
//                 <Link href={`/product/${Bracelets[item].slug}`}>
//                   <div className="mt-4 text-left p-2 ">
//                     <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Bracelets</h3>
//                     <h2 className="text-gray-900 title-font text-base font-medium mb-2">{Bracelets[item].title}</h2>
//                     <p className="mt-1 font-semibold text-gray-900">₹{Bracelets[item].price}</p>
//                     <div className="mt-3">
//                       {Bracelets[item].size.includes('Free') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>Free</span>}
//                       {Bracelets[item].size.includes('S') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>S</span>}
//                       {Bracelets[item].size.includes('M') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>M</span>}
//                       {Bracelets[item].size.includes('L') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>L</span>}
//                       {Bracelets[item].size.includes('XL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XL</span>}
//                       {Bracelets[item].size.includes('XXL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XXL</span>}
//                     </div>
//                     <div className="mt-3 flex items-center">
//                       {Bracelets[item].color.includes('Silver') && <button className="border-2 border-gray-400 ml-1 bg-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Black') && <button className="border-2 border-gray-400 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Red') && <button className="border-2 border-gray-400 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-600 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Navy Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-950 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Bracelets[item].color.includes('Green') && <button className="border-2 border-gray-400 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>}
//                     </div>
//                   </div>
//                 </Link>

//                 <div className="flex gap-2 p-2">
//                   <button
//                     onClick={(e) => handleAddToCart(Bracelets[item], e)}
//                     className="w-1/2 bg-[#CA7F60] hover:bg-[#935338] text-white  py-2 rounded-md text-sm font-medium transition-all"
//                   >
//                     Add to Cart
//                   </button>
//                   <button
//                     onClick={(e) => handleBuyNow(Bracelets[item], e)}
//                     className="w-1/2 bg-black hover:bg-gray-800 text-white py-2 rounded-md text-sm font-medium transition-all"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>

//             })}

//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// export async function getServerSideProps(context) {
//   if (!mongoose.connections[0].readyState) {
//     await mongoose.connect(process.env.MONGO_URI)
//   }
//   let Bracelets = await Product.find({ category: 'bracelets' })
//   let Bracelet = {}
//   for (let item of Bracelets) {
//     if (item.title in Bracelet) {
//       if (!Bracelet[item.title].color.includes(item.color) && item.availableQty > 0) {
//         Bracelet[item.title].color.push(item.color)
//       }
//       if (!Bracelet[item.title].size.includes(item.size) && item.availableQty > 0) {
//         Bracelet[item.title].size.push(item.size)
//       }
//     }
//     else {
//       Bracelet[item.title] = JSON.parse(JSON.stringify(item))
//       if (item.availableQty > 0) {
//         Bracelet[item.title].color = [item.color]
//         Bracelet[item.title].size = [item.size]
//       }
//     }
//   }

//   return {
//     props: { Bracelets: JSON.parse(JSON.stringify(Bracelet)) },
//   }
// }

// export default Bracelets


// import React from 'react'
// import Link from 'next/link'
// import Product from "@/models/Product"
// import mongoose from "mongoose";
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

// const Bracelets = ({ Bracelets, addToCart, buyNow, wishlist = {}, addToWishlist, removeFromWishlist }) => {
//   // Note: Bracelets (prop) is an object keyed by product.title (per your getServerSideProps)
//   const braceletMap = Bracelets || {};

//   const handleAddToCart = (product, e) => {
//     e.stopPropagation();
//     if (addToCart) {
//       addToCart(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
//     }
//   };

//   const handleBuyNow = (product, e) => {
//     e.stopPropagation();
//     if (buyNow) {
//       buyNow(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
//     }
//   };

//   const handleWishlistToggle = (product, e) => {
//     e.stopPropagation();
//     const isInWishlist = product._id in wishlist;

//     if (isInWishlist) {
//       if (removeFromWishlist) {
//         removeFromWishlist(product._id);
//       }
//     } else {
//       if (addToWishlist) {
//         addToWishlist(product._id, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
//       }
//     }
//   };

//   return (
//     <div className='min-h-screen  relative overflow-hidden' style={{
//       background: 'radial-gradient(circle, #FFF2Ef,#E0CAC5)',
//     }}>
//       {/* Decorative Background Elements */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
//       <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>

//       <section className="text-gray-600 body-font relative z-10">
//         <div className="container px-5 py-20 mx-auto">
//           {/* Page Header */}
//           <div className="text-center mb-16">
//             <p className="text-rose-400 text-sm tracking-[0.3em] font-light mb-3 uppercase">Exquisite Collection</p>
//             <h1 className="text-5xl md:text-6xl font-serif text-slate-800 mb-4 tracking-tight">Bracelets</h1>
//             <div className="flex justify-center items-center gap-3 mt-4">
//               <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300"></div>
//               <div className="flex gap-1.5">
//                 <span className="text-rose-400 text-xl">✦</span>
//                 <span className="text-rose-300 text-lg">✦</span>
//                 <span className="text-rose-400 text-xl">✦</span>
//               </div>
//               <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300"></div>
//             </div>
//             <p className="text-slate-600 mt-6 max-w-2xl mx-auto text-lg">
//               Discover our handcrafted silver bracelets, each piece designed to add elegance to your style
//             </p>
//           </div>

//           {/* Grid / list of products */}
//           <div className="flex flex-wrap -m-4 justify-center">
//             {Object.keys(braceletMap).map((key) => {
//               const product = braceletMap[key];
//               // guard in case product is undefined
//               if (!product) return null;

//               // compute sizes and colors exactly like your original logic
//               const sizes = Array.isArray(product.size) ? product.size.filter(s => s !== null && s !== undefined && String(s).trim() !== '') : [];
//               const colors = Array.isArray(product.color) ? product.color.filter(c => c !== null && c !== undefined && String(c).trim() !== '') : [];

//               const isInWishlist = product._id in wishlist;

//               return (
//                 <div
//                   key={product._id || key}
//                   className="lg:w-1/5 md:w-1/2 p-4 w-full cursor-pointer m-2" 
//                 >
//                   <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 flex flex-col transform hover:-translate-y-2 cursor-pointer border border-gray-100">
//                     <Link href={`/product/${product.slug}`}>
//                       {/* Image Container — perfect square */}
//                       <div className="relative w-full aspect-square bg-white overflow-hidden">
//                         {/* Subtle overlay on hover */}
//                         <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

//                         {/* Optional sale badge */}
//                         {product.sale && (
//                           <span className="absolute right-3 top-3 bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full uppercase font-semibold z-20 shadow-md">
//                             Sale
//                           </span>
//                         )}

//                         {/* Wishlist Heart */}
//                         <button
//                           onClick={(e) => handleWishlistToggle(product, e)}
//                           className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-300 z-20 hover:scale-110 group/heart"
//                           title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                         >
//                           {isInWishlist ? (
//                             <AiFillHeart className="text-rose-500 text-xl animate-pulse" />
//                           ) : (
//                             <AiOutlineHeart className="text-slate-600 group-hover/heart:text-rose-500 text-xl transition-colors" />
//                           )}
//                         </button>

//                         <img
//                           alt={product.title}
//                           src={product.img}
//                           className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
//                         />

//                         {/* Hover overlay actions (slides up) */}
//                         <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
//                           <div className="flex gap-2">
//                             <button
//                               onClick={(e) => { e.stopPropagation(); handleAddToCart(product, e); }}
//                               className="flex-1 bg-white backdrop-blur-sm hover:bg-rose-50 text-gray-800 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
//                             >
//                               Add to Cart
//                             </button>
//                             <button
//                               onClick={(e) => { e.stopPropagation(); handleBuyNow(product, e); }}
//                               className="flex-1 bg-white hover:bg-rose-500 hover:text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
//                             >
//                               Buy Now
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </Link>

//                     {/* Product Info */}
//                     <Link href={`/product/${product.slug}`}>
//                       <div className="p-4 flex flex-col flex-grow bg-white relative">
//                         <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-3xl opacity-40 pointer-events-none"></div>

//                         <h3 className="text-rose-400 text-xs tracking-[0.2em] uppercase font-light mb-2">Bracelets</h3>
//                         <h2 className="text-slate-800 font-serif font-semibold text-base mb-2 line-clamp-2 min-h-[48px] leading-relaxed group-hover:text-rose-600 transition-colors">
//                           {product.title}
//                         </h2>

//                         <div className="mt-auto">
//                           <div className="flex items-center justify-between mb-3">
//                             <div className="flex items-baseline gap-2">
//                               <span className="text-slate-800 font-bold text-xl">₹{product.price}</span>
//                               {product.oldPrice && (
//                                 <span className="text-slate-400 line-through text-xs">₹{product.oldPrice}</span>
//                               )}
//                             </div>
//                             {product.oldPrice && (
//                               <span className="text-rose-500 text-xs font-semibold">
//                                 {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
//                               </span>
//                             )}
//                           </div>

//                           {/* Sizes */}
//                           {sizes.length > 0 && (
//                             <div className="mb-3">
//                               <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Sizes</p>
//                               <div className="flex flex-wrap gap-2">
//                                 {sizes.includes('Free') && (
//                                   <span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>Free</span>
//                                 )}
//                                 {sizes.includes('S') && (<span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>S</span>)}
//                                 {sizes.includes('M') && (<span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>M</span>)}
//                                 {sizes.includes('L') && (<span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>L</span>)}
//                                 {sizes.includes('XL') && (<span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>XL</span>)}
//                                 {sizes.includes('XXL') && (<span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>XXL</span>)}
//                               </div>
//                             </div>
//                           )}

//                           {/* Colors */}
//                           {colors.length > 0 && (
//                             <div className="mb-1">
//                               <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Colors</p>
//                               <div className="flex flex-wrap gap-2 items-center">
//                                 {colors.includes('Silver') && (<button className="border-2 border-slate-300 bg-slate-200 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Silver"></button>)}
//                                 {colors.includes('Black') && (<button className="border-2 border-slate-300 bg-black rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Black"></button>)}
//                                 {colors.includes('Red') && (<button className="border-2 border-slate-300 bg-red-600 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Red"></button>)}
//                                 {colors.includes('Blue') && (<button className="border-2 border-slate-300 bg-blue-500 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Blue"></button>)}
//                                 {colors.includes('Navy Blue') && (<button className="border-2 border-slate-300 bg-blue-950 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Navy Blue"></button>)}
//                                 {colors.includes('Green') && (<button className="border-2 border-slate-300 bg-green-600 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Green"></button>)}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Empty state */}
//           {Object.keys(braceletMap).length === 0 && (
//             <div className="text-center py-20">
//               <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto">
//                 <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
//                   <span className="text-4xl">💎</span>
//                 </div>
//                 <h3 className="text-2xl font-serif text-slate-800 mb-3">No Bracelets Available</h3>
//                 <p className="text-slate-600">Check back soon for new arrivals!</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

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

//         .delay-500 {
//           animation-delay: 0.5s;
//         }

//         .delay-1000 {
//           animation-delay: 1s;
//         }

//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.5;
//           }
//         }

//         .animate-pulse {
//           animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//       `}</style>
//     </div>
//   )
// }

// export async function getServerSideProps(context) {
//   if (!mongoose.connections[0].readyState) {
//     await mongoose.connect(process.env.MONGO_URI)
//   }
//   let Bracelets = await Product.find({ category: 'bracelets' })
//   let Bracelet = {}
//   for (let item of Bracelets) {
//     if (item.title in Bracelet) {
//       if (!Bracelet[item.title].color.includes(item.color) && item.availableQty > 0) {
//         Bracelet[item.title].color.push(item.color)
//       }
//       if (!Bracelet[item.title].size.includes(item.size) && item.availableQty > 0) {
//         Bracelet[item.title].size.push(item.size)
//       }
//     }
//     else {
//       Bracelet[item.title] = JSON.parse(JSON.stringify(item))
//       if (item.availableQty > 0) {
//         Bracelet[item.title].color = [item.color]
//         Bracelet[item.title].size = [item.size]
//       }
//     }
//   }

//   return {
//     props: { Bracelets: JSON.parse(JSON.stringify(Bracelet)) },
//   }
// }

// export default Bracelets


// import React from 'react'
// import Link from 'next/link'
// import Product from "@/models/Product"
// import mongoose from "mongoose";
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

// const Bracelets = ({ Bracelets, addToCart, buyNow, wishlist = {}, addToWishlist, removeFromWishlist }) => {
//   const braceletMap = Bracelets || {};

//   const handleAddToCart = (product, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (addToCart) {
//       addToCart(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
//     }
//   };

//   const handleBuyNow = (product, e) => {
//     e.stopPropagation();
//     // If you still want to call buyNow logic, uncomment next line:
//     // if (buyNow) buyNow(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);

//     // Navigate to product page (slug)
//     if (product && product.slug) {
//       router.push(`/product/${product.slug}`);
//     } else {
//       console.warn("Product slug missing for", product);
//     }
//   };

//   const handleWishlistToggle = (product, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const isInWishlist = product._id in wishlist;
//     if (isInWishlist) {
//       if (removeFromWishlist) removeFromWishlist(product._id);
//     } else {
//       if (addToWishlist) addToWishlist(product._id, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
//     }
//   };

//   return (
//     <div className='min-h-screen  relative overflow-hidden' style={{
//       background: 'radial-gradient(circle, #FFF2Ef,#DBC4BF)',
//     }}>
//       {/* Decorative Background Elements */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
//       <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>

//       <section className="text-gray-600 body-font relative z-10">
//         <div className="container px-5 py-20 mx-auto">
//           {/* Page Header (unchanged) */}
//           <div className="text-center mb-16">
//             <p className="text-rose-400 text-sm tracking-[0.3em] font-light mb-3 uppercase">Exquisite Collection</p>
//             <h1 className="text-5xl md:text-6xl font-serif text-slate-800 mb-4 tracking-tight">Bracelets</h1>
//             <div className="flex justify-center items-center gap-3 mt-4">
//               <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300"></div>
//               <div className="flex gap-1.5">
//                 <span className="text-rose-400 text-xl">✦</span>
//                 <span className="text-rose-300 text-lg">✦</span>
//                 <span className="text-rose-400 text-xl">✦</span>
//               </div>
//               <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300"></div>
//             </div>
//             <p className="text-slate-600 mt-6 max-w-2xl mx-auto text-lg">
//               Discover our handcrafted silver bracelets, each piece designed to add elegance to your style
//             </p>
//           </div>

//           {/* Grid / list of products */}
//           <div className="flex flex-wrap -m-4 justify-center">
//             {Object.keys(braceletMap).map((key) => {
//               const product = braceletMap[key];
//               if (!product) return null;

//               const sizes = Array.isArray(product.size) ? product.size.filter(s => s !== null && s !== undefined && String(s).trim() !== '') : [];
//               const colors = Array.isArray(product.color) ? product.color.filter(c => c !== null && c !== undefined && String(c).trim() !== '') : [];

//               const isInWishlist = product._id in wishlist;

//               return (
//                 <div
//                   key={product._id || key}
//                   className="lg:w-1/5 md:w-1/2 w-1/2 p-1 lg:p-2 cursor-pointer"
//                 >

//                   {/* Card is NOT wrapped by Link anymore */}
//                   <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 flex flex-col transform hover:-translate-y-2 cursor-pointer border border-gray-100">
                    
//                     {/* Image area: Link only wraps the image */}
//                     <div className="relative w-full aspect-square bg-white overflow-hidden">
//                       <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

//                       {product.sale && (
//                         <span className="absolute right-3 top-3 bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full uppercase font-semibold z-20 shadow-md">
//                           Sale
//                         </span>
//                       )}

//                       {/* Wishlist Heart - keep as button (not inside Link) */}
//                       <button
//                         type="button"
//                         onClick={(e) => handleWishlistToggle(product, e)}
//                         className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-300 z-20 hover:scale-110"
//                         title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                       >
//                         {isInWishlist ? (
//                           <AiFillHeart className="text-rose-500 text-xl animate-pulse" />
//                         ) : (
//                           <AiOutlineHeart className="text-slate-600 text-xl transition-colors group-hover:text-rose-500" />
//                         )}
//                       </button>

//                       {/* Link only for the image */}
//                       <Link href={`/product/${product.slug}`} className="block absolute inset-0">
//                         <img
//                           alt={product.title}
//                           src={product.img}
//                           className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
//                         />
//                       </Link>

//                       {/* Hover overlay actions — but buttons are outside Link so clicks won't navigate */}
//                       <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
//                         <div className="flex gap-2">
//                           <button
//                             type="button"
//                             onClick={(e) => handleAddToCart(product, e)}
//                             className="flex-1 bg-white backdrop-blur-sm hover:bg-rose-50 text-gray-800 py-2.5 rounded-xl text-xs sm:font-light lg:font-semibold transition-all duration-300 shadow-md"
//                           >
//                             Add to Cart
//                           </button>
//                           <button
//                             type="button"
//                             onClick={(e) => handleBuyNow(product, e)}
//                             className="flex-1 bg-white hover:bg-rose-500 hover:text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
//                           >
//                             Buy Now
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Product Info — wrap the title (or part of info) with Link, keep other metadata outside */}
//                     <div className="p-4 flex flex-col flex-grow bg-white relative">
//                       <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-3xl opacity-40 pointer-events-none"></div>

//                       <h3 className="text-rose-400 text-xs tracking-[0.2em] uppercase font-light sm:mb-1 lg:mb-2 ">Bracelets</h3>

//                       {/* Only the title links to the product page */}
//                       <Link href={`/product/${product.slug}`} className="group">
//                         <h2 className="text-slate-800 font-serif sm:text-xs sm:font-light lg:text-base lg:font-semibold line-clamp-2 min-h-[48px] leading-relaxed group-hover:text-rose-600 transition-colors">
//                           {product.title}
//                         </h2>
//                       </Link>

//                       <div className="mt-auto">
//                         <div className="flex items-center justify-between ">
//                           <div className="flex items-baseline gap-2">
//                             <span className="text-slate-800 sm:text-base font-bold lg:text-xl">₹{product.price}</span>
//                             {product.oldPrice && (
//                               <span className="text-slate-400 line-through text-xs">₹{product.oldPrice}</span>
//                             )}
//                           </div>
//                           {product.oldPrice && (
//                             <span className="text-rose-500 text-xs font-semibold">
//                               {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
//                             </span>
//                           )}
//                         </div>

//                         {/* Sizes */}
//                         {Array.isArray(product.size) && product.size.filter(Boolean).length > 0 && (
//                           <div className="mb-3">
//                             <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Sizes</p>
//                             <div className="flex flex-wrap gap-2">
//                               {product.size.includes('Free') && (<span className='...'>Free</span>)}
//                               {product.size.includes('S') && (<span className='...'>S</span>)}
//                               {product.size.includes('M') && (<span className='...'>M</span>)}
//                               {product.size.includes('L') && (<span className='...'>L</span>)}
//                               {product.size.includes('XL') && (<span className='...'>XL</span>)}
//                               {product.size.includes('XXL') && (<span className='...'>XXL</span>)}
//                             </div>
//                           </div>
//                         )}

//                         {/* Colors (same logic) */}
//                         {Array.isArray(product.color) && product.color.filter(Boolean).length > 0 && (
//                           <div className="mb-1">
//                             <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Colors</p>
//                             <div className="flex flex-wrap gap-2 items-center">
//                               {product.color.includes('Silver') && (<button className="..." title="Silver"></button>)}
//                               {product.color.includes('Black') && (<button className="..." title="Black"></button>)}
//                               {product.color.includes('Red') && (<button className="..." title="Red"></button>)}
//                               {product.color.includes('Blue') && (<button className="..." title="Blue"></button>)}
//                               {product.color.includes('Navy Blue') && (<button className="..." title="Navy Blue"></button>)}
//                               {product.color.includes('Green') && (<button className="..." title="Green"></button>)}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Empty state (unchanged) */}
//           {Object.keys(braceletMap).length === 0 && (
//             <div className="text-center py-20">
//               <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto">
//                 <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
//                   <span className="text-4xl">💎</span>
//                 </div>
//                 <h3 className="text-2xl font-serif text-slate-800 mb-3">No Bracelets Available</h3>
//                 <p className="text-slate-600">Check back soon for new arrivals!</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

      
//     </div>
//   )
// }

// export async function getServerSideProps(context) {
//   if (!mongoose.connections[0].readyState) {
//     await mongoose.connect(process.env.MONGO_URI)
//   }
//   let Bracelets = await Product.find({ category: 'bracelets' })
//   let Bracelet = {}
//   for (let item of Bracelets) {
//     if (item.title in Bracelet) {
//       if (!Bracelet[item.title].color.includes(item.color) && item.availableQty > 0) {
//         Bracelet[item.title].color.push(item.color)
//       }
//       if (!Bracelet[item.title].size.includes(item.size) && item.availableQty > 0) {
//         Bracelet[item.title].size.push(item.size)
//       }
//     }
//     else {
//       Bracelet[item.title] = JSON.parse(JSON.stringify(item))
//       if (item.availableQty > 0) {
//         Bracelet[item.title].color = [item.color]
//         Bracelet[item.title].size = [item.size]
//       }
//     }
//   }

//   return {
//     props: { Bracelets: JSON.parse(JSON.stringify(Bracelet)) },
//   }
// }

// export default Bracelets



// pages/bracelets.js
import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Product from '@/models/Product'
import mongoose from 'mongoose'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// Dynamically import heavy icons to reduce initial bundle
const AiOutlineHeart = dynamic(() => import('react-icons/ai').then(m => m.AiOutlineHeart))
const AiFillHeart = dynamic(() => import('react-icons/ai').then(m => m.AiFillHeart))

// Memoized product card to avoid re-renders
const ProductCard = memo(function ProductCard({
  product,
  isInWishlist,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
}) {
  // Defensive defaults
  const sizes = Array.isArray(product.size) ? product.size.filter(Boolean) : []
  const colors = Array.isArray(product.color) ? product.color.filter(Boolean) : []

  return (
    <div className="lg:w-1/5 md:w-1/2 w-1/2 p-1 lg:p-2">
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 flex flex-col transform hover:-translate-y-2 cursor-pointer border border-gray-100">
        <div className="relative w-full aspect-square bg-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

          {product.sale && (
            <span className="absolute right-3 top-3 bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full uppercase font-semibold z-20 shadow-md">
              Sale
            </span>
          )}

          <button
            type="button"
            onClick={(e) => onWishlistToggle(product, e)}
            className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-300 z-20 hover:scale-110"
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist ? (
              <AiFillHeart className="text-rose-500 text-xl animate-pulse" />
            ) : (
              <AiOutlineHeart className="text-slate-600 text-xl transition-colors group-hover:text-rose-500" />
            )}
          </button>

          {/* Link only for the image */}
          <Link href={`/product/${product.slug}`} className="block absolute inset-0">
            <span className="block relative w-full h-full">
              <Image
                src={product.img || '/placeholder.png'}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                style={{ objectFit: 'contain' }}
                decoding="async"
                priority={false} // keep false so below-fold images lazy load
                className="transition-transform duration-700 group-hover:scale-105"
              />
            </span>
          </Link>

          {/* Hover overlay actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => onAddToCart(product, e)}
                className="flex-1 bg-white backdrop-blur-sm hover:bg-rose-50 text-gray-800 py-2.5 rounded-xl text-xs sm:font-light lg:font-semibold transition-all duration-300 shadow-md"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={(e) => onBuyNow(product, e)}
                className="flex-1 bg-white hover:bg-rose-500 hover:text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow bg-white relative">
          <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-3xl opacity-40 pointer-events-none" />

          <h3 className="text-rose-400 text-xs tracking-[0.2em] uppercase font-light sm:mb-1 lg:mb-2">Bracelets</h3>

          <Link href={`/product/${product.slug}`} className="group">
            <span>
              <h2 className="text-slate-800 font-serif sm:text-xs sm:font-light lg:text-base lg:font-semibold line-clamp-2 min-h-[48px] leading-relaxed group-hover:text-rose-600 transition-colors">
                {product.title}
              </h2>
            </span>
          </Link>

          <div className="mt-auto">
            <div className="flex items-center justify-between ">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-800 sm:text-base font-bold lg:text-xl">₹{product.price}</span>
                {product.oldPrice && (
                  <span className="text-slate-400 line-through text-xs">₹{product.oldPrice}</span>
                )}
              </div>
              {product.oldPrice && (
                <span className="text-rose-500 text-xs font-semibold">
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <span key={s} className="text-xs px-2 py-1 border rounded-md">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-1">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Colors</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {colors.map((c) => (
                    <div key={c} title={c} className="w-6 h-6 rounded-full border" aria-hidden>
                      {/* Small accessible color indicator */}
                      <span className="sr-only">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

// main page component
const BraceletsPage = ({ Bracelets = {}, addToCart, buyNow, wishlist = {}, addToWishlist, removeFromWishlist }) => {
  const router = useRouter()
  const braceletMap = Bracelets || {}
  const keys = Object.keys(braceletMap)

  // incremental loading config
  const BATCH = 12
  const [visibleCount, setVisibleCount] = useState(Math.min(BATCH, keys.length))
  const loadMoreRef = useRef(null)

  // handlers (useCallback so child memoization stays effective)
  const handleAddToCart = useCallback((product, e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (typeof addToCart === 'function') {
      addToCart(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img)
    }
  }, [addToCart])

  const handleBuyNow = useCallback((product, e) => {
    e?.stopPropagation?.()
    // If you want to call buyNow function, you can:
    // if (typeof buyNow === 'function') buyNow(product._id, ...)
    if (product && product.slug) {
      router.push(`/product/${product.slug}`)
    } else {
      console.warn('Product slug missing for', product)
    }
  }, [router, buyNow])

  const handleWishlistToggle = useCallback((product, e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    const isInWishlist = product._id in wishlist
    if (isInWishlist) {
      if (typeof removeFromWishlist === 'function') removeFromWishlist(product._id)
    } else {
      if (typeof addToWishlist === 'function') addToWishlist(product._id, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img)
    }
  }, [wishlist, addToWishlist, removeFromWishlist])

  // IntersectionObserver for infinite scroll / load-more
  useEffect(() => {
    if (!loadMoreRef.current) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => {
            const next = Math.min(prev + BATCH, keys.length)
            return next
          })
        }
      })
    }, { rootMargin: '300px' })

    obs.observe(loadMoreRef.current)
    return () => obs.disconnect()
  }, [keys.length])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'radial-gradient(circle, #FFF2Ef,#DBC4BF)' }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500" />

      <section className="text-gray-600 body-font relative z-10">
        <div className="container px-5 py-20 mx-auto">
          <div className="text-center mb-16">
            <p className="text-rose-400 text-sm tracking-[0.3em] font-light mb-3 uppercase">Exquisite Collection</p>
            <h1 className="text-5xl md:text-6xl font-serif text-slate-800 mb-4 tracking-tight">Bracelets</h1>
            <div className="flex justify-center items-center gap-3 mt-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300" />
              <div className="flex gap-1.5"><span className="text-rose-400 text-xl">✦</span><span className="text-rose-300 text-lg">✦</span><span className="text-rose-400 text-xl">✦</span></div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300" />
            </div>
            <p className="text-slate-600 mt-6 max-w-2xl mx-auto text-lg">
              Discover our handcrafted silver bracelets, each piece designed to add elegance to your style
            </p>
          </div>

          <div className="flex flex-wrap -m-4 justify-center">
            {keys.slice(0, visibleCount).map((key) => {
              const product = braceletMap[key]
              if (!product) return null
              const isInWishlist = product._id in wishlist
              return (
                <ProductCard
                  key={product._id || key}
                  product={product}
                  isInWishlist={isInWishlist}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onWishlistToggle={handleWishlistToggle}
                />
              )
            })}
          </div>

          {/* Load more sentinel / empty state */}
          <div className="text-center mt-8">
            {keys.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-2xl font-serif text-slate-800 mb-3">No Bracelets Available</h3>
                <p className="text-slate-600">Check back soon for new arrivals!</p>
              </div>
            ) : (
              // sentinel for intersection observer to trigger loading more
              <div ref={loadMoreRef} className="py-6">
                {visibleCount < keys.length ? (
                  <p className="text-slate-600">Loading more items…</p>
                ) : (
                  <p className="text-slate-600">You’ve reached the end.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  const items = await Product.find({ category: 'bracelets' }).lean()
  const Bracelet = {}
  for (let item of items) {
    // ensure keys exist and we aggregate available sizes/colors only when qty > 0
    const title = item.title || item._id.toString()
    if (title in Bracelet) {
      if (item.availableQty > 0) {
        if (item.color && !Bracelet[title].color.includes(item.color)) Bracelet[title].color.push(item.color)
        if (item.size && !Bracelet[title].size.includes(item.size)) Bracelet[title].size.push(item.size)
      }
    } else {
      // clone item and set arrays
      Bracelet[title] = JSON.parse(JSON.stringify(item))
      Bracelet[title].color = item.availableQty > 0 && item.color ? [item.color] : []
      Bracelet[title].size = item.availableQty > 0 && item.size ? [item.size] : []
    }
  }

  return {
    props: { Bracelets: JSON.parse(JSON.stringify(Bracelet)) },
  }
}

export default BraceletsPage
