// import { useRouter } from 'next/router'
// import { useState } from 'react'
// import mongoose from 'mongoose'
// import Product from '@/models/Product'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const Post = ({ buyNow, addToCart, product, variants }) => {
//   console.log(product, variants)
//   const router = useRouter()
//   const { slug } = router.query
//   const [pin, setpin] = useState()
//   const [service, setservice] = useState()



//   const chackServiceability = async () => {
//     let pins = await fetch(`${process.env.HOST}/api/pincode`)
//     let pinJson = await pins.json()
//     if (pinJson.includes(parseInt(pin))) {
//       setservice(true)
//       toast.success('Your pincode is serviceable!', {
//         position: "bottom-center",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
       
//       });
//     }
//     else {
//       setservice(false)
//       toast.error('sorry, Your pincode is not serviceable!', {
//         position: "bottom-center",
//         autoClose: 1000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
        
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


//   return <>
//     <section className="text-gray-600 body-font overflow-hidden">
//       <ToastContainer
//         position="bottom-center"
//         autoClose={1000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover />
//       <div className="container px-5 py-16 mx-auto">
//         <div className="lg:w-4/5 mx-auto flex flex-wrap">
//           <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto px-24 object-cover object-top rounded" src={product.img} />
//           <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
//             <h2 className="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
//             <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.title}({product.size}/{product.color})</h1>
//             <div className="flex mb-4">

//             </div>
//             <p className="leading-relaxed">{product.desc}</p>
//             <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
//               <div className="flex">
//                 <span className="mr-3">Color</span>
                
//                 {Object.keys(variants).includes('White') && Object.keys(variants['White']).includes(size) && < button onClick={() => { refreshVarient(size, 'White') }} className={`order-2  rounded-full w-6 h-6 focus:outline-none ${color == 'White' ? 'border-black' : 'border-gray-300'}`}></button>}
               
//                 {Object.keys(variants).includes('Silver') && Object.keys(variants['Silver']).includes(size) && < button onClick={() => { refreshVarient(size, 'Silver') }} className={`order-2 bg-[#C0C0C0] rounded-full w-6 h-6 focus:outline-none ${color == 'Silver' ? 'border-black' : 'border-gray-300'}`}></button>}

//                 {Object.keys(variants).includes('Red') && Object.keys(variants['Red']).includes(size) && < button onClick={() => { refreshVarient(size, 'Red') }} className={`border-2  ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none ${color == 'Red' ? 'border-black' : 'border-gray-300'}`}></button>}

//                 {Object.keys(variants).includes('Black') && Object.keys(variants['Black']).includes(size) && < button onClick={() => { refreshVarient(size, 'Black') }} className={`border-2  ml-1 bg-black rounded-full w-6 h-6 focus:outline-none ${color == 'Black' ? 'border-black' : 'border-gray-300'}`}></button>}

//                 {Object.keys(variants).includes('Green') && Object.keys(variants['Green']).includes(size) && < button onClick={() => { refreshVarient(size, 'Green') }} className={`border-2  ml-1 bg-green-700 rounded-full w-6 h-6 focus:outline-none ${color == 'Green' ? 'border-black' : 'border-gray-300'}`}></button>}

//                 {Object.keys(variants).includes('Blue') && Object.keys(variants['Blue']).includes(size) && < button onClick={() => { refreshVarient(size, 'Blue') }} className={`border-2  ml-1 bg-blue-700 rounded-full w-6 h-6 focus:outline-none ${color == 'Blue' ? 'border-black' : 'border-gray-300'}`}></button>}

//                 {Object.keys(variants).includes('Yello') && Object.keys(variants['Yello']).includes(size) && < button onClick={() => { refreshVarient(size, 'Yello') }} className={`border-2  ml-1 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none ${color == 'Yello' ? 'border-black' : 'border-gray-300'}`}></button>}
//               </div>
//               <div className="flex ml-6 items-center">
//                 <span className="mr-3">Size</span>
//                 <div className="relative">

//                   <select value={size} onChange={(e) => { refreshVarient(e.target.value, color) }} className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">

//                     {Object.keys(variants[color]).includes('S') && <option value={'S'}>S</option>}
//                     {Object.keys(variants[color]).includes('Standard') && <option value={'Standard'}>Standard</option>}
//                     {Object.keys(variants[color]).includes('M') && <option value={'M'}>M</option>}
//                     {Object.keys(variants[color]).includes('L') && <option value={'L'}>L</option>}
//                     {Object.keys(variants[color]).includes('XL') && <option value={'XL'}>XL</option>}
//                     {Object.keys(variants[color]).includes('XXL') && <option value={'XXL'}>XXL</option>}

//                   </select>

//                   <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
//                     <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4" viewBox="0 0 24 24">
//                       <path d="M6 9l6 6 6-6"></path>
//                     </svg>
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex">
//               <span className="title-font font-medium text-2xl text-gray-900">₹{product.price}</span>
//               <button onClick={() => { buyNow(slug, 1, product.price, product.title, size, color) }} className="flex ml-8 text-white bg-indigo-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-indigo-600 rounded">Buy Now</button>
//               <button onClick={() => { addToCart(slug, 1, product.price, product.title, size, color) }} className="flex ml-4 text-white bg-indigo-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-indigo-600 rounded">Add to Cart</button>

//               {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
//                 <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
//                   <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
//                 </svg>
//               </button> */}

//             </div>
//             <div className='pin mt-6 flex space-x-2 text-sm'>
//               <input onChange={onChangePin} className="px-2 border-2 border-black-700 rounded-md" placeholder='Enter your pincode' type='text' />
//               <button onClick={chackServiceability} className="flex ml-14 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">check</button>
//             </div>
//             {(!service && service != null) && <div className='text-red-700 text-sm mt-3'>
//               sorry! WE do not deliver to this pincode yet
//             </div>}
//             {(service && service != null) && <div className='text-green-700 text-sm mt-3'>
//               yet! This pin code is serviceable
//             </div>}
//           </div>
//         </div>
//       </div>
//     </section>

//   </>
// }
// export async function getServerSideProps(context) {
//   if (!mongoose.connections[0].readyState) {
//     await mongoose.connect(process.env.MONGO_URI)
//   }
//   let product = await Product.findOne({ slug: context.query.slug })
//   let variants = await Product.find({ title: product.title, category:product.category })
//   let colorSizeSlug = {}
//   for (let item of variants) {
//     if (Object.keys(colorSizeSlug).includes(item.color)) {
//       colorSizeSlug[item.color][item.size] = { slug: item.slug }
//     }
//     else {
//       colorSizeSlug[item.color] = {}
//       colorSizeSlug[item.color][item.size] = { slug: item.slug }
//     }
//   }


//   return {
//     props: { product: JSON.parse(JSON.stringify(product)), variants: JSON.parse(JSON.stringify(colorSizeSlug)) }, // will be passed to the page component as props
//   }
// }

// export default Post


// import { useRouter } from 'next/router'
// import { useState } from 'react'
// import mongoose from 'mongoose'
// import Product from '@/models/Product'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Post = ({ buyNow, addToCart, product, variants }) => {
//   console.log(product, variants)
//   const router = useRouter()
//   const { slug } = router.query
//   const [pin, setpin] = useState()
//   const [service, setservice] = useState()

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

//   return (
//     <>
//       <section className="text-gray-600 body-font overflow-hidden">
//         <ToastContainer position="bottom-center" autoClose={1000} />
//         <div className="container px-5 py-16 mx-auto">
//           <div className="lg:w-4/5 mx-auto flex flex-wrap">
//             <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto px-24 object-cover object-top rounded" src={product.img} />
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

//               <div className="flex">
//                 <span className="title-font font-medium text-2xl text-gray-900">₹{product.price}</span>
//                 <button
//                   onClick={() => buyNow(slug, 1, product.price, product.title, size, color, product.img)}
//                   className="flex ml-8 text-white bg-indigo-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-indigo-600 rounded"
//                 >
//                   Buy Now
//                 </button>
//                 <button
//                   onClick={() => addToCart(slug, 1, product.price, product.title, size, color, product.img)}
//                   className="flex ml-4 text-white bg-indigo-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-indigo-600 rounded"
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

              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">₹{product.price}</span>
                <button
                  onClick={() => buyNow(slug, 1, product.price, product.title, size, color, product.img)}
                  className="flex ml-8 text-white bg-indigo-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-indigo-600 rounded"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => addToCart(slug, 1, product.price, product.title, size, color, product.img)}
                  className="flex ml-4 text-white bg-indigo-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-indigo-600 rounded"
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
