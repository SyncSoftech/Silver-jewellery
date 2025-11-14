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


// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
// import Link from "next/link";

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
//     <section className="py-10  relative overflow-hidden" style={{
//       background: 'radial-gradient(circle, #FFF2Ef,#E0CAC5)',
//     }}>
//       {/* Minimal Decorative Elements */}
//       <div className="absolute top-20 right-10 w-64 h-64 bg-pink-100/30 rounded-full filter blur-3xl"></div>
//       <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-100/30 rounded-full filter blur-3xl"></div>
      
//       <div className="text-center mb-16 relative z-10">
//         <p className="text-gray-500 text-sm tracking-[0.3em] font-light mb-3 uppercase">Latest Arrivals</p>
//         <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4 tracking-tight">New Products</h2>
//         <div className="flex justify-center items-center gap-3 mt-4">
//           <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300"></div>
//           <div className="w-2 h-2 bg-[#CA7F60] rounded-full"></div>
//           <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300"></div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-8 max-w-7xl mx-auto px-2 lg:px-6 relative z-10">
//         {products.map((product, i) => {
//           const isInWishlist = product._id in wishlist;
          
//           return (
//             <div
//               key={i}
              
//               className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 flex flex-col transform hover:-translate-y-2 cursor-pointer border border-gray-100"
//             ><Link href={`/product/${product.slug}`}>
//               {/* Image Container - Perfect Square */}
//               <div className="relative w-full aspect-square bg-white overflow-hidden">
//                 {/* Subtle overlay on hover */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                
//                 {product.sale && (
//                   <span className="absolute right-3 top-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full uppercase font-semibold z-20 shadow-md">
//                     Sale
//                   </span>
//                 )}
                
//                 {/* Wishlist Heart Icon */}
//                 <button
//                   onClick={(e) => handleWishlistToggle(product, e)}
//                   className="absolute left-3 top-3 bg-white backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-300 z-20 hover:scale-110 group/heart"
//                   title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   {isInWishlist ? (
//                     <AiFillHeart className="text-red-500 text-xl" />
//                   ) : (
//                     <AiOutlineHeart className="text-gray-600 group-hover/heart:text-red-500 text-xl transition-colors" />
//                   )}
//                 </button>

//                 <Image
//                   src={product.img}
//                   alt={product.title}
//                   fill
//                   className="object-cover group-hover:scale-105 transition-transform duration-700"
//                 />
                
//                 {/* Overlay Content - Appears on Hover */}
//                 <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={(e) => handleAddToCart(product, e)}
//                       className="flex-1 bg-white backdrop-blur-sm hover:bg-[#EEDDD9] text-gray-800 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
//                     >
//                       Add to Cart
//                     </button>
//                     <button
//                       onClick={(e) => handleBuyNow(product, e)}
//                       className="flex-1 bg-white hover:bg-black hover:text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
//                     >
//                       Buy Now
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="p-4 flex flex-col flex-grow bg-white">
//                 <h3 className="text-gray-800 font-semibold text-sm mb-2 line-clamp-2 min-h-[40px] leading-relaxed group-hover:text-[#CA7F60] transition-colors">
//                   {product.title}
//                 </h3>
                
//                 <div className="mt-auto">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-baseline gap-2">
//                       <span className="text-gray-800 font-bold text-lg">₹{product.price}</span>
//                       {product.oldPrice && (
//                         <span className="text-gray-400 line-through text-xs">₹{product.oldPrice}</span>
//                       )}
//                     </div>
//                     {product.oldPrice && (
//                       <span className="text-red-500 text-xs font-semibold">
//                         {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </Link>
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
import Link from "next/link";

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
    // If you still want to call buyNow logic, uncomment next line:
    // if (buyNow) buyNow(product._id, 1, product.price, product.title, product.size || 'M', product.variant || 'Default', product.img);

    // Navigate to product page (slug)
    if (product && product.slug) {
      router.push(`/product/${product.slug}`);
    } else {
      console.warn("Product slug missing for", product);
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
    <section className="py-10  relative overflow-hidden" style={{
      background: 'radial-gradient(circle, #FFF2Ef,#DBC4BF)',
    }}>
      {/* Minimal Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-pink-100/30 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-100/30 rounded-full filter blur-3xl"></div>
      
      <div className="text-center mb-16 relative z-10">
        <p className="text-gray-500 text-sm tracking-[0.3em] font-light mb-3 uppercase">Latest Arrivals</p>
        <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4 tracking-tight">New Products</h2>
        <div className="flex justify-center items-center gap-3 mt-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300"></div>
          <div className="w-2 h-2 bg-[#CA7F60] rounded-full"></div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-8 max-w-7xl mx-auto px-2 lg:px-6 relative z-10">
        {products.map((product, i) => {
          const isInWishlist = product._id in wishlist;
          
          return (
            <div
              key={i}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 flex flex-col transform hover:-translate-y-2  border border-gray-100"
            >
              
                {/* Image Container - Perfect Square */}
                <div className="relative w-full aspect-square bg-white overflow-hidden">
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  
                  {product.sale && (
                    <span className="absolute right-3 top-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full uppercase font-semibold z-20 shadow-md">
                      Sale
                    </span>
                  )}
                  
                  {/* Wishlist Heart Icon */}
                  <button
                    onClick={(e) => handleWishlistToggle(product, e)}
                    className="absolute left-3 top-3 bg-white backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-md transition-all duration-300 z-20 hover:scale-110 group/heart"
                    title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isInWishlist ? (
                      <AiFillHeart className="text-red-500 text-xl" />
                    ) : (
                      <AiOutlineHeart className="text-gray-600 group-hover/heart:text-red-500 text-xl transition-colors" />
                    )}
                  </button>

                  <Image
                    src={product.img}
                    alt={product.title}
                    fill
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Overlay Content - Appears on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex-1 bg-white backdrop-blur-sm hover:bg-[#EEDDD9] text-gray-800 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => handleBuyNow(product, e)}
                        className="flex-1 bg-white hover:bg-black hover:text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-md"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <Link href={`/product/${product.slug}`}><div className="p-4 flex flex-col flex-grow bg-white">
                  <h3 className="text-gray-800 font-semibold text-sm mb-2 line-clamp-2 min-h-[40px] leading-relaxed group-hover:text-[#CA7F60] transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-800 font-bold text-lg">₹{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-gray-400 line-through text-xs">₹{product.oldPrice}</span>
                        )}
                      </div>
                      {product.oldPrice && (
                        <span className="text-red-500 text-xs font-semibold">
                          {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div></Link>
              
            </div>
          );
        })}
      </div>
    </section>
  );
}