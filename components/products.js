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
    <section className="py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-sm tracking-[3px] text-gray-600">NEW PRODUCTS</h2>
        <div className="flex justify-center mt-2 space-x-2 text-yellow-500 text-xl">
          <span>★</span><span>★</span><span>★</span>
        </div>
      </div>

      {/* Updated Grid: Fixed 4 cards per row on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {products.map((product, i) => {
          const isInWishlist = product._id in wishlist;
          
          return (
            <div
              key={i}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-72 bg-gray-100 group">
                {product.sale && (
                  <span className="absolute right-3 top-3 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full uppercase z-10">
                    Sale
                  </span>
                )}
                
                {/* Wishlist Heart Icon */}
                <button
                  onClick={(e) => handleWishlistToggle(product, e)}
                  className="absolute left-3 top-3 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all duration-200 z-10"
                  title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isInWishlist ? (
                    <AiFillHeart className="text-red-500 text-xl" />
                  ) : (
                    <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-xl" />
                  )}
                </button>

                <Image
                  src={product.img}
                  alt={product.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-2 min-h-[40px]">
                  {product.title}
                </h3>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#CA7F60] font-bold text-base">${product.price}</span>
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-xs">${product.oldPrice}</span>
                    )}
                  </div>

                  {/* Enhanced Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-1/2 bg-[#CA7F60] hover:bg-[#935338] text-white py-2 rounded-md text-sm font-medium transition-all"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(product, e)}
                      className="w-1/2 bg-black hover:bg-gray-800 text-white py-2 rounded-md text-sm font-medium transition-all"
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
    </section>
  );
}