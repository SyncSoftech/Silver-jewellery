// import React from 'react'
// import Link from 'next/link'
// import Product from "@/models/Product"
// import mongoose from "mongoose";




// const Rings = ({ Products ,addToCart,buyNow}) => {

//   const handleAddToCart = (Products, e) => {
//     e.stopPropagation();
//     if (addToCart) {
//       addToCart(Products._id, 1, Products.price, Products.title, Products.size || 'M', Products.variant || 'Default', Products.img);
//     }
//   };

//   const handleBuyNow = (Products, e) => {
//     e.stopPropagation();
//     if (buyNow) {
//       buyNow(Products._id, 1, Products.price, Products.title, Products.size || 'M', Products.variant || 'Default', Products.img);
//     }
//   };
//   return (
//      <div className='min-h-screen ' style={{
//     background: 'radial-gradient(circle, #FFF2Ef,#E0CAC5)',
//   }} >
//       <section className="text-gray-600 body-font">
//         <div className="container px-5 py-24 mx-auto">
//           <div className="flex flex-wrap -m-4 justify-center">

//             {Object.keys(Products).map((item) => {

//               return <div passHref={true} key={Products[item]._id} className="lg:w-1/5 md:w-1/2 p-2 w-full cursor-pointer shadow-lg m-5 bg-white overflow-hidden" >
//                 <Link href={`/product/${Products[item].slug}`}>
//                   <span className="block relative rounded overflow-hidden " >
//                     <img alt="ecommerce" className="object-cover " src={Products[item].img} />
//                   </span>
//                 </Link>
//                 <Link href={`/product/${Products[item].slug}`}>
//                   <div className="mt-4 text-left p-2 ">
//                     <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Rings</h3>
//                     <h2 className="text-gray-900 title-font text-lg font-medium mb-2">{Products[item].title}</h2>
//                     <p className="mt-1 font-semibold text-gray-900">₹{Products[item].price}</p>
//                     <div className="mt-3">
//                       {Products[item].size.includes('Free') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>Free</span>}
//                       {Products[item].size.includes('S') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>S</span>}
//                       {Products[item].size.includes('M') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>M</span>}
//                       {Products[item].size.includes('L') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>L</span>}
//                       {Products[item].size.includes('XL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XL</span>}
//                       {Products[item].size.includes('XXL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XXL</span>}
//                     </div>
//                     <div className="mt-3 flex items-center">
//                       {Products[item].color.includes('Silver') && <button className="border-2 border-gray-400 ml-1 bg-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Black') && <button className="border-2 border-gray-400 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Red') && <button className="border-2 border-gray-400 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-600 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Navy Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-950 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Green') && <button className="border-2 border-gray-400 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>}
//                     </div>
//                   </div>
//                 </Link>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={(e) => handleAddToCart(Products[item], e)}
//                     className="w-1/2 bg-[#CA7F60] hover:bg-[#935338] text-white  py-2 rounded-md text-sm font-medium transition-all"
//                   >
//                     Add to Cart
//                   </button>
//                   <button
//                     onClick={(e) => handleBuyNow(Products[item], e)}
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
//   let Products = await Product.find({ category: 'Rings' })
//   let Rings = {}
//   for (let item of Products) {
//     if (item.title in Rings) {
//       if (!Rings[item.title].color.includes(item.color) && item.availableQty > 0) {
//         Rings[item.title].color.push(item.color)
//       }
//       if (!Rings[item.title].size.includes(item.size) && item.availableQty > 0) {
//         Rings[item.title].size.push(item.size)
//       }
//     }
//     else {
//       Rings[item.title] = JSON.parse(JSON.stringify(item))
//       if (item.availableQty > 0) {
//         Rings[item.title].color = [item.color]
//         Rings[item.title].size = [item.size]
//       }
//     }
//   }

//   return {
//     props: { Products: JSON.parse(JSON.stringify(Rings)) }, // will be passed to the page component as props
//   }
// }

// export default Rings

// import React from 'react'
// import Link from 'next/link'
// import Product from "@/models/Product"
// import mongoose from "mongoose";
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";




// const Rings = ({ Products, addToCart, buyNow, wishlist = {}, addToWishlist, removeFromWishlist }) => {

//   const handleAddToCart = (Products, e) => {
//     e.stopPropagation();
//     if (addToCart) {
//       addToCart(Products._id, 1, Products.price, Products.title, Products.size || 'M', Products.variant || 'Default', Products.img);
//     }
//   };

//   const handleBuyNow = (Products, e) => {
//     e.stopPropagation();
//     if (buyNow) {
//       buyNow(Products._id, 1, Products.price, Products.title, Products.size || 'M', Products.variant || 'Default', Products.img);
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

//             {Object.keys(Products).map((item) => {
//               const isInWishlist = Products[item]._id in wishlist;

//               return <div passHref={true} key={Products[item]._id} className="lg:w-1/5 md:w-1/2 p-2 w-full cursor-pointer shadow-lg m-5 bg-white overflow-hidden relative" >
                
//                 {/* Wishlist Heart Icon */}
//                 <button
//                   onClick={(e) => handleWishlistToggle(Products[item], e)}
//                   className="absolute left-3 top-3 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all duration-200 z-10"
//                   title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   {isInWishlist ? (
//                     <AiFillHeart className="text-red-500 text-xl" />
//                   ) : (
//                     <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-xl" />
//                   )}
//                 </button>

//                 <Link href={`/product/${Products[item].slug}`}>
//                   <span className="block relative rounded overflow-hidden " >
//                     <img alt="ecommerce" className="object-cover " src={Products[item].img} />
//                   </span>
//                 </Link>
//                 <Link href={`/product/${Products[item].slug}`}>
//                   <div className="mt-4 text-left p-2 ">
//                     <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Rings</h3>
//                     <h2 className="text-gray-900 title-font text-lg font-medium mb-2">{Products[item].title}</h2>
//                     <p className="mt-1 font-semibold text-gray-900">₹{Products[item].price}</p>
//                     <div className="mt-3">
//                       {Products[item].size.includes('Free') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>Free</span>}
//                       {Products[item].size.includes('S') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>S</span>}
//                       {Products[item].size.includes('M') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>M</span>}
//                       {Products[item].size.includes('L') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>L</span>}
//                       {Products[item].size.includes('XL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XL</span>}
//                       {Products[item].size.includes('XXL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XXL</span>}
//                     </div>
//                     <div className="mt-3 flex items-center">
//                       {Products[item].color.includes('Silver') && <button className="border-2 border-gray-400 ml-1 bg-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Black') && <button className="border-2 border-gray-400 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Red') && <button className="border-2 border-gray-400 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-600 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Navy Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-950 rounded-full w-6 h-6 focus:outline-none"></button>}
//                       {Products[item].color.includes('Green') && <button className="border-2 border-gray-400 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>}
//                     </div>
//                   </div>
//                 </Link>
//                 <div className="flex gap-2 p-2">
//                   <button
//                     onClick={(e) => handleAddToCart(Products[item], e)}
//                     className="w-1/2 bg-[#CA7F60] hover:bg-[#935338] text-white  py-2 rounded-md text-sm font-medium transition-all"
//                   >
//                     Add to Cart
//                   </button>
//                   <button
//                     onClick={(e) => handleBuyNow(Products[item], e)}
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
//   let Products = await Product.find({ category: 'Rings' })
//   let Rings = {}
//   for (let item of Products) {
//     if (item.title in Rings) {
//       if (!Rings[item.title].color.includes(item.color) && item.availableQty > 0) {
//         Rings[item.title].color.push(item.color)
//       }
//       if (!Rings[item.title].size.includes(item.size) && item.availableQty > 0) {
//         Rings[item.title].size.push(item.size)
//       }
//     }
//     else {
//       Rings[item.title] = JSON.parse(JSON.stringify(item))
//       if (item.availableQty > 0) {
//         Rings[item.title].color = [item.color]
//         Rings[item.title].size = [item.size]
//       }
//     }
//   }

//   return {
//     props: { Products: JSON.parse(JSON.stringify(Rings)) },
//   }
// }

// export default Rings

import React from 'react'
import Link from 'next/link'
import Product from "@/models/Product"
import mongoose from "mongoose";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const Rings = ({ Products, addToCart, buyNow, wishlist = {}, addToWishlist, removeFromWishlist }) => {
  const productMap = Products || {};

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      addToCart(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
    }
  };

  const handleBuyNow = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (buyNow) {
      buyNow(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
    }
  };

  const handleWishlistToggle = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    const isInWishlist = product._id in wishlist;
    if (isInWishlist) {
      if (removeFromWishlist) removeFromWishlist(product._id);
    } else {
      if (addToWishlist) addToWishlist(product._id, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
    }
  };

  return (
    <div className='min-h-screen  relative overflow-hidden' style={{
      background: 'radial-gradient(circle, #FFF2Ef,#E0CAC5)',
    }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full filter blur-3xl opacity-10 animate-pulse delay-500"></div>

      <section className="text-gray-600 body-font relative z-10">
        <div className="container px-5 py-20 mx-auto">
          {/* Page Header (unchanged) */}
          <div className="text-center mb-16">
            <p className="text-rose-400 text-sm tracking-[0.3em] font-light mb-3 uppercase">Exquisite Collection</p>
            <h1 className="text-5xl md:text-6xl font-serif text-slate-800 mb-4 tracking-tight">Earrings</h1>
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
              Discover our handcrafted silver earrings, each piece designed to add elegance to your style
            </p>
          </div>

          {/* Grid / list of products */}
          <div className="flex flex-wrap -m-4 justify-center">
            {Object.keys(productMap).map((key) => {
              const product = productMap[key];
              if (!product) return null;

              const sizes = Array.isArray(product.size) ? product.size.filter(s => s !== null && s !== undefined && String(s).trim() !== '') : [];
              const colors = Array.isArray(product.color) ? product.color.filter(c => c !== null && c !== undefined && String(c).trim() !== '') : [];

              const isInWishlist = product._id in wishlist;

              return (
                <div
                  key={product._id || key}
                 className="lg:w-1/5 md:w-1/2 w-1/2 p-2 sm:p-4 cursor-pointer"
                >
                  {/* Card is NOT wrapped by Link anymore */}
                  <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 flex flex-col transform hover:-translate-y-2 cursor-pointer border border-gray-100">
                    
                    {/* Image area: Link only wraps the image */}
                    <div className="relative w-full aspect-square bg-white overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                      {product.sale && (
                        <span className="absolute right-3 top-3 bg-rose-500 text-white text-xs px-3 py-1.5 rounded-full uppercase font-semibold z-20 shadow-md">
                          Sale
                        </span>
                      )}

                      {/* Wishlist Heart - keep as button (not inside Link) */}
                      <button
                        type="button"
                        onClick={(e) => handleWishlistToggle(product, e)}
                        className="absolute left-3 top-3 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-300 z-20 hover:scale-110"
                        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {isInWishlist ? (
                          <AiFillHeart className="text-rose-500 text-xl animate-pulse" />
                        ) : (
                          <AiOutlineHeart className="text-slate-600 text-xl transition-colors group-hover:text-rose-500" />
                        )}
                      </button>

                      {/* Link only for the image */}
                      <Link href={`/product/${product.slug}`} className="block absolute inset-0">
                        <img
                          alt={product.title}
                          src={product.img}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>

                      {/* Hover overlay actions — but buttons are outside Link so clicks won't navigate */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(product, e)}
                            className="flex-1 bg-white backdrop-blur-sm hover:bg-rose-50 text-gray-800 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
                          >
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleBuyNow(product, e)}
                            className="flex-1 bg-white hover:bg-rose-500 hover:text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Product Info — wrap the title (or part of info) with Link, keep other metadata outside */}
                    <div className="p-4 flex flex-col flex-grow bg-white relative">
                      <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-3xl opacity-40 pointer-events-none"></div>

                      <h3 className="text-rose-400 text-xs tracking-[0.2em] uppercase font-light mb-2">RINGS</h3>

                      {/* Only the title links to the product page */}
                      <Link href={`/product/${product.slug}`} className="group">
                        <h2 className="text-slate-800 font-serif sm:text-xs sm:font-light lg:text-base lg:font-semibold line-clamp-2 min-h-[48px] leading-relaxed group-hover:text-rose-600 transition-colors">
                          {product.title}
                        </h2>
                      </Link>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-slate-800 font-bold text-xl">₹{product.price}</span>
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
                        {Array.isArray(product.size) && product.size.filter(Boolean).length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Sizes</p>
                            <div className="flex flex-wrap gap-2">
                              {product.size.includes('Free') && (<span className='...'>Free</span>)}
                              {product.size.includes('S') && (<span className='...'>S</span>)}
                              {product.size.includes('M') && (<span className='...'>M</span>)}
                              {product.size.includes('L') && (<span className='...'>L</span>)}
                              {product.size.includes('XL') && (<span className='...'>XL</span>)}
                              {product.size.includes('XXL') && (<span className='...'>XXL</span>)}
                            </div>
                          </div>
                        )}

                        {/* Colors (same logic) */}
                        {Array.isArray(product.color) && product.color.filter(Boolean).length > 0 && (
                          <div className="mb-1">
                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Available Colors</p>
                            <div className="flex flex-wrap gap-2 items-center">
                              {product.color.includes('Silver') && (<button className="..." title="Silver"></button>)}
                              {product.color.includes('Black') && (<button className="..." title="Black"></button>)}
                              {product.color.includes('Red') && (<button className="..." title="Red"></button>)}
                              {product.color.includes('Blue') && (<button className="..." title="Blue"></button>)}
                              {product.color.includes('Navy Blue') && (<button className="..." title="Navy Blue"></button>)}
                              {product.color.includes('Green') && (<button className="..." title="Green"></button>)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state (unchanged) */}
          {Object.keys(productMap).length === 0 && (
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

      
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  let Products = await Product.find({ category: 'Rings' })
  let Rings = {}
  for (let item of Products) {
    if (item.title in Rings) {
      if (!Rings[item.title].color.includes(item.color) && item.availableQty > 0) {
        Rings[item.title].color.push(item.color)
      }
      if (!Rings[item.title].size.includes(item.size) && item.availableQty > 0) {
        Rings[item.title].size.push(item.size)
      }
    }
    else {
      Rings[item.title] = JSON.parse(JSON.stringify(item))
      if (item.availableQty > 0) {
        Rings[item.title].color = [item.color]
        Rings[item.title].size = [item.size]
      }
    }
  }

  return {
    props: { Products: JSON.parse(JSON.stringify(Rings)) },
  }
}

export default Rings
