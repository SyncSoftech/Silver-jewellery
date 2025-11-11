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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Recently Viewed</h2>
          <p className="text-gray-500 mt-2">Products you've checked out</p>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max px-2">
            {recentlyViewed.map((item) => {
              const isInWishlist = item.itemCode in wishlist
              
              return (
                <div
                  key={item.itemCode}
                  className="w-64 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex-shrink-0"
                >
                  <Link href={`/product/${item.slug}`}>
                    <div className="relative group cursor-pointer">
                      {/* Wishlist Heart Icon */}
                      <button
                        onClick={(e) => handleWishlistToggle(item, e)}
                        className="absolute left-3 top-3 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md transition-all duration-200 z-10"
                        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {isInWishlist ? (
                          <AiFillHeart className="text-red-500 text-lg" />
                        ) : (
                          <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-lg" />
                        )}
                      </button>

                      <div className="relative h-64 bg-gray-100 rounded-t-lg overflow-hidden">
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-gray-800 font-semibold text-sm mb-2 line-clamp-2 min-h-[40px] hover:text-blue-600">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#CA7F60] font-bold text-lg">₹{item.price}</span>
                    </div>

                    {(item.size || item.variant) && (
                      <p className="text-xs text-gray-500 mb-3">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.variant && <span> | </span>}
                        {item.variant && <span>Color: {item.variant}</span>}
                      </p>
                    )}

                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      className="w-full bg-[#CA7F60] hover:bg-[#935338] text-white py-2 rounded-md text-sm font-medium transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentlyViewed