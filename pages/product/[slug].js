

// pages/product/[slug].js
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import mongoose from 'mongoose'
import Product from '@/models/Product'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";

const Post = ({ buyNow, addToCart, product, variants, wishlist = {}, addToWishlist, removeFromWishlist, addToRecentlyViewed }) => {
  console.log(product, variants)
  const router = useRouter()
  const { slug } = router.query
  const [pin, setpin] = useState()
  const [service, setservice] = useState()

  // Add product to recently viewed when component mounts
  useEffect(() => {
    if (product && addToRecentlyViewed) {
      addToRecentlyViewed(
        product._id,
        product.price,
        product.title,
        product.size,
        product.color,
        product.img,
        product.slug
      )
    }
  }, [product])

  const chackServiceability = async () => {
    let pins = await fetch(`${process.env.HOST}/api/pincode`)
    let pinJson = await pins.json()
    if (pinJson.includes(parseInt(pin))) {
      setservice(true)
      toast.success('Your pincode is serviceable!', {
        position: "bottom-center",
        autoClose: 1000,
      });
    }
    else {
      setservice(false)
      toast.error('Sorry, your pincode is not serviceable!', {
        position: "bottom-center",
        autoClose: 1000,
      });
    }
  }

  const onChangePin = (e) => {
    setpin(e.target.value)
  }

  const [color, setColor] = useState(product.color)
  const [size, setSize] = useState(product.size)

  const refreshVarient = (newsize, newcolor) => {
    let url = `${process.env.NEXT_PUBLIC_HOST}/product/${variants[newcolor][newsize]['slug']}`
    window.location = url;
  }

  const handleWishlistToggle = () => {
    const isInWishlist = product._id in wishlist;
    
    if (isInWishlist) {
      if (removeFromWishlist) {
        removeFromWishlist(product._id);
        toast.info('Removed from wishlist', {
          position: "bottom-center",
          autoClose: 1000,
        });
      }
    } else {
      if (addToWishlist) {
        addToWishlist(product._id, product.price, product.title, product.size, product.color, product.img);
        toast.success('Added to wishlist!', {
          position: "bottom-center",
          autoClose: 1000,
        });
      }
    }
  };

  const isInWishlist = product._id in wishlist;

  // Share handler: use Web Share API if available, otherwise copy link to clipboard
  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this product: ${product.title} (${product.size}/${product.color})`,
      url: typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_HOST}/product/${slug}`
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        // No toast usually necessary, but nice to confirm
        toast.success('Thanks for sharing!', { position: 'bottom-center', autoClose: 1000 })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url)
        toast.success('Product link copied to clipboard!', { position: 'bottom-center', autoClose: 1000 })
      } else {
        // Fallback: prompt with the URL so user can copy
        window.prompt('Copy this link to share:', shareData.url)
      }
    } catch (err) {
      console.error('Share failed:', err)
      toast.error('Could not share the product. Try copying the link manually.', { position: 'bottom-center', autoClose: 1500 })
    }
  }

  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden">
        <ToastContainer position="bottom-center" autoClose={1000} />
        <div className="container px-5 py-16 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full relative">
              <img alt="ecommerce" className="lg:h-auto px-24 object-cover object-top rounded" src={product.img} />
              
              {/* Wishlist Heart Icon */}
              <div className="absolute top-8 right-28 flex space-x-3 z-10">
                <button
                  onClick={handleWishlistToggle}
                  className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200"
                  title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isInWishlist ? (
                    <AiFillHeart className="text-red-500 text-2xl" />
                  ) : (
                    <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-2xl" />
                  )}
                </button>

                {/* Share Icon Button */}
                <button
                  onClick={handleShare}
                  className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200"
                  title="Share product"
                  aria-label="Share product"
                >
                  <PiShareFatLight className="text-gray-700 text-2xl" />
                </button>
              </div>
            </div>

            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.title} ({product.size}/{product.color})
              </h1>

              <p className="leading-relaxed">{product.desc}</p>

              {/* Variant Selectors */}
              {(color !== '' || size !== '') && (
                <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                  {/* Show Color Selector only if color is available */}
                  {color !== '' && Object.keys(variants).length > 0 && (
                    <div className="flex">
                      <span className="mr-3">Color</span>

                      {Object.keys(variants).includes('White') && Object.keys(variants['White']).includes(size) && (
                        <button
                          onClick={() => refreshVarient(size, 'White')}
                          className={`order-2 bg-white border-2 rounded-full w-6 h-6 focus:outline-none ${color === 'White' ? 'border-black' : 'border-gray-300'}`}
                        ></button>
                      )}
                      {Object.keys(variants).includes('Silver') && Object.keys(variants['Silver']).includes(size) && (
                        <button
                          onClick={() => refreshVarient(size, 'Silver')}
                          className={`order-2 bg-[#C0C0C0] border-2 rounded-full w-6 h-6 focus:outline-none ${color === 'Silver' ? 'border-black' : 'border-gray-300'}`}
                        ></button>
                      )}
                      {/* Add other colors following the same pattern */}
                    </div>
                  )}

                  {/* Show Size Selector only if size is available */}
                  {size !== '' && Object.keys(variants[color] || {}).length > 0 && (
                    <div className="flex ml-6 items-center">
                      <span className="mr-3">Size</span>
                      <div className="relative">
                        <select
                          value={size}
                          onChange={(e) => refreshVarient(e.target.value, color)}
                          className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
                        >
                          {Object.keys(variants[color] || {}).map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>

                        <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stock Status */}
              <div className="mt-4 mb-4">
                {product.availableQty > 0 ? (
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-green-600 font-semibold text-sm">
                      In Stock ({product.availableQty} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-600 font-semibold text-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">₹{product.price}</span>
                <button
                  onClick={() => buyNow(slug, 1, product.price, product.title, size, color, product.img)}
                  disabled={product.availableQty <= 0}
                  className={`flex ml-8 text-white border-0 py-2 px-2 md:px-6 focus:outline-none rounded ${
                    product.availableQty > 0
                      ? 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Buy Now
                </button>
                <button
                  onClick={() => addToCart(slug, 1, product.price, product.title, size, color, product.img)}
                  disabled={product.availableQty <= 0}
                  className={`flex ml-4 text-white border-0 py-2 px-2 md:px-6 focus:outline-none rounded ${
                    product.availableQty > 0
                      ? 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
              </div>

              <div className="pin mt-6 flex space-x-2 text-sm">
                <input
                  onChange={onChangePin}
                  className="px-2 border-2 border-black-700 rounded-md"
                  placeholder="Enter your pincode"
                  type="text"
                />
                <button
                  onClick={chackServiceability}
                  className="flex ml-14 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                >
                  Check
                </button>
              </div>
              {(!service && service != null) && (
                <div className="text-red-700 text-sm mt-3">
                  Sorry! We do not deliver to this pincode yet.
                </div>
              )}
              {(service && service != null) && (
                <div className="text-green-700 text-sm mt-3">
                  Yes! This pincode is serviceable.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  let product = await Product.findOne({ slug: context.query.slug })
  let variants = await Product.find({ title: product.title, category: product.category })
  let colorSizeSlug = {}
  for (let item of variants) {
    if (Object.keys(colorSizeSlug).includes(item.color)) {
      colorSizeSlug[item.color][item.size] = { slug: item.slug }
    } else {
      colorSizeSlug[item.color] = {}
      colorSizeSlug[item.color][item.size] = { slug: item.slug }
    }
  }

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      variants: JSON.parse(JSON.stringify(colorSizeSlug))
    },
  }
}

export default Post
