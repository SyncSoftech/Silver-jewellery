// components/RecentlyViewed.js
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

const RecentlyViewed = ({ 
  recentlyViewed = [], 
  addToCart, 
  wishlist = {}, 
  addToWishlist, 
  removeFromWishlist 
}) => {
  
  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null
  }

  const handleAddToCart = (item, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (addToCart) {
      addToCart(item.itemCode, 1, item.price, item.name, item.size, item.variant, item.img)
    }
  }

  const handleWishlistToggle = (item, e) => {
    e.preventDefault()
    e.stopPropagation()
    const isInWishlist = item.itemCode in wishlist
    
    if (isInWishlist) {
      if (removeFromWishlist) {
        removeFromWishlist(item.itemCode)
      }
    } else {
      if (addToWishlist) {
        addToWishlist(item.itemCode, item.price, item.name, item.size, item.variant, item.img)
      }
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#CA7F60] via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              Recently Viewed
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#CA7F60] to-purple-400 mx-auto rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4 text-lg">Rediscover your favorites</p>
        </div>

        <div className="overflow-x-auto pb-6 scrollbar-hide">
          <div className="flex gap-6 min-w-max px-2">
            {recentlyViewed.map((item) => {
              const isInWishlist = item.itemCode in wishlist
              
              return (
                <div
                  key={item.itemCode}
                  className="w-80 flex-shrink-0 group"
                >
                  <Link href={`/product/${item.slug}`}>
                    <div className="relative cursor-pointer overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Wishlist Heart Icon */}
                      <button
                        onClick={(e) => handleWishlistToggle(item, e)}
                        className="absolute right-4 top-4 bg-white/95 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-md transition-all duration-300 z-20 hover:scale-110"
                        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {isInWishlist ? (
                          <AiFillHeart className="text-red-500 text-xl" />
                        ) : (
                          <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-xl" />
                        )}
                      </button>

                      {/* Main Image Container */}
                      <div className="relative h-80 bg-white overflow-hidden">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Elegant Gradient Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Product Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-gray-800 font-bold text-lg mb-2 line-clamp-2">
                            {item.name}
                          </h3>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[#CA7F60] font-bold text-2xl">₹{item.price}</span>
                            {(item.size || item.variant) && (
                              <div className="text-xs text-gray-600 bg-pink-100/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                {item.size && <span>{item.size}</span>}
                                {item.size && item.variant && <span> · </span>}
                                {item.variant && <span>{item.variant}</span>}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(item, e)}
                            className="w-full bg-gradient-to-r from-[#CA7F60] to-pink-400 hover:from-pink-400 hover:to-[#CA7F60] text-white py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Bottom Info Bar */}
                  <div className="mt-4 px-2">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-gray-800 font-semibold text-sm mb-1 line-clamp-1 hover:text-[#CA7F60] transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-xs">Starting at ₹{item.price}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

export default RecentlyViewed