// pages/search.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CiSearch, CiShoppingCart } from 'react-icons/ci'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { BiFilterAlt, BiSortAlt2 } from 'react-icons/bi'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

export default function SearchPage({ addToCart, addToWishlist, wishlist = {} }) {
  const router = useRouter()
  const [results, setResults] = useState([])
  const [pagination, setPagination] = useState(null)
  const [filters, setFilters] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams(router.query)
        const response = await fetch(`/api/search?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }
        
        const data = await response.json()
        setResults(data.results || [])
        setPagination(data.pagination || null)
        setFilters(data.filters || null)
      } catch (err) {
        setError(err.message)
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (router.isReady) {
      fetchResults()
    }
  }, [router.query, router.isReady])

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(router.query)
    params.set('page', newPage)
    router.push(`/search?${params.toString()}`)
  }

  const isInWishlist = (productId) => {
    return wishlist && wishlist[productId]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-slate-700 mb-4"></div>
            <p className="text-slate-600 font-semibold">Searching...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center max-w-md mx-auto">
            <p className="text-red-600 font-semibold text-lg mb-2">Error Loading Results</p>
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={() => router.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <CiSearch className="text-3xl text-slate-600" />
            <h1 className="text-2xl font-bold text-slate-800">
              Search Results
            </h1>
          </div>
          
          {filters && (
            <div className="flex flex-wrap gap-2 text-sm">
              {filters.query && (
                <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium">
                  Query: <strong>{filters.query}</strong>
                </span>
              )}
              {filters.category && (
                <span className="bg-emerald-100 px-3 py-1 rounded-full text-emerald-700 font-medium">
                  Category: <strong>{filters.category}</strong>
                </span>
              )}
              {filters.priceRange.min && (
                <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 font-medium">
                  Min: <strong>₹{filters.priceRange.min}</strong>
                </span>
              )}
              {filters.priceRange.max && (
                <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 font-medium">
                  Max: <strong>₹{filters.priceRange.max}</strong>
                </span>
              )}
              {filters.inStock !== 'all' && (
                <span className="bg-purple-100 px-3 py-1 rounded-full text-purple-700 font-medium">
                  {filters.inStock === 'true' ? 'In Stock Only' : 'Out of Stock'}
                </span>
              )}
              <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-medium flex items-center gap-1">
                <BiSortAlt2 />
                Sort: <strong>{filters.sortBy}</strong> ({filters.order})
              </span>
            </div>
          )}
          
          {pagination && (
            <p className="text-slate-600 mt-4 font-medium">
              Found <strong>{pagination.totalResults}</strong> results
            </p>
          )}
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-slate-200">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <CiSearch className="text-5xl text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Results Found</h2>
            <p className="text-slate-600 mb-6">
              Try adjusting your search filters or search terms
            </p>
            <Link href="/">
              <button className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all duration-300 font-semibold">
                Back to Home
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {results.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group"
                >
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative h-64 bg-slate-100 overflow-hidden cursor-pointer">
                      <Image
                        src={product.img}
                        alt={product.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.availableQty === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-bold text-slate-800 text-lg mb-2 hover:text-slate-600 transition-colors cursor-pointer line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-500 text-sm mb-3 line-clamp-2">
                      {product.desc}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-slate-800">
                        ₹{product.price}
                      </span>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600 capitalize">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(
                          product.id,
                          1,
                          product.price,
                          product.title,
                          null,
                          null,
                          product.img
                        )}
                        disabled={product.availableQty === 0}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          product.availableQty === 0
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        <CiShoppingCart className="text-lg" />
                        Add to Cart
                      </button>
                      
                      <button
                        onClick={() =>
                          isInWishlist(product.id)
                            ? removeFromWishlist(product.id)
                            : addToWishlist(
                                product.id,
                                product.title,
                                product.price,
                                null,
                                null,
                                product.img
                              )
                        }
                        className="p-2 rounded-lg border-2 border-slate-200 hover:border-red-500 transition-all duration-300"
                      >
                        {isInWishlist(product.id) ? (
                          <AiFillHeart className="text-xl text-red-500" />
                        ) : (
                          <AiOutlineHeart className="text-xl text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      pagination.hasPrevPage
                        ? 'bg-slate-700 text-white hover:bg-slate-800'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <MdKeyboardArrowLeft className="text-xl" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">
                      Page <strong>{pagination.currentPage}</strong> of{' '}
                      <strong>{pagination.totalPages}</strong>
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      pagination.hasNextPage
                        ? 'bg-slate-700 text-white hover:bg-slate-800'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <MdKeyboardArrowRight className="text-xl" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}