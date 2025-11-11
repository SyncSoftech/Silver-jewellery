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

import React from 'react'
import Link from 'next/link'
import Product from "@/models/Product"
import mongoose from "mongoose";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";




const Rings = ({ Products, addToCart, buyNow, wishlist = {}, addToWishlist, removeFromWishlist }) => {

  const handleAddToCart = (Products, e) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart(Products._id, 1, Products.price, Products.title, Products.size || 'M', Products.variant || 'Default', Products.img);
    }
  };

  const handleBuyNow = (Products, e) => {
    e.stopPropagation();
    if (buyNow) {
      buyNow(Products._id, 1, Products.price, Products.title, Products.size || 'M', Products.variant || 'Default', Products.img);
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
    <div className='min-h-screen ' style={{
      background: 'radial-gradient(circle, #FFF2Ef,#E0CAC5)',
    }} >
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4 justify-center">

            {Object.keys(Products).map((item) => {
              const isInWishlist = Products[item]._id in wishlist;

              return <div passHref={true} key={Products[item]._id} className="lg:w-1/5 md:w-1/2 p-2 w-full cursor-pointer shadow-lg m-5 bg-white overflow-hidden relative" >
                
                {/* Wishlist Heart Icon */}
                <button
                  onClick={(e) => handleWishlistToggle(Products[item], e)}
                  className="absolute left-3 top-3 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all duration-200 z-10"
                  title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isInWishlist ? (
                    <AiFillHeart className="text-red-500 text-xl" />
                  ) : (
                    <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-xl" />
                  )}
                </button>

                <Link href={`/product/${Products[item].slug}`}>
                  <span className="block relative rounded overflow-hidden " >
                    <img alt="ecommerce" className="object-cover " src={Products[item].img} />
                  </span>
                </Link>
                <Link href={`/product/${Products[item].slug}`}>
                  <div className="mt-4 text-left p-2 ">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Rings</h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium mb-2">{Products[item].title}</h2>
                    <p className="mt-1 font-semibold text-gray-900">₹{Products[item].price}</p>
                    <div className="mt-3">
                      {Products[item].size.includes('Free') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>Free</span>}
                      {Products[item].size.includes('S') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>S</span>}
                      {Products[item].size.includes('M') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>M</span>}
                      {Products[item].size.includes('L') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>L</span>}
                      {Products[item].size.includes('XL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XL</span>}
                      {Products[item].size.includes('XXL') && <span className='border border-gray-400 bg-white px-3 py-1 mx-1 rounded text-sm'>XXL</span>}
                    </div>
                    <div className="mt-3 flex items-center">
                      {Products[item].color.includes('Silver') && <button className="border-2 border-gray-400 ml-1 bg-gray-300 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Black') && <button className="border-2 border-gray-400 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Red') && <button className="border-2 border-gray-400 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-600 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Navy Blue') && <button className="border-2 border-gray-400 ml-1 bg-blue-950 rounded-full w-6 h-6 focus:outline-none"></button>}
                      {Products[item].color.includes('Green') && <button className="border-2 border-gray-400 ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>}
                    </div>
                  </div>
                </Link>
                <div className="flex gap-2 p-2">
                  <button
                    onClick={(e) => handleAddToCart(Products[item], e)}
                    className="w-1/2 bg-[#CA7F60] hover:bg-[#935338] text-white  py-2 rounded-md text-sm font-medium transition-all"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={(e) => handleBuyNow(Products[item], e)}
                    className="w-1/2 bg-black hover:bg-gray-800 text-white py-2 rounded-md text-sm font-medium transition-all"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            })}

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