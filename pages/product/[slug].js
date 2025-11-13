

// // pages/product/[slug].js
// import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react'
// import mongoose from 'mongoose'
// import Product from '@/models/Product'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
// import { PiShareFatLight } from "react-icons/pi";

// const Post = ({ buyNow, addToCart, product, variants, wishlist = {}, addToWishlist, removeFromWishlist, addToRecentlyViewed }) => {
//   console.log(product, variants)
//   const router = useRouter()
//   const { slug } = router.query
//   const [pin, setpin] = useState()
//   const [service, setservice] = useState()

//   // Add product to recently viewed when component mounts
//   useEffect(() => {
//     if (product && addToRecentlyViewed) {
//       addToRecentlyViewed(
//         product._id,
//         product.price,
//         product.title,
//         product.size,
//         product.color,
//         product.img,
//         product.slug
//       )
//     }
//   }, [product])

//   const chackServiceability = async () => {
//     let pins = await fetch(`${process.env.HOST}/api/pincode`)
//     let pinJson = await pins.json()
//     if (pinJson.includes(parseInt(pin))) {
//       setservice(true)
//       toast.success('Your pincode is serviceable!', {
//         position: "bottom-center",
//         autoClose: 1000,
//       });
//     }
//     else {
//       setservice(false)
//       toast.error('Sorry, your pincode is not serviceable!', {
//         position: "bottom-center",
//         autoClose: 1000,
//       });
//     }
//   }

//   const onChangePin = (e) => {
//     setpin(e.target.value)
//   }

//   const [color, setColor] = useState(product.color)
//   const [size, setSize] = useState(product.size)

//   const refreshVarient = (newsize, newcolor) => {
//     let url = `${process.env.NEXT_PUBLIC_HOST}/product/${variants[newcolor][newsize]['slug']}`
//     window.location = url;
//   }

//   const handleWishlistToggle = () => {
//     const isInWishlist = product._id in wishlist;
    
//     if (isInWishlist) {
//       if (removeFromWishlist) {
//         removeFromWishlist(product._id);
//         toast.info('Removed from wishlist', {
//           position: "bottom-center",
//           autoClose: 1000,
//         });
//       }
//     } else {
//       if (addToWishlist) {
//         addToWishlist(product._id, product.price, product.title, product.size, product.color, product.img);
//         toast.success('Added to wishlist!', {
//           position: "bottom-center",
//           autoClose: 1000,
//         });
//       }
//     }
//   };

//   const isInWishlist = product._id in wishlist;

//   // Share handler: use Web Share API if available, otherwise copy link to clipboard
//   const handleShare = async () => {
//     const shareData = {
//       title: product.title,
//       text: `Check out this product: ${product.title} (${product.size}/${product.color})`,
//       url: typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_HOST}/product/${slug}`
//     }

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData)
//         // No toast usually necessary, but nice to confirm
//         toast.success('Thanks for sharing!', { position: 'bottom-center', autoClose: 1000 })
//       } else if (navigator.clipboard) {
//         await navigator.clipboard.writeText(shareData.url)
//         toast.success('Product link copied to clipboard!', { position: 'bottom-center', autoClose: 1000 })
//       } else {
//         // Fallback: prompt with the URL so user can copy
//         window.prompt('Copy this link to share:', shareData.url)
//       }
//     } catch (err) {
//       console.error('Share failed:', err)
//       toast.error('Could not share the product. Try copying the link manually.', { position: 'bottom-center', autoClose: 1500 })
//     }
//   }

//   return (
//     <>
//       <section className="text-gray-600 body-font overflow-hidden">
//         <ToastContainer position="bottom-center" autoClose={1000} />
//         <div className="container px-5 py-16 mx-auto">
//           <div className="lg:w-4/5 mx-auto flex flex-wrap">
//             <div className="lg:w-1/2 w-full relative">
//               <img alt="ecommerce" className="lg:h-auto px-24 object-cover object-top rounded" src={product.img} />
              
//               {/* Wishlist Heart Icon */}
//               <div className="absolute top-8 right-28 flex space-x-3 z-10">
//                 <button
//                   onClick={handleWishlistToggle}
//                   className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200"
//                   title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                   aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   {isInWishlist ? (
//                     <AiFillHeart className="text-red-500 text-2xl" />
//                   ) : (
//                     <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-2xl" />
//                   )}
//                 </button>

//                 {/* Share Icon Button */}
//                 <button
//                   onClick={handleShare}
//                   className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200"
//                   title="Share product"
//                   aria-label="Share product"
//                 >
//                   <PiShareFatLight className="text-gray-700 text-2xl" />
//                 </button>
//               </div>
//             </div>

//             <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
//               <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
//               <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
//                 {product.title} ({product.size}/{product.color})
//               </h1>

//               <p className="leading-relaxed">{product.desc}</p>

//               {/* Variant Selectors */}
//               {(color !== '' || size !== '') && (
//                 <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
//                   {/* Show Color Selector only if color is available */}
//                   {color !== '' && Object.keys(variants).length > 0 && (
//                     <div className="flex">
//                       <span className="mr-3">Color</span>

//                       {Object.keys(variants).includes('White') && Object.keys(variants['White']).includes(size) && (
//                         <button
//                           onClick={() => refreshVarient(size, 'White')}
//                           className={`order-2 bg-white border-2 rounded-full w-6 h-6 focus:outline-none ${color === 'White' ? 'border-black' : 'border-gray-300'}`}
//                         ></button>
//                       )}
//                       {Object.keys(variants).includes('Silver') && Object.keys(variants['Silver']).includes(size) && (
//                         <button
//                           onClick={() => refreshVarient(size, 'Silver')}
//                           className={`order-2 bg-[#C0C0C0] border-2 rounded-full w-6 h-6 focus:outline-none ${color === 'Silver' ? 'border-black' : 'border-gray-300'}`}
//                         ></button>
//                       )}
//                       {/* Add other colors following the same pattern */}
//                     </div>
//                   )}

//                   {/* Show Size Selector only if size is available */}
//                   {size !== '' && Object.keys(variants[color] || {}).length > 0 && (
//                     <div className="flex ml-6 items-center">
//                       <span className="mr-3">Size</span>
//                       <div className="relative">
//                         <select
//                           value={size}
//                           onChange={(e) => refreshVarient(e.target.value, color)}
//                           className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
//                         >
//                           {Object.keys(variants[color] || {}).map((sz) => (
//                             <option key={sz} value={sz}>
//                               {sz}
//                             </option>
//                           ))}
//                         </select>

//                         <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
//                           <svg
//                             fill="none"
//                             stroke="currentColor"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             className="w-4 h-4"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M6 9l6 6 6-6"></path>
//                           </svg>
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Stock Status */}
//               <div className="mt-4 mb-4">
//                 {product.availableQty > 0 ? (
//                   <div className="flex items-center space-x-2">
//                     <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
//                     <span className="text-green-600 font-semibold text-sm">
//                       In Stock ({product.availableQty} available)
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center space-x-2">
//                     <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
//                     <span className="text-red-600 font-semibold text-sm">
//                       Out of Stock
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex">
//                 <span className="title-font font-medium text-2xl text-gray-900">₹{product.price}</span>
//                 <button
//                   onClick={() => buyNow(slug, 1, product.price, product.title, size, color, product.img)}
//                   disabled={product.availableQty <= 0}
//                   className={`flex ml-8 text-white border-0 py-2 px-2 md:px-6 focus:outline-none rounded ${
//                     product.availableQty > 0
//                       ? 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
//                       : 'bg-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   Buy Now
//                 </button>
//                 <button
//                   onClick={() => addToCart(slug, 1, product.price, product.title, size, color, product.img)}
//                   disabled={product.availableQty <= 0}
//                   className={`flex ml-4 text-white border-0 py-2 px-2 md:px-6 focus:outline-none rounded ${
//                     product.availableQty > 0
//                       ? 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
//                       : 'bg-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   Add to Cart
//                 </button>
//               </div>

//               <div className="pin mt-6 flex space-x-2 text-sm">
//                 <input
//                   onChange={onChangePin}
//                   className="px-2 border-2 border-black-700 rounded-md"
//                   placeholder="Enter your pincode"
//                   type="text"
//                 />
//                 <button
//                   onClick={chackServiceability}
//                   className="flex ml-14 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
//                 >
//                   Check
//                 </button>
//               </div>
//               {(!service && service != null) && (
//                 <div className="text-red-700 text-sm mt-3">
//                   Sorry! We do not deliver to this pincode yet.
//                 </div>
//               )}
//               {(service && service != null) && (
//                 <div className="text-green-700 text-sm mt-3">
//                   Yes! This pincode is serviceable.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }

// export async function getServerSideProps(context) {
//   if (!mongoose.connections[0].readyState) {
//     await mongoose.connect(process.env.MONGO_URI)
//   }
//   let product = await Product.findOne({ slug: context.query.slug })
//   let variants = await Product.find({ title: product.title, category: product.category })
//   let colorSizeSlug = {}
//   for (let item of variants) {
//     if (Object.keys(colorSizeSlug).includes(item.color)) {
//       colorSizeSlug[item.color][item.size] = { slug: item.slug }
//     } else {
//       colorSizeSlug[item.color] = {}
//       colorSizeSlug[item.color][item.size] = { slug: item.slug }
//     }
//   }

//   return {
//     props: {
//       product: JSON.parse(JSON.stringify(product)),
//       variants: JSON.parse(JSON.stringify(colorSizeSlug))
//     },
//   }
// }

// export default Post

// // pages/product/[slug].js
// import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react'
// import mongoose from 'mongoose'
// import Product from '@/models/Product'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
// import { PiShareFatLight } from "react-icons/pi";

// const Star = ({ filled }) => (
//   <svg className={`w-4 h-4 inline-block ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
//     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.49 2.381c-.784.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.523 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
//   </svg>
// )

// const Post = ({ buyNow, addToCart, product, variants, wishlist = {}, addToWishlist, removeFromWishlist, addToRecentlyViewed }) => {
//   const router = useRouter()
//   const { slug } = router.query
//   const [pin, setpin] = useState()
//   const [service, setservice] = useState()

//   // Reviews state
//   const [reviews, setReviews] = useState([])
//   const [reviewsLoading, setReviewsLoading] = useState(true)
//   const [reviewsError, setReviewsError] = useState(null)

//   // Add product to recently viewed when component mounts
//   useEffect(() => {
//     if (product && addToRecentlyViewed) {
//       addToRecentlyViewed(
//         product._id,
//         product.price,
//         product.title,
//         product.size,
//         product.color,
//         product.img,
//         product.slug
//       )
//     }
//   }, [product])

//   // Fetch reviews for this product
//   useEffect(() => {
//     const fetchReviews = async () => {
//       if (!product || !product._id) return
//       setReviewsLoading(true)
//       setReviewsError(null)
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_HOST || ''}/api/review/getreviews?productId=${product._id}`)
//         if (!res.ok) {
//           throw new Error(`Failed to fetch reviews: ${res.status}`)
//         }
//         const data = await res.json()
//         console.log("reviews", data)
//         if (data && data.success) {
//           setReviews(data.reviews || [])
//         } else {
//           setReviews([])
//         }
//       } catch (err) {
//         console.error("Error fetching reviews:", err)
//         setReviewsError('Could not load reviews.')
//         setReviews([])
//       } finally {
//         setReviewsLoading(false)
//       }
//     }

//     fetchReviews()
//   }, [product && product._id])

//   // compute average rating
//   const averageRating = reviews.length
//     ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length)
//     : 0

//   const chackServiceability = async () => {
//     let pins = await fetch(`${process.env.HOST}/api/pincode`)
//     let pinJson = await pins.json()
//     if (pinJson.includes(parseInt(pin))) {
//       setservice(true)
//       toast.success('Your pincode is serviceable!', {
//         position: "bottom-center",
//         autoClose: 1000,
//       });
//     }
//     else {
//       setservice(false)
//       toast.error('Sorry, your pincode is not serviceable!', {
//         position: "bottom-center",
//         autoClose: 1000,
//       });
//     }
//   }

//   const onChangePin = (e) => {
//     setpin(e.target.value)
//   }

//   const [color, setColor] = useState(product.color)
//   const [size, setSize] = useState(product.size)

//   const refreshVarient = (newsize, newcolor) => {
//     let url = `${process.env.NEXT_PUBLIC_HOST}/product/${variants[newcolor][newsize]['slug']}`
//     window.location = url;
//   }

//   const handleWishlistToggle = () => {
//     const isInWishlist = product._id in wishlist;
    
//     if (isInWishlist) {
//       if (removeFromWishlist) {
//         removeFromWishlist(product._id);
//         toast.info('Removed from wishlist', {
//           position: "bottom-center",
//           autoClose: 1000,
//         });
//       }
//     } else {
//       if (addToWishlist) {
//         addToWishlist(product._id, product.price, product.title, product.size, product.color, product.img);
//         toast.success('Added to wishlist!', {
//           position: "bottom-center",
//           autoClose: 1000,
//         });
//       }
//     }
//   };

//   const isInWishlist = product._id in wishlist;

//   // Share handler: use Web Share API if available, otherwise copy link to clipboard
//   const handleShare = async () => {
//     const shareData = {
//       title: product.title,
//       text: `Check out this product: ${product.title} (${product.size}/${product.color})`,
//       url: typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_HOST}/product/${slug}`
//     }

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData)
//         toast.success('Thanks for sharing!', { position: 'bottom-center', autoClose: 1000 })
//       } else if (navigator.clipboard) {
//         await navigator.clipboard.writeText(shareData.url)
//         toast.success('Product link copied to clipboard!', { position: 'bottom-center', autoClose: 1000 })
//       } else {
//         window.prompt('Copy this link to share:', shareData.url)
//       }
//     } catch (err) {
//       console.error('Share failed:', err)
//       toast.error('Could not share the product. Try copying the link manually.', { position: 'bottom-center', autoClose: 1500 })
//     }
//   }

//   return (
//     <>
//       <section className="text-gray-600 body-font overflow-hidden">
//         <ToastContainer position="bottom-center" autoClose={1000} />
//         <div className="container px-5 py-16 mx-auto">
//           <div className="lg:w-4/5 mx-auto flex flex-wrap">
//             <div className="lg:w-1/2 w-full relative">
//               <img alt="ecommerce" className="lg:h-auto px-24 object-cover object-top rounded" src={product.img} />
              
//               {/* Wishlist Heart Icon */}
//               <div className="absolute top-8 right-28 flex space-x-3 z-10">
//                 <button
//                   onClick={handleWishlistToggle}
//                   className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200"
//                   title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                   aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                 >
//                   {isInWishlist ? (
//                     <AiFillHeart className="text-red-500 text-2xl" />
//                   ) : (
//                     <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-2xl" />
//                   )}
//                 </button>

//                 {/* Share Icon Button */}
//                 <button
//                   onClick={handleShare}
//                   className="bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200"
//                   title="Share product"
//                   aria-label="Share product"
//                 >
//                   <PiShareFatLight className="text-gray-700 text-2xl" />
//                 </button>
//               </div>
//             </div>

//             <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
//               <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
//               <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
//                 {product.title} ({product.size}/{product.color})
//               </h1>

//               {/* Rating & review count */}
//               <div className="flex items-center mb-3">
//                 <div className="mr-3">
//                   {/* show up to 5 stars */}
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Star key={i} filled={i < Math.round(averageRating)} />
//                   ))}
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   {reviewsLoading ? (
//                     <span>Loading reviews...</span>
//                   ) : (
//                     <span>{averageRating ? averageRating.toFixed(1) : '0.0'} • {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
//                   )}
//                 </div>
//               </div>

//               <p className="leading-relaxed">{product.desc}</p>

//               {/* Variant Selectors */}
//               {(color !== '' || size !== '') && (
//                 <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
//                   {/* Show Color Selector only if color is available */}
//                   {color !== '' && Object.keys(variants).length > 0 && (
//                     <div className="flex">
//                       <span className="mr-3">Color</span>

//                       {Object.keys(variants).includes('White') && Object.keys(variants['White']).includes(size) && (
//                         <button
//                           onClick={() => refreshVarient(size, 'White')}
//                           className={`order-2 bg-white border-2 rounded-full w-6 h-6 focus:outline-none ${color === 'White' ? 'border-black' : 'border-gray-300'}`}
//                         ></button>
//                       )}
//                       {Object.keys(variants).includes('Silver') && Object.keys(variants['Silver']).includes(size) && (
//                         <button
//                           onClick={() => refreshVarient(size, 'Silver')}
//                           className={`order-2 bg-[#C0C0C0] border-2 rounded-full w-6 h-6 focus:outline-none ${color === 'Silver' ? 'border-black' : 'border-gray-300'}`}
//                         ></button>
//                       )}
//                       {/* Add other colors following the same pattern */}
//                     </div>
//                   )}

//                   {/* Show Size Selector only if size is available */}
//                   {size !== '' && Object.keys(variants[color] || {}).length > 0 && (
//                     <div className="flex ml-6 items-center">
//                       <span className="mr-3">Size</span>
//                       <div className="relative">
//                         <select
//                           value={size}
//                           onChange={(e) => refreshVarient(e.target.value, color)}
//                           className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
//                         >
//                           {Object.keys(variants[color] || {}).map((sz) => (
//                             <option key={sz} value={sz}>
//                               {sz}
//                             </option>
//                           ))}
//                         </select>

//                         <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
//                           <svg
//                             fill="none"
//                             stroke="currentColor"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             className="w-4 h-4"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M6 9l6 6 6-6"></path>
//                           </svg>
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Stock Status */}
//               <div className="mt-4 mb-4">
//                 {product.availableQty > 0 ? (
//                   <div className="flex items-center space-x-2">
//                     <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
//                     <span className="text-green-600 font-semibold text-sm">
//                       In Stock ({product.availableQty} available)
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center space-x-2">
//                     <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
//                     <span className="text-red-600 font-semibold text-sm">
//                       Out of Stock
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex">
//                 <span className="title-font font-medium text-2xl text-gray-900">₹{product.price}</span>
//                 <button
//                   onClick={() => buyNow(slug, 1, product.price, product.title, size, color, product.img)}
//                   disabled={product.availableQty <= 0}
//                   className={`flex ml-8 text-white border-0 py-2 px-2 md:px-6 focus:outline-none rounded ${
//                     product.availableQty > 0
//                       ? 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
//                       : 'bg-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   Buy Now
//                 </button>
//                 <button
//                   onClick={() => addToCart(slug, 1, product.price, product.title, size, color, product.img)}
//                   disabled={product.availableQty <= 0}
//                   className={`flex ml-4 text-white border-0 py-2 px-2 md:px-6 focus:outline-none rounded ${
//                     product.availableQty > 0
//                       ? 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
//                       : 'bg-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   Add to Cart
//                 </button>
//               </div>

//               <div className="pin mt-6 flex space-x-2 text-sm">
//                 <input
//                   onChange={onChangePin}
//                   className="px-2 border-2 border-black-700 rounded-md"
//                   placeholder="Enter your pincode"
//                   type="text"
//                 />
//                 <button
//                   onClick={chackServiceability}
//                   className="flex ml-14 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
//                 >
//                   Check
//                 </button>
//               </div>
//               {(!service && service != null) && (
//                 <div className="text-red-700 text-sm mt-3">
//                   Sorry! We do not deliver to this pincode yet.
//                 </div>
//               )}
//               {(service && service != null) && (
//                 <div className="text-green-700 text-sm mt-3">
//                   Yes! This pincode is serviceable.
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Reviews Section */}
//           <div className="lg:w-4/5 mx-auto mt-8">
//             <h3 className="text-2xl font-medium mb-4">Customer reviews</h3>

//             {reviewsLoading && (
//               <div className="text-gray-600">Loading reviews...</div>
//             )}

//             {!reviewsLoading && reviewsError && (
//               <div className="text-red-600">{reviewsError}</div>
//             )}

//             {!reviewsLoading && !reviewsError && reviews.length === 0 && (
//               <div className="text-gray-600">No reviews yet. Be the first to review this product!</div>
//             )}

//             {!reviewsLoading && reviews.length > 0 && (
//               <div className="space-y-6">
//                {reviews.map((r) => (
//   <div key={r._id} className="p-4 border rounded-md">
//     <div className="flex items-center justify-between mb-2">
//       <div className="font-semibold text-gray-800">{r.user?.name || 'Anonymous'}</div>
//       <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
//     </div>

//     <div className="mb-2">
//       {Array.from({ length: 5 }).map((_, i) => (
//         <Star key={i} filled={i < (r.rating || 0)} />
//       ))}
//       <span className="ml-2 text-sm text-gray-600">{r.rating ? r.rating : '-'}/5</span>
//     </div>

//     {r.comment && <div className="text-gray-700 mb-3">{r.comment}</div>}

//     {/* Review images (thumbnails) */}
//     {r.images && r.images.length > 0 && (
//       <div className="mt-2 flex space-x-3 overflow-x-auto">
//         {r.images.map((imgUrl, idx) => (
//           <a
//             key={idx}
//             href={imgUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-block"
//             title={`Open image ${idx + 1}`}
//           >
//             <img
//               src={imgUrl}
//               alt={`Review image ${idx + 1} by ${r.user?.name || 'user'}`}
//               className="w-20 h-20 object-cover rounded-md border"
//             />
//           </a>
//         ))}
//       </div>
//     )}
//   </div>
// ))}

//               </div>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }

// export async function getServerSideProps(context) {
//   if (!mongoose.connections[0].readyState) {
//     await mongoose.connect(process.env.MONGO_URI)
//   }
//   let product = await Product.findOne({ slug: context.query.slug })
//   let variants = await Product.find({ title: product.title, category: product.category })
//   let colorSizeSlug = {}
//   for (let item of variants) {
//     if (Object.keys(colorSizeSlug).includes(item.color)) {
//       colorSizeSlug[item.color][item.size] = { slug: item.slug }
//     } else {
//       colorSizeSlug[item.color] = {}
//       colorSizeSlug[item.color][item.size] = { slug: item.slug }
//     }
//   }

//   return {
//     props: {
//       product: JSON.parse(JSON.stringify(product)),
//       variants: JSON.parse(JSON.stringify(colorSizeSlug))
//     },
//   }
// }

// export default Post


// pages/product/[slug].js
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import mongoose from 'mongoose'
import Product from '@/models/Product'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { PiShareFatLight } from "react-icons/pi";
import Link from "next/link";

const Star = ({ filled }) => (
  <svg className={`w-4 h-4 inline-block ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.49 2.381c-.784.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.523 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
  </svg>
)

const Post = ({ buyNow, addToCart, product, variants, wishlist = {}, addToWishlist, removeFromWishlist, addToRecentlyViewed }) => {
  const router = useRouter()
  const { slug } = router.query
  const [pin, setpin] = useState()
  const [service, setservice] = useState()

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState(null)

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

  // Fetch reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product || !product._id) return
      setReviewsLoading(true)
      setReviewsError(null)
      try {
        const base = process.env.NEXT_PUBLIC_HOST || ''
        const res = await fetch(`${base}/api/review/getreviews?productId=${product._id}`)
        if (!res.ok) {
          throw new Error(`Failed to fetch reviews: ${res.status}`)
        }
        const data = await res.json()
        if (data && data.success) {
          setReviews(data.reviews || [])
        } else {
          setReviews([])
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
        setReviewsError('Could not load reviews.')
        setReviews([])
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchReviews()
  }, [product && product._id])

  // compute average rating
  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length)
    : 0

  const chackServiceability = async () => {
    try {
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
    } catch (err) {
      toast.error('Could not check pincode.', { position: 'bottom-center', autoClose: 1000 })
      setservice(null)
    }
  }

  const onChangePin = (e) => {
    setpin(e.target.value)
  }

  const [color, setColor] = useState(product.color || '')
  const [size, setSize] = useState(product.size || '')

  const refreshVarient = (newsize, newcolor) => {
    let url = `${process.env.NEXT_PUBLIC_HOST || ''}/product/${variants[newcolor][newsize]['slug']}`
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
        toast.success('Thanks for sharing!', { position: 'bottom-center', autoClose: 1000 })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url)
        toast.success('Product link copied to clipboard!', { position: 'bottom-center', autoClose: 1000 })
      } else {
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

              {/* Rating & review count */}
              <div className="flex items-center mb-3">
                <div className="mr-3">
                  {/* show up to 5 stars */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < Math.round(averageRating)} />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {reviewsLoading ? (
                    <span>Loading reviews...</span>
                  ) : (
                    <span>{averageRating ? averageRating.toFixed(1) : '0.0'} • {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                  )}
                </div>

                {/* Link to full reviews page */}
                <div className="ml-4">
                  <Link href={`/product/${slug}/reviews`}>
                    <span className="text-indigo-600 hover:underline text-sm">See all reviews</span>
                  </Link>
                </div>
              </div>

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
                      In Stock 
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

          {/* Reviews Section */}
          <div className="lg:w-4/5 mx-auto mt-8">
            <h3 className="text-2xl font-medium mb-4">Customer reviews</h3>

            {reviewsLoading && (
              <div className="text-gray-600">Loading reviews...</div>
            )}

            {!reviewsLoading && reviewsError && (
              <div className="text-red-600">{reviewsError}</div>
            )}

            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <div className="text-gray-600">No reviews yet. Be the first to review this product!</div>
            )}

            {!reviewsLoading && reviews.length > 0 && (
              <div className="space-y-6">
                {reviews.map((r) => (
                  <div key={r._id} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-800">{r.user?.name || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} filled={i < (r.rating || 0)} />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{r.rating ? r.rating : '-'}/5</span>
                    </div>

                    {r.comment && <div className="text-gray-700 mb-3">{r.comment}</div>}

                    {/* Review images (thumbnails) */}
                    {r.images && r.images.length > 0 && (
                      <div className="mt-2 flex space-x-3 overflow-x-auto">
                        {r.images.map((imgUrl, idx) => (
                          <a
                            key={idx}
                            href={imgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                            title={`Open image ${idx + 1}`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Review image ${idx + 1} by ${r.user?.name || 'user'}`}
                              className="w-20 h-20 object-cover rounded-md border"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
