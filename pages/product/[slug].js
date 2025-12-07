

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



// // pages/product/[slug].js
// import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react'
// import mongoose from 'mongoose'
// import Product from '@/models/Product'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
// import { PiShareFatLight } from "react-icons/pi";
// import Link from "next/link";

// const Star = ({ filled }) => (
//   <svg className={`w-5 h-5 inline-block ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
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
//         const base = process.env.NEXT_PUBLIC_HOST || ''
//         const res = await fetch(`${base}/api/review/getreviews?productId=${product._id}`)
//         if (!res.ok) {
//           throw new Error(`Failed to fetch reviews: ${res.status}`)
//         }
//         const data = await res.json()
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
//     try {
//       let pins = await fetch(`${process.env.HOST}/api/pincode`)
//       let pinJson = await pins.json()
//       if (pinJson.includes(parseInt(pin))) {
//         setservice(true)
//         toast.success('Your pincode is serviceable!', {
//           position: "bottom-center",
//           autoClose: 1000,
//         });
//       }
//       else {
//         setservice(false)
//         toast.error('Sorry, your pincode is not serviceable!', {
//           position: "bottom-center",
//           autoClose: 1000,
//         });
//       }
//     } catch (err) {
//       toast.error('Could not check pincode.', { position: 'bottom-center', autoClose: 1000 })
//       setservice(null)
//     }
//   }

//   const onChangePin = (e) => {
//     setpin(e.target.value)
//   }

//   const [color, setColor] = useState(product.color || '')
//   const [size, setSize] = useState(product.size || '')

//   const refreshVarient = (newsize, newcolor) => {
//     let url = `${process.env.NEXT_PUBLIC_HOST || ''}/product/${variants[newcolor][newsize]['slug']}`
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
//       <section className="body-font" style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}>
//         <ToastContainer position="bottom-center" autoClose={1000} />
//         <div className="container px-5 py-12 mx-auto max-w-7xl">
//           <div className="lg:flex lg:gap-12">
//             {/* Image Section */}
//             <div className="lg:w-1/2 w-full mb-8 lg:mb-0">
//               <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
//                 <img 
//                   alt={product.title} 
//                   className="w-full h-auto object-cover object-center " 
//                   src={product.img} 
//                 />
                
//                 {/* Action Buttons - Wishlist & Share */}
//                 <div className="absolute top-6 right-6 flex gap-3">
//                   <button
//                     onClick={handleWishlistToggle}
//                     className="bg-white hover:bg-rose-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-rose-100"
//                     title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                     aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                   >
//                     {isInWishlist ? (
//                       <AiFillHeart className="text-rose-500 text-2xl" />
//                     ) : (
//                       <AiOutlineHeart className="text-rose-400 hover:text-rose-500 text-2xl transition-colors" />
//                     )}
//                   </button>

//                   <button
//                     onClick={handleShare}
//                     className="bg-white hover:bg-rose-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-rose-100"
//                     title="Share product"
//                     aria-label="Share product"
//                   >
//                     <PiShareFatLight className="text-rose-400 text-2xl" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Product Details Section */}
//             <div className="lg:w-1/2 w-full">
//               <div className="mb-4">
//                 <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
//                   Brand Name
//                 </span>
//               </div>

//               <h1 className="text-gray-900 text-3xl lg:text-4xl font-bold mb-3 leading-tight">
//                 {product.title}
//               </h1>

//               <div className="text-sm text-gray-600 mb-4">
//                 <span className="inline-block bg-white px-3 py-1 rounded-full mr-2 border border-rose-100">
//                   Size: {product.size}
//                 </span>
//                 <span className="inline-block bg-white px-3 py-1 rounded-full border border-rose-100">
//                   Color: {product.color}
//                 </span>
//               </div>

//               {/* Rating & Reviews */}
//               <div className="flex items-center gap-4 mb-6 pb-6 border-b border-rose-100">
//                 <div className="flex items-center">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Star key={i} filled={i < Math.round(averageRating)} />
//                   ))}
//                 </div>
//                 <div className="text-sm font-medium text-gray-700">
//                   {reviewsLoading ? (
//                     <span>Loading...</span>
//                   ) : (
//                     <span>{averageRating ? averageRating.toFixed(1) : '0.0'} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
//                   )}
//                 </div>
//                 <Link href={`/product/${slug}/reviews`}>
//                   <span className="text-rose-600 hover:text-rose-800 text-sm font-medium hover:underline transition-colors">
//                     See all reviews →
//                   </span>
//                 </Link>
//               </div>

//               {/* Description */}
//               <p className="text-gray-700 leading-relaxed mb-6 text-base">{product.desc}</p>

//               {/* Variant Selectors */}
//               {(color !== '' || size !== '') && (
//                 <div className="mb-6 pb-6 border-b border-rose-100">
//                   <div className="space-y-4">
//                     {/* Color Selector */}
//                     {color !== '' && Object.keys(variants).length > 0 && (
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                           Select Color
//                         </label>
//                         <div className="flex gap-3">
//                           {Object.keys(variants).includes('White') && Object.keys(variants['White']).includes(size) && (
//                             <button
//                               onClick={() => refreshVarient(size, 'White')}
//                               className={`relative bg-white border-2 rounded-lg w-10 h-10 focus:outline-none transition-all duration-200 hover:scale-105 ${
//                                 color === 'White' ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-300 hover:border-rose-300'
//                               }`}
//                               title="White"
//                             >
//                               {color === 'White' && (
//                                 <span className="absolute inset-0 flex items-center justify-center">
//                                   <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
//                                 </span>
//                               )}
//                             </button>
//                           )}
//                           {Object.keys(variants).includes('Silver') && Object.keys(variants['Silver']).includes(size) && (
//                             <button
//                               onClick={() => refreshVarient(size, 'Silver')}
//                               className={`relative bg-[#C0C0C0] border-2 rounded-lg w-10 h-10 focus:outline-none transition-all duration-200 hover:scale-105 ${
//                                 color === 'Silver' ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-300 hover:border-rose-300'
//                               }`}
//                               title="Silver"
//                             >
//                               {color === 'Silver' && (
//                                 <span className="absolute inset-0 flex items-center justify-center">
//                                   <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
//                                 </span>
//                               )}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* Size Selector */}
//                     {size !== '' && Object.keys(variants[color] || {}).length > 0 && (
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                           Select Size
//                         </label>
//                         <div className="relative inline-block">
//                           <select
//                             value={size}
//                             onChange={(e) => refreshVarient(e.target.value, color)}
//                             className="appearance-none bg-white border-2 border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-base font-medium text-gray-700 cursor-pointer hover:border-rose-300 transition-colors"
//                           >
//                             {Object.keys(variants[color] || {}).map((sz) => (
//                               <option key={sz} value={sz}>
//                                 {sz}
//                               </option>
//                             ))}
//                           </select>
//                           <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                             <svg
//                               className="w-5 h-5 text-gray-500"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               viewBox="0 0 24 24"
//                             >
//                               <path d="M6 9l6 6 6-6"></path>
//                             </svg>
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Stock Status */}
//               <div className="mb-6">
//                 {product.availableQty > 0 ? (
//                   <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
//                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                     <span className="text-green-700 font-semibold text-sm">
//                       In Stock - Ready to Ship
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
//                     <span className="w-2 h-2 bg-red-500 rounded-full"></span>
//                     <span className="text-red-700 font-semibold text-sm">
//                       Out of Stock
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Price & Action Buttons */}
//               <div className="mb-6">
//                 <div className="flex items-baseline gap-3 mb-6">
//                   <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
//                   <span className="text-sm text-gray-500">Inclusive of all taxes</span>
//                 </div>

//                 <div className="flex flex-wrap gap-4">
//                   <button
//                     onClick={() => buyNow(slug, 1, product.price, product.title, size, color, product.img)}
//                     disabled={product.availableQty <= 0}
//                     className={`flex-1 min-w-[140px] py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
//                       product.availableQty > 0
//                         ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
//                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     }`}
//                   >
//                     Buy Now
//                   </button>
//                   <button
//                     onClick={() => addToCart(slug, 1, product.price, product.title, size, color, product.img)}
//                     disabled={product.availableQty <= 0}
//                     className={`flex-1 min-w-[140px] py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
//                       product.availableQty > 0
//                         ? 'bg-white border-2 border-rose-500 text-rose-600 hover:bg-rose-50 shadow-md hover:shadow-lg'
//                         : 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>

//               {/* Pincode Check */}
//               <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-rose-100">
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                   Check Delivery Availability
//                 </label>
//                 <div className="flex gap-3">
//                   <input
//                     onChange={onChangePin}
//                     className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-base bg-white"
//                     placeholder="Enter pincode"
//                     type="text"
//                   />
//                   <button
//                     onClick={chackServiceability}
//                     className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap"
//                   >
//                     Check
//                   </button>
//                 </div>
//                 {(!service && service != null) && (
//                   <div className="flex items-start gap-2 mt-3 text-red-700 text-sm bg-red-50 p-3 rounded-lg">
//                     <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                     </svg>
//                     <span>Sorry! We do not deliver to this pincode yet.</span>
//                   </div>
//                 )}
//                 {(service && service != null) && (
//                   <div className="flex items-start gap-2 mt-3 text-green-700 text-sm bg-green-50 p-3 rounded-lg">
//                     <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <span>Great! This pincode is serviceable.</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Reviews Section */}
//           <div className="mt-16 border-t border-rose-100 pt-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

//             {reviewsLoading && (
//               <div className="flex items-center justify-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
//               </div>
//             )}

//             {!reviewsLoading && reviewsError && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
//                 {reviewsError}
//               </div>
//             )}

//             {!reviewsLoading && !reviewsError && reviews.length === 0 && (
//               <div className="bg-white/50 backdrop-blur-sm rounded-xl p-12 text-center border border-rose-100">
//                 <svg className="w-16 h-16 text-rose-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
//                 </svg>
//                 <p className="text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
//               </div>
//             )}

//             {!reviewsLoading && reviews.length > 0 && (
//               <div className="space-y-6">
//                 {reviews.map((r) => (
//                   <div key={r._id} className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <div className="font-semibold text-gray-900 text-lg mb-1">
//                           {r.user?.name || 'Anonymous'}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <Star key={i} filled={i < (r.rating || 0)} />
//                           ))}
//                           <span className="text-sm font-medium text-gray-600">
//                             {r.rating ? r.rating : '-'}/5
//                           </span>
//                         </div>
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {new Date(r.createdAt).toLocaleDateString('en-US', { 
//                           year: 'numeric', 
//                           month: 'short', 
//                           day: 'numeric' 
//                         })}
//                       </div>
//                     </div>

//                     {r.comment && (
//                       <div className="text-gray-700 leading-relaxed mb-4">
//                         {r.comment}
//                       </div>
//                     )}

//                     {/* Review images */}
//                     {r.images && r.images.length > 0 && (
//                       <div className="flex gap-3 overflow-x-auto pb-2">
//                         {r.images.map((imgUrl, idx) => (
//                           <a
//                             key={idx}
//                             href={imgUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex-shrink-0 group"
//                             title={`Open image ${idx + 1}`}
//                           >
//                             <img
//                               src={imgUrl}
//                               alt={`Review image ${idx + 1} by ${r.user?.name || 'user'}`}
//                               className="w-24 h-24 object-cover rounded-lg border-2 border-rose-100 group-hover:border-rose-400 transition-colors duration-200"
//                             />
//                           </a>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
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


// // pages/product/[slug].js
// import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react'
// import mongoose from 'mongoose'
// import Product from '@/models/Product'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
// import { PiShareFatLight } from "react-icons/pi";
// import Link from "next/link";

// const Star = ({ filled }) => (
//   <svg className={`w-5 h-5 inline-block ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
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
//         const base = process.env.NEXT_PUBLIC_HOST || ''
//         const res = await fetch(`${base}/api/review/getreviews?productId=${product._id}`)
//         if (!res.ok) {
//           throw new Error(`Failed to fetch reviews: ${res.status}`)
//         }
//         const data = await res.json()
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
//     try {
//       let pins = await fetch(`${process.env.HOST}/api/pincode`)
//       let pinJson = await pins.json()
//       if (pinJson.includes(parseInt(pin))) {
//         setservice(true)
//         toast.success('Your pincode is serviceable!', {
//           position: "bottom-center",
//           autoClose: 1000,
//         });
//       }
//       else {
//         setservice(false)
//         toast.error('Sorry, your pincode is not serviceable!', {
//           position: "bottom-center",
//           autoClose: 1000,
//         });
//       }
//     } catch (err) {
//       toast.error('Could not check pincode.', { position: 'bottom-center', autoClose: 1000 })
//       setservice(null)
//     }
//   }

//   const onChangePin = (e) => {
//     setpin(e.target.value)
//   }

//   const [color, setColor] = useState(product.color || '')
//   const [size, setSize] = useState(product.size || '')

//   const refreshVarient = (newsize, newcolor) => {
//     let url = `${process.env.NEXT_PUBLIC_HOST || ''}/product/${variants[newcolor][newsize]['slug']}`
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

//   // ---------------------------
//   // Image gallery (React state)
//   // ---------------------------
//   const initialImages = (product && product.images && product.images.length > 0)
//     ? product.images
//     : (product && product.img ? [product.img] : []);

//   const [galleryImages, setGalleryImages] = useState(initialImages);
//   const [mainImage, setMainImage] = useState(initialImages[0] || '');
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // keep gallery in sync when product prop changes (SSR -> CSR)
//   useEffect(() => {
//     const imgs = (product && product.images && product.images.length > 0)
//       ? product.images
//       : (product && product.img ? [product.img] : []);
//     setGalleryImages(imgs);
//     setCurrentIndex(0);
//     setMainImage(imgs[0] || '');
//   }, [product && product._id]);

//   // ---------------------------
//   // Render
//   // ---------------------------
//   return (
//     <>
//       <section className="body-font" style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}>
//         <ToastContainer position="bottom-center" autoClose={1000} />
//         <div className="container px-5 py-12 mx-auto max-w-7xl">
//           <div className="lg:flex lg:gap-12">
//             {/* Image Section (full, uses mainImage, galleryImages, currentIndex) */}
//             <div className="lg:w-1/2 w-full ">
//               <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
//                 <div className="relative">
//                   <img
//                     alt={product.title}
//                     className="w-full h-full object-contain bg-white"
//                     src={mainImage || (galleryImages[0] || '')}
//                   />

//                   {/* Prev / Next buttons */}
//                   {galleryImages.length > 1 && (
//                     <>
//                       <button
//                         onClick={() => {
//                           const nextIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
//                           setCurrentIndex(nextIndex);
//                           setMainImage(galleryImages[nextIndex]);
//                         }}
//                         aria-label="Previous image"
//                         className="hidden lg:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md hover:bg-white transition"
//                       >
//                         ‹
//                       </button>
//                       <button
//                         onClick={() => {
//                           const nextIndex = (currentIndex + 1) % galleryImages.length;
//                           setCurrentIndex(nextIndex);
//                           setMainImage(galleryImages[nextIndex]);
//                         }}
//                         aria-label="Next image"
//                         className="hidden lg:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md hover:bg-white transition"
//                       >
//                         ›
//                       </button>
//                     </>
//                   )}

//                   {/* Action Buttons - Wishlist & Share */}
//                   <div className="absolute top-6 right-6 flex gap-3 z-10">
//                     <button
//                       onClick={handleWishlistToggle}
//                       className="bg-white hover:bg-rose-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-rose-100"
//                       title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                       aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//                     >
//                       {isInWishlist ? (
//                         <AiFillHeart className="text-rose-500 text-2xl" />
//                       ) : (
//                         <AiOutlineHeart className="text-rose-400 hover:text-rose-500 text-2xl transition-colors" />
//                       )}
//                     </button>

//                     <button
//                       onClick={handleShare}
//                       className="bg-white hover:bg-rose-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-rose-100"
//                       title="Share product"
//                       aria-label="Share product"
//                     >
//                       <PiShareFatLight className="text-rose-400 text-2xl" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Thumbnail strip */}
//                 <div className="px-4 py-3 border-t border-rose-100 bg-white">
//                   <div className="flex gap-3 overflow-x-auto py-2">
//                     {galleryImages.map((imgUrl, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => {
//                           setCurrentIndex(idx);
//                           setMainImage(imgUrl);
//                         }}
//                         className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 focus:outline-none transition-all duration-150 ${
//                           currentIndex === idx ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-200'
//                         }`}
//                         title={`View image ${idx + 1}`}
//                         aria-label={`View image ${idx + 1}`}
//                       >
//                         <img
//                           src={imgUrl}
//                           alt={`${product.title} - ${idx + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Product Details Section */}
//             <div className="lg:w-1/2 w-full">
//               <div className="mb-4">
//                 <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
//                   Brand Name
//                 </span>
//               </div>

//               <h1 className="text-gray-900 text-3xl lg:text-4xl font-bold mb-3 leading-tight">
//                 {product.title}
//               </h1>

//               <div className="text-sm text-gray-600 mb-4">
//                 <span className="inline-block bg-white px-3 py-1 rounded-full mr-2 border border-rose-100">
//                   Size: {product.size}
//                 </span>
//                 <span className="inline-block bg-white px-3 py-1 rounded-full border border-rose-100">
//                   Color: {product.color}
//                 </span>
//               </div>

//               {/* Rating & Reviews */}
//               <div className="flex items-center gap-4 mb-6 pb-6 border-b border-rose-100">
//                 <div className="flex items-center">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Star key={i} filled={i < Math.round(averageRating)} />
//                   ))}
//                 </div>
//                 <div className="text-sm font-medium text-gray-700">
//                   {reviewsLoading ? (
//                     <span>Loading...</span>
//                   ) : (
//                     <span>{averageRating ? averageRating.toFixed(1) : '0.0'} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
//                   )}
//                 </div>
//                 <Link href={`/product/${slug}/reviews`}>
//                   <span className="text-rose-600 hover:text-rose-800 text-sm font-medium hover:underline transition-colors">
//                     See all reviews →
//                   </span>
//                 </Link>
//               </div>

//               {/* Description */}
//               <p className="text-gray-700 leading-relaxed mb-6 text-base">{product.desc}</p>

//               {/* Variant Selectors */}
//               {(color !== '' || size !== '') && (
//                 <div className="mb-6 pb-6 border-b border-rose-100">
//                   <div className="space-y-4">
//                     {/* Color Selector */}
//                     {color !== '' && Object.keys(variants).length > 0 && (
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                           Select Color
//                         </label>
//                         <div className="flex gap-3">
//                           {Object.keys(variants).includes('White') && Object.keys(variants['White']).includes(size) && (
//                             <button
//                               onClick={() => refreshVarient(size, 'White')}
//                               className={`relative bg-white border-2 rounded-lg w-10 h-10 focus:outline-none transition-all duration-200 hover:scale-105 ${
//                                 color === 'White' ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-300 hover:border-rose-300'
//                               }`}
//                               title="White"
//                             >
//                               {color === 'White' && (
//                                 <span className="absolute inset-0 flex items-center justify-center">
//                                   <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
//                                 </span>
//                               )}
//                             </button>
//                           )}
//                           {Object.keys(variants).includes('Silver') && Object.keys(variants['Silver']).includes(size) && (
//                             <button
//                               onClick={() => refreshVarient(size, 'Silver')}
//                               className={`relative bg-[#C0C0C0] border-2 rounded-lg w-10 h-10 focus:outline-none transition-all duration-200 hover:scale-105 ${
//                                 color === 'Silver' ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-300 hover:border-rose-300'
//                               }`}
//                               title="Silver"
//                             >
//                               {color === 'Silver' && (
//                                 <span className="absolute inset-0 flex items-center justify-center">
//                                   <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
//                                 </span>
//                               )}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {/* Size Selector */}
//                     {size !== '' && Object.keys(variants[color] || {}).length > 0 && (
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                           Select Size
//                         </label>
//                         <div className="relative inline-block">
//                           <select
//                             value={size}
//                             onChange={(e) => refreshVarient(e.target.value, color)}
//                             className="appearance-none bg-white border-2 border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-base font-medium text-gray-700 cursor-pointer hover:border-rose-300 transition-colors"
//                           >
//                             {Object.keys(variants[color] || {}).map((sz) => (
//                               <option key={sz} value={sz}>
//                                 {sz}
//                               </option>
//                             ))}
//                           </select>
//                           <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                             <svg
//                               className="w-5 h-5 text-gray-500"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               viewBox="0 0 24 24"
//                             >
//                               <path d="M6 9l6 6 6-6"></path>
//                             </svg>
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Stock Status */}
//               <div className="mb-6">
//                 {product.availableQty > 0 ? (
//                   <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
//                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                     <span className="text-green-700 font-semibold text-sm">
//                       In Stock - Ready to Ship
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
//                     <span className="w-2 h-2 bg-red-500 rounded-full"></span>
//                     <span className="text-red-700 font-semibold text-sm">
//                       Out of Stock
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Price & Action Buttons */}
//               <div className="mb-6">
//                 <div className="flex items-baseline gap-3 mb-6">
//                   <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
//                   <span className="text-sm text-gray-500">Inclusive of all taxes</span>
//                 </div>

//                 <div className="flex flex-wrap gap-4">
//                   <button
//                     onClick={() => buyNow(slug, 1, product.price, product.title, size, color, product.img)}
//                     disabled={product.availableQty <= 0}
//                     className={`flex-1 min-w-[140px] py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
//                       product.availableQty > 0
//                         ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
//                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     }`}
//                   >
//                     Buy Now
//                   </button>
//                   <button
//                     onClick={() => addToCart(slug, 1, product.price, product.title, size, color, product.img)}
//                     disabled={product.availableQty <= 0}
//                     className={`flex-1 min-w-[140px] py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
//                       product.availableQty > 0
//                         ? 'bg-white border-2 border-rose-500 text-rose-600 hover:bg-rose-50 shadow-md hover:shadow-lg'
//                         : 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
//                     }`}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>

//               {/* Pincode Check */}
//               <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-rose-100">
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                   Check Delivery Availability
//                 </label>
//                 <div className="flex gap-3">
//                   <input
//                     onChange={onChangePin}
//                     className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-base bg-white"
//                     placeholder="Enter pincode"
//                     type="text"
//                   />
//                   <button
//                     onClick={chackServiceability}
//                     className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap"
//                   >
//                     Check
//                   </button>
//                 </div>
//                 {(!service && service != null) && (
//                   <div className="flex items-start gap-2 mt-3 text-red-700 text-sm bg-red-50 p-3 rounded-lg">
//                     <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                     </svg>
//                     <span>Sorry! We do not deliver to this pincode yet.</span>
//                   </div>
//                 )}
//                 {(service && service != null) && (
//                   <div className="flex items-start gap-2 mt-3 text-green-700 text-sm bg-green-50 p-3 rounded-lg">
//                     <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <span>Great! This pincode is serviceable.</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Reviews Section */}
//           <div className="mt-16 border-t border-rose-100 pt-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

//             {reviewsLoading && (
//               <div className="flex items-center justify-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
//               </div>
//             )}

//             {!reviewsLoading && reviewsError && (
//               <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
//                 {reviewsError}
//               </div>
//             )}

//             {!reviewsLoading && !reviewsError && reviews.length === 0 && (
//               <div className="bg-white/50 backdrop-blur-sm rounded-xl p-12 text-center border border-rose-100">
//                 <svg className="w-16 h-16 text-rose-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
//                 </svg>
//                 <p className="text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
//               </div>
//             )}

//             {!reviewsLoading && reviews.length > 0 && (
//               <div className="space-y-6">
//                 {reviews.map((r) => (
//                   <div key={r._id} className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <div className="font-semibold text-gray-900 text-lg mb-1">
//                           {r.user?.name || 'Anonymous'}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <Star key={i} filled={i < (r.rating || 0)} />
//                           ))}
//                           <span className="text-sm font-medium text-gray-600">
//                             {r.rating ? r.rating : '-'}/5
//                           </span>
//                         </div>
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {new Date(r.createdAt).toLocaleDateString('en-US', { 
//                           year: 'numeric', 
//                           month: 'short', 
//                           day: 'numeric' 
//                         })}
//                       </div>
//                     </div>

//                     {r.comment && (
//                       <div className="text-gray-700 leading-relaxed mb-4">
//                         {r.comment}
//                       </div>
//                     )}

//                     {/* Review images */}
//                     {r.images && r.images.length > 0 && (
//                       <div className="flex gap-3 overflow-x-auto pb-2">
//                         {r.images.map((imgUrl, idx) => (
//                           <a
//                             key={idx}
//                             href={imgUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex-shrink-0 group"
//                             title={`Open image ${idx + 1}`}
//                           >
//                             <img
//                               src={imgUrl}
//                               alt={`Review image ${idx + 1} by ${r.user?.name || 'user'}`}
//                               className="w-24 h-24 object-cover rounded-lg border-2 border-rose-100 group-hover:border-rose-400 transition-colors duration-200"
//                             />
//                           </a>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
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
//   console.log(product)
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
  <svg className={`w-5 h-5 inline-block ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.49 2.381c-.784.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.523 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
  </svg>
)

const Post = ({
  buyNow,
  addToCart,
  product = {},
  variants = {},
  wishlist = {},
  addToWishlist,
  removeFromWishlist,
  addToRecentlyViewed,
  user
}) => {
  const router = useRouter()
  const { slug } = router.query
  const [pin, setpin] = useState('')
  const [service, setservice] = useState(null)

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState(null)

  // Add product to recently viewed when component mounts
  useEffect(() => {
    if (product && product._id && addToRecentlyViewed) {
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
  }, [product && product._id])

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
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/pincode?pincode=${pin}`
    );

    let data = await res.json();

    const isServiceable =
      data?.delivery_codes &&
      data.delivery_codes.length > 0 &&
      data.delivery_codes[0]?.postal_code?.pin;

    if (isServiceable) {
      setservice(true);
      toast.success("Your pincode is serviceable!", {
        position: "bottom-center",
        autoClose: 1000,
      });
    } else {
      setservice(false);
      toast.error("Sorry, your pincode is not serviceable!", {
        position: "bottom-center",
        autoClose: 1000,
      });
    }
  } catch (err) {
    console.error(err);
    toast.error("Could not check pincode.", {
      position: "bottom-center",
      autoClose: 1000,
    });
    setservice(null);
  }
};


  const onChangePin = (e) => {
    setpin(e.target.value)
  }

  // defensive defaults - product may be {} during SSR hydration
  const [color, setColor] = useState(product?.color || '')
  const [size, setSize] = useState(product?.size || '')

  const refreshVarient = (newsize, newcolor) => {
    // guard access to variants
    if (variants?.[newcolor] && variants[newcolor][newsize] && variants[newcolor][newsize].slug) {
      let url = `${process.env.NEXT_PUBLIC_HOST || ''}/product/${variants[newcolor][newsize]['slug']}`
      // use router when available (client-only)
      if (typeof window !== 'undefined') {
        window.location = url;
      } else {
        router.push(url)
      }
    } else {
      toast.error('Variant not available', { position: 'bottom-center', autoClose: 1200 })
    }
  }

  const handleWishlistToggle = () => {
    if (!product || !product._id) return
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

  const isInWishlist = !!(product && product._id && (product._id in wishlist));

  // Share handler: use Web Share API if available, otherwise copy link to clipboard
  const handleShare = async () => {
    const shareData = {
      title: product?.title || 'Product',
      text: `Check out this product: ${product?.title || ''} (${product?.size || ''}/${product?.color || ''})`,
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
        // last resort prompt
        window.prompt('Copy this link to share:', shareData.url)
      }
    } catch (err) {
      console.error('Share failed:', err)
      toast.error('Could not share the product. Try copying the link manually.', { position: 'bottom-center', autoClose: 1500 })
    }
  }

  // Handle Buy Now with login check
  const handleBuyNow = () => {
    // Check if user is logged in
    if (!user || !user.value) {
      // Add product to cart first (guard)
      if (addToCart) addToCart(slug, 1, product.price, product.title, size, color, product.img);

      // Show message
      toast.info('Please login to complete your purchase', {
        position: "bottom-center",
        autoClose: 1500,
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else {
      // User is logged in, proceed with normal buy now flow
      if (buyNow) buyNow(slug, 1, product.price, product.title, size, color, product.img);
    }
  };

  // ---------------------------
  // Image gallery (React state)
  // ---------------------------
  const initialImages = (product && product.images && product.images.length > 0)
    ? product.images
    : (product && product.img ? [product.img] : []);

  const [galleryImages, setGalleryImages] = useState(initialImages);
  const [mainImage, setMainImage] = useState(initialImages[0] || '');
  const [currentIndex, setCurrentIndex] = useState(0);

  // keep gallery in sync when product prop changes (SSR -> CSR)
  useEffect(() => {
    const imgs = (product && product.images && product.images.length > 0)
      ? product.images
      : (product && product.img ? [product.img] : []);
    setGalleryImages(imgs);
    setCurrentIndex(0);
    setMainImage(imgs[0] || '');
  }, [product && product._id]);

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <>
      <section className="body-font pt-32" style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}>
        <ToastContainer position="bottom-center" autoClose={1000} />
        <div className="container px-5 py-12 mx-auto max-w-7xl">
          <div className="lg:flex lg:gap-12">
            {/* Image Section (full, uses mainImage, galleryImages, currentIndex) */}
            <div className="lg:w-1/2 w-full ">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="relative">
                  <img
                    alt={product?.title || 'product'}
                    className="w-full h-full object-contain bg-white"
                    src={mainImage || (galleryImages[0] || '')}
                  />

                  {/* Prev / Next buttons */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          const nextIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                          setCurrentIndex(nextIndex);
                          setMainImage(galleryImages[nextIndex]);
                        }}
                        aria-label="Previous image"
                        className="hidden lg:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md hover:bg-white transition"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => {
                          const nextIndex = (currentIndex + 1) % galleryImages.length;
                          setCurrentIndex(nextIndex);
                          setMainImage(galleryImages[nextIndex]);
                        }}
                        aria-label="Next image"
                        className="hidden lg:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md hover:bg-white transition"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Action Buttons - Wishlist & Share */}
                  <div className="absolute top-6 right-6 flex gap-3 z-10">
                    <button
                      onClick={handleWishlistToggle}
                      className="bg-white hover:bg-rose-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-rose-100"
                      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isInWishlist ? (
                        <AiFillHeart className="text-rose-500 text-2xl" />
                      ) : (
                        <AiOutlineHeart className="text-rose-400 hover:text-rose-500 text-2xl transition-colors" />
                      )}
                    </button>

                    <button
                      onClick={handleShare}
                      className="bg-white hover:bg-rose-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-rose-100"
                      title="Share product"
                      aria-label="Share product"
                    >
                      <PiShareFatLight className="text-rose-400 text-2xl" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail strip */}
                <div className="px-4 py-3 border-t border-rose-100 bg-white">
                  <div className="flex gap-3 overflow-x-auto py-2">
                    {galleryImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setMainImage(imgUrl);
                        }}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 focus:outline-none transition-all duration-150 ${
                          currentIndex === idx ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-200'
                        }`}
                        title={`View image ${idx + 1}`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product?.title || 'product'} - ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="lg:w-1/2 w-full">
              <div className="mb-4">
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  Brand Name
                </span>
              </div>

              <h1 className="text-gray-900 text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                {product?.title || 'Product'}
              </h1>

              <div className="text-sm text-gray-600 mb-4">
                <span className="inline-block bg-white px-3 py-1 rounded-full mr-2 border border-rose-100">
                  Size: {product?.size || '-'}
                </span>
                <span className="inline-block bg-white px-3 py-1 rounded-full border border-rose-100">
                  Color: {product?.color || '-'}
                </span>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-rose-100">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < Math.round(averageRating)} />
                  ))}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {reviewsLoading ? (
                    <span>Loading...</span>
                  ) : (
                    <span>{averageRating ? averageRating.toFixed(1) : '0.0'} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                  )}
                </div>
                <Link href={`/product/${slug}/reviews`}>
                  <span className="text-rose-600 hover:text-rose-800 text-sm font-medium hover:underline transition-colors">
                    See all reviews →
                  </span>
                </Link>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-6 text-base" dangerouslySetInnerHTML={{ __html: product.desc || '' }} />

              {/* Variant Selectors */}
              {(color !== '' || size !== '') && (
                <div className="mb-6 pb-6 border-b border-rose-100">
                  <div className="space-y-4">
                    {/* Color Selector */}
                    {color !== '' && Object.keys(variants || {}).length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Select Color
                        </label>
                        <div className="flex gap-3">
                          {Object.keys(variants).includes('White') && Object.keys(variants['White'] || {}).includes(size) && (
                            <button
                              onClick={() => refreshVarient(size, 'White')}
                              className={`relative bg-white border-2 rounded-lg w-10 h-10 focus:outline-none transition-all duration-200 hover:scale-105 ${
                                color === 'White' ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-300 hover:border-rose-300'
                              }`}
                              title="White"
                            >
                              {color === 'White' && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                </span>
                              )}
                            </button>
                          )}
                          {Object.keys(variants).includes('Silver') && Object.keys(variants['Silver'] || {}).includes(size) && (
                            <button
                              onClick={() => refreshVarient(size, 'Silver')}
                              className={`relative bg-[#C0C0C0] border-2 rounded-lg w-10 h-10 focus:outline-none transition-all duration-200 hover:scale-105 ${
                                color === 'Silver' ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-300 hover:border-rose-300'
                              }`}
                              title="Silver"
                            >
                              {color === 'Silver' && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Size Selector */}
                    {size !== '' && Object.keys(variants[color] || {}).length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Select Size
                        </label>
                        <div className="relative inline-block">
                          <select
                            value={size}
                            onChange={(e) => refreshVarient(e.target.value, color)}
                            className="appearance-none bg-white border-2 border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-base font-medium text-gray-700 cursor-pointer hover:border-rose-300 transition-colors"
                          >
                            {Object.keys(variants[color] || {}).map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 9l6 6 6-6"></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {product?.availableQty > 0 ? (
                  <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-700 font-semibold text-sm">
                      In Stock - Ready to Ship
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-red-700 font-semibold text-sm">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Action Buttons */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹{product?.price || '0'}</span>
                  <span className="text-sm text-gray-500">Inclusive of all taxes</span>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleBuyNow}
                    disabled={!(product?.availableQty > 0)}
                    className={`flex-1 min-w-[140px] py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
                      product?.availableQty > 0
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => addToCart && addToCart(slug, 1, product?.price, product?.title, size, color, product?.img)}
                    disabled={!(product?.availableQty > 0)}
                    className={`flex-1 min-w-[140px] py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${
                      product?.availableQty > 0
                        ? 'bg-white border-2 border-rose-500 text-rose-600 hover:bg-rose-50 shadow-md hover:shadow-lg'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Pincode Check */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-rose-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Check Delivery Availability
                </label>
                <div className="flex gap-3">
                  <input
                    value={pin}
                    onChange={onChangePin}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-base bg-white"
                    placeholder="Enter pincode"
                    type="text"
                  />
                  <button
                    onClick={chackServiceability}
                    className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap"
                  >
                    Check
                  </button>
                </div>
                {(!service && service != null) && (
                  <div className="flex items-start gap-2 mt-3 text-red-700 text-sm bg-red-50 p-3 rounded-lg">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Sorry! We do not deliver to this pincode yet.</span>
                  </div>
                )}
                {(service && service != null) && (
                  <div className="flex items-start gap-2 mt-3 text-green-700 text-sm bg-green-50 p-3 rounded-lg">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Great! This pincode is serviceable.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 border-t border-rose-100 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

            {reviewsLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
              </div>
            )}

            {!reviewsLoading && reviewsError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
                {reviewsError}
              </div>
            )}

            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-12 text-center border border-rose-100">
                <svg className="w-16 h-16 text-rose-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <p className="text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
              </div>
            )}

            {!reviewsLoading && reviews.length > 0 && (
              <div className="space-y-6">
                {reviews.map((r) => (
                  <div key={r._id} className="bg-white/70 backdrop-blur-sm border border-rose-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold text-gray-900 text-lg mb-1">
                          {r.user?.name || 'Anonymous'}
                        </div>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} filled={i < (r.rating || 0)} />
                          ))}
                          <span className="text-sm font-medium text-gray-600">
                            {r.rating ? r.rating : '-'}/5
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    {r.comment && (
                      <div className="text-gray-700 leading-relaxed mb-4">
                        {r.comment}
                      </div>
                    )}

                    {/* Review images */}
                    {r.images && r.images.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {r.images.map((imgUrl, idx) => (
                          <a
                            key={idx}
                            href={imgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 group"
                            title={`Open image ${idx + 1}`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Review image ${idx + 1} by ${r.user?.name || 'user'}`}
                              className="w-24 h-24 object-cover rounded-lg border-2 border-rose-100 group-hover:border-rose-400 transition-colors duration-200"
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

  // fetch product
  let product = await Product.findOne({ slug: context.query.slug })

  // if no product, return 404 immediately before trying to use product.title
  if (!product) {
    return {
      notFound: true,
    }
  }

  // now safe to query variants using product.title and product.category
  let variantsRaw = await Product.find({ title: product.title, category: product.category })
  let colorSizeSlug = {}

  // Build mapping: color -> size -> { slug, price, availableQty, img }
  for (let item of variantsRaw) {
    if (!colorSizeSlug[item.color]) {
      colorSizeSlug[item.color] = {}
    }
    colorSizeSlug[item.color][item.size] = {
      slug: item.slug,
      price: item.price,
      availableQty: item.availableQty,
      img: (item.images && item.images[0]) || item.img || ''
    }
  }

  // Convert mongoose documents to plain JS objects for serialization
  const prodObj = JSON.parse(JSON.stringify(product))

  return {
    props: {
      product: prodObj,
      variants: colorSizeSlug
    }
  }
}

export default Post
