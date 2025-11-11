// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";

// export default function NewProducts({ addToCart, buyNow }) {
//   const [products, setProducts] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const response = await fetch("/api/getproducts");
//       const data = await response.json();
//       setProducts(Object.values(data.allProducts || {}));
//     };
//     fetchProducts();
//   }, []);

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

//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="text-center mb-12">
//         <h2 className="text-sm tracking-[3px] text-gray-600">NEW PRODUCTS</h2>
//         <div className="flex justify-center mt-2 space-x-2 text-yellow-500 text-xl">
//           <span>★</span><span>★</span><span>★</span>
//         </div>
//       </div>

//       {/* Updated Grid: Fixed 4 cards per row on large screens */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
//         {products.map((product, i) => (
//           <div
//             key={i}
//             className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
//           >
//             {/* Image Container */}
//             <div className="relative w-full h-72 bg-gray-100 group">
//               {product.sale && (
//                 <span className="absolute right-3 top-3 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full uppercase z-10">
//                   Sale
//                 </span>
//               )}
//               <Image
//                 src={product.img}
//                 alt={product.title}
//                 fill
//                 className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
//               />
//             </div>

//             {/* Product Info */}
//             <div className="p-4 flex flex-col flex-grow">
//               <h3 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-2 min-h-[40px]">
//                 {product.title}
//               </h3>
//               <div className="mt-auto">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-[#CA7F60] font-bold text-base">${product.price}</span>
//                   {product.oldPrice && (
//                     <span className="text-gray-400 line-through text-xs">${product.oldPrice}</span>
//                   )}
//                 </div>

//                 {/* Enhanced Buttons */}
//                 <div className="flex gap-2">
//                   <button
//                     onClick={(e) => handleAddToCart(product, e)}
//                     className="w-1/2 bg-[#CA7F60] hover:bg-[#935338] text-white  py-2 rounded-md text-sm font-medium transition-all"
//                   >
//                     Add to Cart
//                   </button>
//                   <button
//                     onClick={(e) => handleBuyNow(product, e)}
//                     className="w-1/2 bg-black hover:bg-gray-800 text-white py-2 rounded-md text-sm font-medium transition-all"
//                   >
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// // }

// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

// export default function NewProducts({ 
//   addToCart, 
//   buyNow, 
//   wishlist = {}, 
//   addToWishlist, 
//   removeFromWishlist 
// }) {
//   const [products, setProducts] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const response = await fetch("/api/getproducts");
//       const data = await response.json();
//       setProducts(Object.values(data.allProducts || {}));
//     };
//     fetchProducts();
//   }, []);

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
//     <section className="py-16 bg-gray-50">
//       <div className="text-center mb-12">
//         <h2 className="text-sm tracking-[3px] text-gray-600">NEW PRODUCTS</h2>
//         <div className="flex justify-center mt-2 space-x-2 text-yellow-500 text-xl">
//           <span>★</span><span>★</span><span>★</span>
//         </div>
//       </div>

//       {/* Updated Grid: Fixed 4 cards per row on large screens */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
//         {products.map((product, i) => {
//           const isInWishlist = product._id in wishlist;
          
//           return (
//             <div
//               key={i}
//               className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
//             >
//               {/* Image Container */}
//               <div className="relative w-full h-72 bg-gray-100 group">
//                 {product.sale && (
//                   <span className="absolute right-3 top-3 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full uppercase z-10">
//                     Sale
//                   </span>
//                 )}
                
//                 {/* Wishlist Heart Icon */}
//                 <button
//                   onClick={(e) => handleWishlistToggle(product, e)}
//                   className="absolute left-3 top-3 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all duration-200 z-10"
//                   title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   {isInWishlist ? (
//                     <AiFillHeart className="text-red-500 text-xl" />
//                   ) : (
//                     <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-xl" />
//                   )}
//                 </button>

//                 <Image
//                   src={product.img}
//                   alt={product.title}
//                   fill
//                   className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
//                 />
//               </div>

//               {/* Product Info */}
//               <div className="p-4 flex flex-col flex-grow">
//                 <h3 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-2 min-h-[40px]">
//                   {product.title}
//                 </h3>
//                 <div className="mt-auto">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-[#CA7F60] font-bold text-base">${product.price}</span>
//                     {product.oldPrice && (
//                       <span className="text-gray-400 line-through text-xs">${product.oldPrice}</span>
//                     )}
//                   </div>

//                   {/* Enhanced Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={(e) => handleAddToCart(product, e)}
//                       className="w-1/2 bg-[#CA7F60] hover:bg-[#935338] text-white py-2 rounded-md text-sm font-medium transition-all"
//                     >
//                       Add to Cart
//                     </button>
//                     <button
//                       onClick={(e) => handleBuyNow(product, e)}
//                       className="w-1/2 bg-black hover:bg-gray-800 text-white py-2 rounded-md text-sm font-medium transition-all"
//                     >
//                       Buy Now
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }



import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

export default function NewProducts({ 
  addToCart, 
  buyNow, 
  wishlist = {}, 
  addToWishlist, 
  removeFromWishlist 
}) {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/getproducts");
      const data = await response.json();
      setProducts(Object.values(data.allProducts || {}));
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
    }
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    if (buyNow) {
      buyNow(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);
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
    <section className="py-20 bg-gradient-to-b from-white via-rose-50/20 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20"></div>
      
      <div className="text-center mb-16 relative z-10">
        <p className="text-rose-400 text-sm tracking-[0.3em] font-light mb-3 uppercase">Latest Arrivals</p>
        <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-4 tracking-tight">New Products</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 relative z-10">
        {products.map((product, i) => {
          const isInWishlist = product._id in wishlist;
          
          return (
            <div
              key={i}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 flex flex-col transform hover:-translate-y-2"
            >
              {/* Sparkle effect on hover */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping z-30"></div>
              <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-75 z-30"></div>
              
              {/* Image Container */}
              <div className="relative w-full h-80 bg-gradient-to-br from-slate-50 to-rose-50/50 overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-rose-100/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                
                {product.sale && (
                  <span className="absolute right-4 top-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full uppercase font-semibold z-20 shadow-lg animate-pulse">
                    Sale
                  </span>
                )}
                
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

                <Image
                  src={product.img}
                  alt={product.title}
                  fill
                  className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow bg-white relative">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-3xl opacity-50"></div>
                
                <h3 className="text-slate-800 font-serif font-semibold text-base mb-2 line-clamp-2 min-h-[48px] leading-relaxed group-hover:text-rose-600 transition-colors">
                  {product.title}
                </h3>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-slate-800 font-bold text-xl">₹{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-slate-400 line-through text-sm">₹{product.oldPrice}</span>
                      )}
                    </div>
                    {product.oldPrice && (
                      <span className="text-rose-500 text-xs font-semibold bg-rose-50 px-2 py-1 rounded-full">
                        Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Enhanced Buttons */}
                  <div className="flex gap-2">
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
            </div>
          );
        })}
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
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}