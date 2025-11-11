

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




import React from 'react'
import Link from 'next/link'
import Product from "@/models/Product"
import mongoose from "mongoose";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Bracelets = ({ Bracelets, addToCart, buyNow, wishlist = {}, addToWishlist, removeFromWishlist }) => {
  
  const handleAddToCart = (Bracelets, e) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart(Bracelets._id, 1, Bracelets.price, Bracelets.title, Bracelets.size || 'M', Bracelets.variant || 'Default', Bracelets.img);
    }
  };

  const handleBuyNow = (Bracelets, e) => {
    e.stopPropagation();
    if (buyNow) {
      buyNow(Bracelets._id, 1, Bracelets.price, Bracelets.title, Bracelets.size || 'M', Bracelets.variant || 'Default', Bracelets.img);
    }
  };

  const handleWishlistToggle = (product, e) => {
    e.stopPropagation();
    const isInWishlist = product._id in wishlist;
    
    if (isInWishlist) {
      if (removeFromWishlist) {
        removeFromWishlist(product._id);
      }
    } else {
      if (addToWishlist) {
        addToWishlist(product._id, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
      }
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-rose-50 via-purple-50/30 to-pink-50 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>

      <section className="text-gray-600 body-font relative z-10">
        <div className="container px-5 py-20 mx-auto">
          {/* Page Header */} 
          <div className="text-center mb-16">
            <p className="text-rose-400 text-sm tracking-[0.3em] font-light mb-3 uppercase">Exquisite Collection</p>
            <h1 className="text-5xl md:text-6xl font-serif text-slate-800 mb-4 tracking-tight">Bracelets</h1>
            <div className="flex justify-center items-center gap-3 mt-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300"></div>
              <div className="flex gap-1.5">
                <span className="text-rose-400 text-xl">✦</span>
                <span className="text-rose-300 text-lg">✦</span>
                <span className="text-rose-400 text-xl">✦</span>
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300"></div>
            </div>
            <p className="text-slate-600 mt-6 max-w-2xl mx-auto text-lg">
              Discover our handcrafted silver bracelets, each piece designed to add elegance to your style
            </p>
          </div>

          <div className="flex flex-wrap -m-4 justify-center">
            {Object.keys(Bracelets).map((item) => {
              const product = Bracelets[item];
              const isInWishlist = product._id in wishlist;

              // Filter out falsy / empty string sizes and colors
              const sizes = Array.isArray(product.size) ? product.size.filter(s => s !== null && s !== undefined && String(s).trim() !== '') : [];
              const colors = Array.isArray(product.color) ? product.color.filter(c => c !== null && c !== undefined && String(c).trim() !== '') : [];

              return (
                <div 
                  key={product._id} 
                  className="lg:w-1/5 md:w-1/2 p-4 w-full cursor-pointer m-2 group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 relative">
                    {/* Sparkle Effects */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping z-30"></div>
                    <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-75 z-30"></div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-100/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>

                    {/* Wishlist Heart Icon */}
                    <button
                      onClick={(e) => handleWishlistToggle(product, e)}
                      className="absolute left-4 top-4 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-300 z-20 hover:scale-110 group/heart"
                      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isInWishlist ? (
                        <AiFillHeart className="text-rose-500 text-xl animate-pulse" />
                      ) : (
                        <AiOutlineHeart className="text-slate-600 group-hover/heart:text-rose-500 text-xl transition-colors" />
                      )}
                    </button>

                    {/* Product Image */}
                    <Link href={`/product/${product.slug}`}>
                      <div className="relative h-72 bg-gradient-to-br from-slate-50 to-rose-50/50 overflow-hidden">
                        <img 
                          alt={product.title} 
                          className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110" 
                          src={product.img} 
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <Link href={`/product/${product.slug}`}>
                      <div className="p-5 bg-white relative">
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-3xl opacity-50"></div>
                        
                        <h3 className="text-rose-400 text-xs tracking-[0.2em] uppercase font-light mb-2">Bracelets</h3>
                        <h2 className="text-slate-800 font-serif font-semibold text-base mb-3 line-clamp-2 min-h-[48px] leading-relaxed group-hover:text-rose-600 transition-colors">
                          {product.title}
                        </h2>
                        <p className="text-slate-800 font-bold text-xl mb-4">₹{product.price}</p>
                        
                        {/* Size Options */}
                        {sizes.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Sizes</p>
                            <div className="flex flex-wrap gap-2">
                              {sizes.includes('Free') && (
                                <span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>Free</span>
                              )}
                              {sizes.includes('S') && (
                                <span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>S</span>
                              )}
                              {sizes.includes('M') && (
                                <span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>M</span>
                              )}
                              {sizes.includes('L') && (
                                <span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>L</span>
                              )}
                              {sizes.includes('XL') && (
                                <span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>XL</span>
                              )}
                              {sizes.includes('XXL') && (
                                <span className='border-2 border-rose-200 bg-rose-50 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium hover:border-rose-400 hover:bg-rose-100 transition-all'>XXL</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Color Options */}
                        {colors.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Colors</p>
                            <div className="flex flex-wrap gap-2 items-center">
                              {colors.includes('Silver') && (
                                <button className="border-2 border-slate-300 bg-slate-200 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Silver"></button>
                              )}
                              {colors.includes('Black') && (
                                <button className="border-2 border-slate-300 bg-black rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Black"></button>
                              )}
                              {colors.includes('Red') && (
                                <button className="border-2 border-slate-300 bg-red-600 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Red"></button>
                              )}
                              {colors.includes('Blue') && (
                                <button className="border-2 border-slate-300 bg-blue-500 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Blue"></button>
                              )}
                              {colors.includes('Navy Blue') && (
                                <button className="border-2 border-slate-300 bg-blue-950 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Navy Blue"></button>
                              )}
                              {colors.includes('Green') && (
                                <button className="border-2 border-slate-300 bg-green-600 rounded-full w-7 h-7 hover:scale-110 transition-transform shadow-sm hover:shadow-md" title="Green"></button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="flex gap-2 p-5 pt-0">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex-1 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] relative overflow-hidden group/btn"
                      >
                        <span className="relative z-10">Add to Cart</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </button>
                      <button
                        onClick={(e) => handleBuyNow(product, e)}
                        className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {Object.keys(Bracelets).length === 0 && (
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-2xl font-serif text-slate-800 mb-3">No Bracelets Available</h3>
                <p className="text-slate-600">Check back soon for new arrivals!</p>
              </div>
            </div>
          )}
        </div>
      </section>

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
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  let Bracelets = await Product.find({ category: 'bracelets' })
  let Bracelet = {}
  for (let item of Bracelets) {
    if (item.title in Bracelet) {
      if (!Bracelet[item.title].color.includes(item.color) && item.availableQty > 0) {
        Bracelet[item.title].color.push(item.color)
      }
      if (!Bracelet[item.title].size.includes(item.size) && item.availableQty > 0) {
        Bracelet[item.title].size.push(item.size)
      }
    }
    else {
      Bracelet[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        Bracelet[item.title].color = [item.color]
        Bracelet[item.title].size = [item.size]
      }
    }
  }

  return {
    props: { Bracelets: JSON.parse(JSON.stringify(Bracelet)) },
  }
}

export default Bracelets
