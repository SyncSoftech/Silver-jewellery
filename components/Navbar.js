

// import React, { useRef, useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { CiShoppingCart } from "react-icons/ci";
// import { AiFillCloseCircle, AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
// import { BsBagCheckFill } from "react-icons/bs";
// import { MdAccountCircle } from "react-icons/md";
// import { HiOutlineShoppingBag } from "react-icons/hi";

// const Navbar = ({Logout, user, cart, addToCart, removeFromCart, clearCart, subTotal }) => {
//   const [dropdown, setDropdown] = useState(false)
  
//   const toggleCart = () => {
//     if (ref.current.classList.contains('translate-x-full')) {
//       ref.current.classList.remove('translate-x-full')
//       ref.current.classList.add('translate-x-0')
//     }
//     else if (!ref.current.classList.contains('translate-x-full')) {
//       ref.current.classList.remove('translate-x-0')
//       ref.current.classList.add('translate-x-full')
//     }
//   }
  
//   const ref = useRef()
//   const cartItemCount = Object.keys(cart).reduce((acc, k) => acc + cart[k].qty, 0)

//   return (
//     <div className='flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 bg-white z-50'>
//       <div className="logo md:mx-5 cursor-pointer mr-auto">
//         <Link href={'/'}><Image width={200} height={40} src="/LOGO.jpg" alt="Logo" /></Link>
//       </div>
//       <div className="nav">
//         <ul className='flex items-center space-x-6 font-semibold md:text-xl'>
//           <Link href={'/bracelets'}><span className='hover:text-blue-600 transition-colors'><li>Bracelets</li></span></Link>
//           <Link href={'/earings'}><span className='hover:text-blue-600 transition-colors'><li>Earings</li></span></Link>
//           <Link href={'/necklaces'}><span className='hover:text-blue-600 transition-colors'><li>Necklaces</li></span></Link>
//           <Link href={'/rings'}><span className='hover:text-blue-600 transition-colors'><li>Rings</li></span></Link>
//         </ul>
//       </div>
//       <div className='cart absolute right-0 mx-5 top-4 cursor-pointer flex'>
//         <span onMouseOver={() => {setDropdown(true)}} onMouseLeave={() => {setDropdown(false)}}>
//           {dropdown && (
//             <div 
//               onMouseOver={() => {setDropdown(true)}} 
//               onMouseLeave={() => {setDropdown(false)}} 
//               className='absolute right-8 bg-white shadow-2xl top-7 rounded-md px-5 py-4 w-32'
//             >
//               <ul>
//                 <Link href={'/myaccount'}><li className='py-1 hover:text-blue-700 transition-colors text-sm font-bold'>My Account</li></Link>
//                 <Link href={'/orders'}><li className='py-1 hover:text-blue-700 transition-colors text-sm font-bold'>Orders</li></Link>
//                 <span><li onClick={Logout} className='py-1 hover:text-blue-700 transition-colors text-sm font-bold cursor-pointer'>LogOut</li></span>
//               </ul>
//             </div>
//           )}
//           {user.value && <MdAccountCircle className='text-2xl font-bold md:text-3xl mx-2 hover:text-blue-600 transition-colors' />}
//         </span>

//         {!user.value && (
//           <Link href={'/login'}>
//             <div>
//               <button className='bg-blue-600 px-2 py-1 rounded-md text-sm text-white mx-2 hover:bg-blue-700 transition-colors'>Login</button>
//             </div>
//           </Link>
//         )}

//         <div className='relative'>
//           <CiShoppingCart onClick={toggleCart} className='text-2xl font-bold md:text-3xl hover:text-blue-600 transition-colors' />
//           {cartItemCount > 0 && (
//             <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
//               {cartItemCount}
//             </span>
//           )}
//         </div>
//       </div>

//         <div ref={ref} className={`w-80 h-[100vh] sideCart overflow-y-auto absolute top-0 right-0 bg-gradient-to-b from-white to-pink-50 shadow-2xl transform transition-transform duration-300 ${Object.keys(cart).length !== 0 ? 'translate-x-0' : 'translate-x-full'}`} style={{
//         scrollbarWidth: 'thin',
//         scrollbarColor: '#cbd5e1 #f1f5f9'
//       }}> {/* Cart Header */}
//         <div className='sticky top-0 bg-white shadow-sm px-6 py-4 border-b border-gray-200 z-10'>
//           <h2 className='font-bold text-2xl text-gray-800 flex items-center justify-center'>
//             <HiOutlineShoppingBag className='mr-2 text-blue-600' />
//             Shopping Cart
//           </h2>
//           <span onClick={toggleCart} className='absolute top-4 right-4 cursor-pointer text-2xl text-gray-600 hover:text-red-500 transition-colors'>
//             <AiFillCloseCircle />
//           </span>
//         </div>

//         {/* Cart Items */}
//         <div className='px-6 py-4'>
//           {Object.keys(cart).length === 0 ? (
//             <div className='flex flex-col items-center justify-center py-12'>
//               <HiOutlineShoppingBag className='text-6xl text-gray-300 mb-4' />
//               <p className='text-gray-500 font-medium text-lg'>Your cart is empty</p>
//               <p className='text-gray-400 text-sm mt-2'>Add some items to get started!</p>
//             </div>
//           ) : (
//             <div className='space-y-4'>
//               {Object.keys(cart).map((k) => {
//                 return (
//                   <div key={k} className='bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow'>
//                     <div className='flex flex-col gap-3'>
//                       {/* Product Details */}
//                       <div>
//                         <h3 className='font-semibold text-gray-800 text-base leading-tight mb-2'>
//                           {cart[k].name}
//                         </h3>
//                         {(cart[k].size || cart[k].variant) && (
//                           <p className='text-sm text-gray-500'>
//                             {cart[k].size && <span>Size: <span className='font-medium'>{cart[k].size}</span></span>}
//                             {cart[k].size && cart[k].variant && <span> | </span>}
//                             {cart[k].variant && <span>Color: <span className='font-medium'>{cart[k].variant}</span></span>}
//                           </p>
//                         )}
//                       </div>
                      
//                       <div className='flex justify-between items-center'>
//                         <div className='flex items-center bg-gray-100 rounded-full px-3 py-1.5'>
//                           <AiOutlineMinusCircle 
//                             onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
//                             className='cursor-pointer text-gray-600 hover:text-red-500 transition-colors text-xl'
//                           />
//                           <span className='mx-3 text-sm font-bold text-gray-800 min-w-[20px] text-center'>
//                             {cart[k].qty}
//                           </span>
//                           <AiOutlinePlusCircle 
//                             onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
//                             className='cursor-pointer text-gray-600 hover:text-green-500 transition-colors text-xl'
//                           />
//                         </div>
//                         <div className='font-bold text-gray-800 text-lg'>
//                           ₹{cart[k].price * cart[k].qty}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {/* Cart Footer */}
//         {Object.keys(cart).length > 0 && (
//           <div className='sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg'>
//             <div className='flex justify-between items-center mb-4 pb-3 border-b border-gray-200'>
//               <span className='text-gray-600 font-medium'>Subtotal:</span>
//               <span className='text-2xl font-bold text-gray-800'>₹{subTotal}</span>
//             </div>
            
//             <div className='space-y-2'>
//               <Link href={'/checkout'}>
//                 <button className="w-full flex items-center justify-center text-white bg-blue-600 border-0 py-3 px-4 focus:outline-none hover:bg-blue-700 rounded-lg text-base font-semibold transition-colors shadow-md">
//                   <BsBagCheckFill className="mr-2" />
//                   Checkout
//                 </button>
//               </Link>
//               <button 
//                 onClick={clearCart} 
//                 className="w-full flex items-center justify-center text-gray-700 bg-gray-200 border-0 py-2 px-4 focus:outline-none hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
//               >
//                 Clear Cart
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Navbar


// import React, { useRef, useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { CiShoppingCart } from "react-icons/ci";
// import { AiFillCloseCircle, AiOutlinePlusCircle, AiOutlineMinusCircle, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
// import { BsBagCheckFill } from "react-icons/bs";
// import { MdAccountCircle } from "react-icons/md";
// import { HiOutlineShoppingBag } from "react-icons/hi";

// const Navbar = ({
//   Logout,
//   user,
//   cart,
//   addToCart,
//   removeFromCart,
//   clearCart,
//   subTotal,
//   wishlist = {},
//   removeFromWishlist,
//   clearWishlist,
//   moveToCart
// }) => {
//   const [dropdown, setDropdown] = useState(false)
  
//   const toggleCart = () => {
//     // Close wishlist if open
//     if (wishlistRef.current && !wishlistRef.current.classList.contains('translate-x-full')) {
//       wishlistRef.current.classList.remove('translate-x-0')
//       wishlistRef.current.classList.add('translate-x-full')
//     }

//     if (ref.current.classList.contains('translate-x-full')) {
//       ref.current.classList.remove('translate-x-full')
//       ref.current.classList.add('translate-x-0')
//     }
//     else if (!ref.current.classList.contains('translate-x-full')) {
//       ref.current.classList.remove('translate-x-0')
//       ref.current.classList.add('translate-x-full')
//     }
//   }

//   const toggleWishlist = () => {
//     // Close cart if open
//     if (ref.current && !ref.current.classList.contains('translate-x-full')) {
//       ref.current.classList.remove('translate-x-0')
//       ref.current.classList.add('translate-x-full')
//     }

//     if (wishlistRef.current.classList.contains('translate-x-full')) {
//       wishlistRef.current.classList.remove('translate-x-full')
//       wishlistRef.current.classList.add('translate-x-0')
//     }
//     else if (!wishlistRef.current.classList.contains('translate-x-full')) {
//       wishlistRef.current.classList.remove('translate-x-0')
//       wishlistRef.current.classList.add('translate-x-full')
//     }
//   }
  
//   const ref = useRef()
//   const wishlistRef = useRef()
//   const cartItemCount = Object.keys(cart).reduce((acc, k) => acc + cart[k].qty, 0)
//   const wishlistItemCount = Object.keys(wishlist).length

//   return (
//     <div className='flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 bg-white z-50'>
//       <div className="logo md:mx-5 cursor-pointer mr-auto">
//         <Link href={'/'}><Image width={200} height={40} src="/LOGO.jpg" alt="Logo" /></Link>
//       </div>
//       <div className="nav">
//         <ul className='flex items-center space-x-6 font-semibold md:text-xl'>
//           <Link href={'/bracelets'}><span className='hover:text-blue-600 transition-colors'><li>Bracelets</li></span></Link>
//           <Link href={'/earings'}><span className='hover:text-blue-600 transition-colors'><li>Earings</li></span></Link>
//           <Link href={'/necklaces'}><span className='hover:text-blue-600 transition-colors'><li>Necklaces</li></span></Link>
//           <Link href={'/rings'}><span className='hover:text-blue-600 transition-colors'><li>Rings</li></span></Link>
//         </ul>
//       </div>
//       <div className='cart absolute right-0 mx-5 top-4 cursor-pointer flex'>
//         <span onMouseOver={() => {setDropdown(true)}} onMouseLeave={() => {setDropdown(false)}}>
//           {dropdown && (
//             <div 
//               onMouseOver={() => {setDropdown(true)}} 
//               onMouseLeave={() => {setDropdown(false)}} 
//               className='absolute right-8 bg-white shadow-2xl top-7 rounded-md px-5 py-4 w-32'
//             >
//               <ul>
//                 <Link href={'/myaccount'}><li className='py-1 hover:text-blue-700 transition-colors text-sm font-bold'>My Account</li></Link>
//                 <Link href={'/orders'}><li className='py-1 hover:text-blue-700 transition-colors text-sm font-bold'>Orders</li></Link>
//                 <span><li onClick={Logout} className='py-1 hover:text-blue-700 transition-colors text-sm font-bold cursor-pointer'>LogOut</li></span>
//               </ul>
//             </div>
//           )}
//           {user.value && <MdAccountCircle className='text-2xl font-bold md:text-3xl mx-2 hover:text-blue-600 transition-colors' />}
//         </span>

//         {!user.value && (
//           <Link href={'/login'}>
//             <div>
//               <button className='bg-blue-600 px-2 py-1 rounded-md text-sm text-white mx-2 hover:bg-blue-700 transition-colors'>Login</button>
//             </div>
//           </Link>
//         )}

//         {/* Wishlist Icon */}
//         <div className='relative mx-2'>
//           <AiOutlineHeart onClick={toggleWishlist} className='text-2xl font-bold md:text-3xl hover:text-red-500 transition-colors' />
//           {wishlistItemCount > 0 && (
//             <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
//               {wishlistItemCount}
//             </span>
//           )}
//         </div>

//         {/* Cart Icon */}
//         <div className='relative'>
//           <CiShoppingCart onClick={toggleCart} className='text-2xl font-bold md:text-3xl hover:text-blue-600 transition-colors' />
//           {cartItemCount > 0 && (
//             <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
//               {cartItemCount}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Cart Sidebar */}
//       <div ref={ref} className={`w-80 h-[100vh] sideCart overflow-y-auto absolute top-0 right-0 bg-gradient-to-b from-white to-pink-50 shadow-2xl transform transition-transform duration-300 ${Object.keys(cart).length !== 0 ? 'translate-x-0' : 'translate-x-full'}`} style={{
//         scrollbarWidth: 'thin',
//         scrollbarColor: '#cbd5e1 #f1f5f9'
//       }}>
//         {/* Cart Header */}
//         <div className='sticky top-0 bg-white shadow-sm px-6 py-4 border-b border-gray-200 z-10'>
//           <h2 className='font-bold text-2xl text-gray-800 flex items-center justify-center'>
//             <HiOutlineShoppingBag className='mr-2 text-blue-600' />
//             Shopping Cart
//           </h2>
//           <span onClick={toggleCart} className='absolute top-4 right-4 cursor-pointer text-2xl text-gray-600 hover:text-red-500 transition-colors'>
//             <AiFillCloseCircle />
//           </span>
//         </div>

//         {/* Cart Items */}
//         <div className='px-6 py-4'>
//           {Object.keys(cart).length === 0 ? (
//             <div className='flex flex-col items-center justify-center py-12'>
//               <HiOutlineShoppingBag className='text-6xl text-gray-300 mb-4' />
//               <p className='text-gray-500 font-medium text-lg'>Your cart is empty</p>
//               <p className='text-gray-400 text-sm mt-2'>Add some items to get started!</p>
//             </div>
//           ) : (
//             <div className='space-y-4'>
//               {Object.keys(cart).map((k) => {
//                 return (
//                   <div key={k} className='bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow'>
//                     <div className='flex flex-col gap-3'>
//                       {/* Product Details */}
//                       <div>
//                         <h3 className='font-semibold text-gray-800 text-base leading-tight mb-2'>
//                           {cart[k].name}
//                         </h3>
//                         {(cart[k].size || cart[k].variant) && (
//                           <p className='text-sm text-gray-500'>
//                             {cart[k].size && <span>Size: <span className='font-medium'>{cart[k].size}</span></span>}
//                             {cart[k].size && cart[k].variant && <span> | </span>}
//                             {cart[k].variant && <span>Color: <span className='font-medium'>{cart[k].variant}</span></span>}
//                           </p>
//                         )}
//                       </div>
                      
//                       <div className='flex justify-between items-center'>
//                         <div className='flex items-center bg-gray-100 rounded-full px-3 py-1.5'>
//                           <AiOutlineMinusCircle 
//                             onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
//                             className='cursor-pointer text-gray-600 hover:text-red-500 transition-colors text-xl'
//                           />
//                           <span className='mx-3 text-sm font-bold text-gray-800 min-w-[20px] text-center'>
//                             {cart[k].qty}
//                           </span>
//                           <AiOutlinePlusCircle 
//                             onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
//                             className='cursor-pointer text-gray-600 hover:text-green-500 transition-colors text-xl'
//                           />
//                         </div>
//                         <div className='font-bold text-gray-800 text-lg'>
//                           ₹{cart[k].price * cart[k].qty}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {/* Cart Footer */}
//         {Object.keys(cart).length > 0 && (
//           <div className='sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg'>
//             <div className='flex justify-between items-center mb-4 pb-3 border-b border-gray-200'>
//               <span className='text-gray-600 font-medium'>Subtotal:</span>
//               <span className='text-2xl font-bold text-gray-800'>₹{subTotal}</span>
//             </div>
            
//             <div className='space-y-2'>
//               <Link href={'/checkout'}>
//                 <button className="w-full flex items-center justify-center text-white bg-blue-600 border-0 py-3 px-4 focus:outline-none hover:bg-blue-700 rounded-lg text-base font-semibold transition-colors shadow-md">
//                   <BsBagCheckFill className="mr-2" />
//                   Checkout
//                 </button>
//               </Link>
//               <button 
//                 onClick={clearCart} 
//                 className="w-full flex items-center justify-center text-gray-700 bg-gray-200 border-0 py-2 px-4 focus:outline-none hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
//               >
//                 Clear Cart
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Wishlist Sidebar */}
//       <div ref={wishlistRef} className={`w-80 h-[100vh] sideCart overflow-y-auto absolute top-0 right-0 bg-gradient-to-b from-white to-red-50 shadow-2xl transform transition-transform duration-300 translate-x-full`} style={{
//         scrollbarWidth: 'thin',
//         scrollbarColor: '#cbd5e1 #f1f5f9'
//       }}>
//         {/* Wishlist Header */}
//         <div className='sticky top-0 bg-white shadow-sm px-6 py-4 border-b border-gray-200 z-10'>
//           <h2 className='font-bold text-2xl text-gray-800 flex items-center justify-center'>
//             <AiFillHeart className='mr-2 text-red-500' />
//             My Wishlist
//           </h2>
//           <span onClick={toggleWishlist} className='absolute top-4 right-4 cursor-pointer text-2xl text-gray-600 hover:text-red-500 transition-colors'>
//             <AiFillCloseCircle />
//           </span>
//         </div>

//         {/* Wishlist Items */}
//         <div className='px-6 py-4'>
//           {Object.keys(wishlist).length === 0 ? (
//             <div className='flex flex-col items-center justify-center py-12'>
//               <AiOutlineHeart className='text-6xl text-gray-300 mb-4' />
//               <p className='text-gray-500 font-medium text-lg'>Your wishlist is empty</p>
//               <p className='text-gray-400 text-sm mt-2'>Save your favorite items here!</p>
//             </div>
//           ) : (
//             <div className='space-y-4'>
//               {Object.keys(wishlist).map((k) => {
//                 return (
//                   <div key={k} className='bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow'>
//                     <div className='flex flex-col gap-3'>
//                       <div className='flex justify-between items-start'>
//                         <div className='flex-1'>
//                           <h3 className='font-semibold text-gray-800 text-base leading-tight mb-2'>
//                             {wishlist[k].name}
//                           </h3>
//                           {(wishlist[k].size || wishlist[k].variant) && (
//                             <p className='text-sm text-gray-500'>
//                               {wishlist[k].size && <span>Size: <span className='font-medium'>{wishlist[k].size}</span></span>}
//                               {wishlist[k].size && wishlist[k].variant && <span> | </span>}
//                               {wishlist[k].variant && <span>Color: <span className='font-medium'>{wishlist[k].variant}</span></span>}
//                             </p>
//                           )}
//                           <div className='font-bold text-gray-800 text-lg mt-2'>
//                             ₹{wishlist[k].price}
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => removeFromWishlist(k)}
//                           className='text-gray-400 hover:text-red-500 transition-colors'
//                         >
//                           <AiFillCloseCircle className='text-xl' />
//                         </button>
//                       </div>
                      
//                       <div className='flex gap-2'>
//                         <button
//                           onClick={() => moveToCart(k)}
//                           className='flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold flex items-center justify-center'
//                         >
//                           <CiShoppingCart className='mr-1 text-base' />
//                           Add to Cart
//                         </button>
//                         <Link href={`/checkout?item=${k}`}>
//                           <button
//                             className='flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-xs font-semibold flex items-center justify-center whitespace-nowrap'
//                           >
//                             <BsBagCheckFill className='mr-1 text-sm' />
//                             Buy Now
//                           </button>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {/* Wishlist Footer */}
//         {Object.keys(wishlist).length > 0 && (
//           <div className='sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg'>
//             <div className='flex justify-between items-center mb-3'>
//               <span className='text-gray-600 font-medium'>Total Items:</span>
//               <span className='text-xl font-bold text-gray-800'>{wishlistItemCount}</span>
//             </div>
            
//             <button 
//               onClick={clearWishlist} 
//               className="w-full flex items-center justify-center text-gray-700 bg-gray-200 border-0 py-2 px-4 focus:outline-none hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
//             >
//               Clear Wishlist
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Navbar

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CiShoppingCart } from "react-icons/ci";
import { AiFillCloseCircle, AiOutlinePlusCircle, AiOutlineMinusCircle, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBagCheckFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi";

const Navbar = ({
  Logout,
  user,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
  wishlist = {},
  removeFromWishlist,
  clearWishlist,
  moveToCart
}) => {
  const [dropdown, setDropdown] = useState(false)
  
  const toggleCart = () => {
    if (wishlistRef.current && !wishlistRef.current.classList.contains('translate-x-full')) {
      wishlistRef.current.classList.remove('translate-x-0')
      wishlistRef.current.classList.add('translate-x-full')
    }

    if (ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-full')
      ref.current.classList.add('translate-x-0')
    }
    else if (!ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-0')
      ref.current.classList.add('translate-x-full')
    }
  }

  const toggleWishlist = () => {
    if (ref.current && !ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-0')
      ref.current.classList.add('translate-x-full')
    }

    if (wishlistRef.current.classList.contains('translate-x-full')) {
      wishlistRef.current.classList.remove('translate-x-full')
      wishlistRef.current.classList.add('translate-x-0')
    }
    else if (!wishlistRef.current.classList.contains('translate-x-full')) {
      wishlistRef.current.classList.remove('translate-x-0')
      wishlistRef.current.classList.add('translate-x-full')
    }
  }
  
  const ref = useRef()
  const wishlistRef = useRef()
  const cartItemCount = Object.keys(cart).reduce((acc, k) => acc + cart[k].qty, 0)
  const wishlistItemCount = Object.keys(wishlist).length

  return (
    <div className='flex flex-col md:flex-row md:justify-start justify-center items-center py-4 px-4 shadow-lg sticky top-0 bg-gradient-to-r from-slate-50 via-white to-slate-50 z-50 border-b border-slate-200'>
      <div className="logo md:mx-8 cursor-pointer mr-auto transition-transform hover:scale-105 duration-300">
        <Link href={'/'}><Image width={200} height={40} src="/LOGO.jpg" alt="Logo" /></Link>
      </div>
      
      <div className="nav">
        <ul className='flex items-center space-x-8 font-medium md:text-lg tracking-wide'>
          <Link href={'/bracelets'}><span className='hover:text-slate-700 transition-all duration-300 relative group'><li>Bracelets</li><span className='absolute bottom-0 left-0 w-0 h-0.5 bg-slate-700 group-hover:w-full transition-all duration-300'></span></span></Link>
          <Link href={'/earings'}><span className='hover:text-slate-700 transition-all duration-300 relative group'><li>Earings</li><span className='absolute bottom-0 left-0 w-0 h-0.5 bg-slate-700 group-hover:w-full transition-all duration-300'></span></span></Link>
          <Link href={'/necklaces'}><span className='hover:text-slate-700 transition-all duration-300 relative group'><li>Necklaces</li><span className='absolute bottom-0 left-0 w-0 h-0.5 bg-slate-700 group-hover:w-full transition-all duration-300'></span></span></Link>
          <Link href={'/rings'}><span className='hover:text-slate-700 transition-all duration-300 relative group'><li>Rings</li><span className='absolute bottom-0 left-0 w-0 h-0.5 bg-slate-700 group-hover:w-full transition-all duration-300'></span></span></Link>
        </ul>
      </div>
      
      <div className='cart absolute right-0 mx-6 top-5 cursor-pointer flex items-center gap-1'>
        <span onMouseOver={() => {setDropdown(true)}} onMouseLeave={() => {setDropdown(false)}}>
          {dropdown && (
            <div 
              onMouseOver={() => {setDropdown(true)}} 
              onMouseLeave={() => {setDropdown(false)}} 
              className='absolute right-8 bg-white shadow-xl top-9 rounded-xl px-6 py-5 w-40 border border-slate-100 backdrop-blur-sm'
            >
              <ul className='space-y-1'>
                <Link href={'/myaccount'}><li className='py-2 hover:text-slate-700 hover:translate-x-1 transition-all text-sm font-semibold'>My Account</li></Link>
                <Link href={'/orders'}><li className='py-2 hover:text-slate-700 hover:translate-x-1 transition-all text-sm font-semibold'>Orders</li></Link>
                <span><li onClick={Logout} className='py-2 hover:text-slate-700 hover:translate-x-1 transition-all text-sm font-semibold cursor-pointer'>LogOut</li></span>
              </ul>
            </div>
          )}
          {user.value && <MdAccountCircle className='text-3xl md:text-3xl mx-2 text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-110' />}
        </span>

        {!user.value && (
          <Link href={'/login'}>
            <div>
              <button className='bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-2 rounded-full text-sm text-white mx-2 hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-md hover:shadow-lg font-medium'>Login</button>
            </div>
          </Link>
        )}

        {/* Wishlist Icon */}
        <div className='relative mx-2 group'>
          <AiOutlineHeart onClick={toggleWishlist} className='text-3xl md:text-3xl text-slate-600 hover:text-red-500 transition-all duration-300 hover:scale-110' />
          {wishlistItemCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md animate-pulse'>
              {wishlistItemCount}
            </span>
          )}
        </div>

        {/* Cart Icon */}
        <div className='relative group'>
          <CiShoppingCart onClick={toggleCart} className='text-3xl md:text-3xl text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-110' />
          {cartItemCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-gradient-to-br from-slate-700 to-slate-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md animate-pulse'>
              {cartItemCount}
            </span>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div
  ref={ref}
  className={`w-96 h-[100vh] sideCart overflow-y-auto absolute top-0 right-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-2xl transform transition-transform duration-500 translate-x-full`}
  style={{
    scrollbarWidth: 'thin',
    scrollbarColor: '#94a3b8 #f1f5f9',
  }}
>

        {/* Cart Header */}
        <div className='sticky top-0 bg-gradient-to-r from-slate-700 to-slate-800 shadow-lg px-6 py-5 z-10'>
          <h2 className='font-bold text-2xl text-white flex items-center justify-center tracking-wide'>
            <HiOutlineShoppingBag className='mr-2 text-white' />
            Shopping Cart
          </h2>
          <span onClick={toggleCart} className='absolute top-5 right-5 cursor-pointer text-2xl text-white hover:text-red-400 transition-all duration-300 hover:rotate-90'>
            <AiFillCloseCircle />
          </span>
        </div>

        {/* Cart Items */}
        <div className='px-6 py-6'>
          {Object.keys(cart).length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <div className='bg-slate-100 p-8 rounded-full mb-6'>
                <HiOutlineShoppingBag className='text-7xl text-slate-300' />
              </div>
              <p className='text-slate-600 font-semibold text-xl'>Your cart is empty</p>
              <p className='text-slate-400 text-sm mt-3'>Discover our exquisite collection!</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {Object.keys(cart).map((k) => {
                return (
                  <div key={k} className='bg-white rounded-xl shadow-md p-5 border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]'>
                    <div className='flex flex-col gap-4'>
                      {/* Product Details */}
                      <div>
                        <h3 className='font-bold text-slate-800 text-lg leading-tight mb-2'>
                          {cart[k].name}
                        </h3>
                        {(cart[k].size || cart[k].variant) && (
                          <p className='text-sm text-slate-500 bg-slate-50 inline-block px-3 py-1 rounded-full'>
                            {cart[k].size && <span>Size: <span className='font-semibold text-slate-700'>{cart[k].size}</span></span>}
                            {cart[k].size && cart[k].variant && <span className='mx-1'>•</span>}
                            {cart[k].variant && <span>Color: <span className='font-semibold text-slate-700'>{cart[k].variant}</span></span>}
                          </p>
                        )}
                      </div>
                      
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center bg-gradient-to-r from-slate-100 to-slate-200 rounded-full px-4 py-2 shadow-inner'>
                          <AiOutlineMinusCircle 
                            onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
                            className='cursor-pointer text-slate-600 hover:text-red-500 transition-all duration-300 text-2xl hover:scale-125'
                          />
                          <span className='mx-4 text-base font-bold text-slate-800 min-w-[24px] text-center'>
                            {cart[k].qty}
                          </span>
                          <AiOutlinePlusCircle 
                            onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
                            className='cursor-pointer text-slate-600 hover:text-green-500 transition-all duration-300 text-2xl hover:scale-125'
                          />
                        </div>
                        <div className='font-bold text-slate-800 text-xl'>
                          ₹{cart[k].price * cart[k].qty}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {Object.keys(cart).length > 0 && (
          <div className='sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent border-t border-slate-200 px-6 py-5 shadow-2xl backdrop-blur-sm'>
            <div className='flex justify-between items-center mb-5 pb-4 border-b-2 border-slate-200'>
              <span className='text-slate-600 font-semibold text-lg'>Subtotal:</span>
              <span className='text-3xl font-bold text-slate-800'>₹{subTotal}</span>
            </div>
            
            <div className='space-y-3'>
              <Link href={'/checkout'}>
                <button className="w-full flex items-center justify-center text-white bg-gradient-to-r from-slate-700 to-slate-900 border-0 py-4 px-6 focus:outline-none hover:from-slate-800 hover:to-black rounded-xl text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  <BsBagCheckFill className="mr-2 text-lg" />
                  Checkout
                </button>
              </Link>
              <button 
                onClick={clearCart} 
                className="w-full flex items-center justify-center text-slate-700 bg-slate-200 border-0 py-3 px-4 focus:outline-none hover:bg-slate-300 rounded-xl text-sm font-semibold transition-all duration-300"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wishlist Sidebar */}
      <div ref={wishlistRef} className={`w-96 h-[100vh] sideCart overflow-y-auto absolute top-0 right-0 bg-gradient-to-br from-red-50 via-white to-pink-50 shadow-2xl transform transition-transform duration-500 translate-x-full`} style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#f87171 #fef2f2'
      }}>
        {/* Wishlist Header */}
        <div className='sticky top-0 bg-gradient-to-r from-red-500 to-pink-600 shadow-lg px-6 py-5 z-10'>
          <h2 className='font-bold text-2xl text-white flex items-center justify-center tracking-wide'>
            <AiFillHeart className='mr-2 text-white' />
            My Wishlist
          </h2>
          <span onClick={toggleWishlist} className='absolute top-5 right-5 cursor-pointer text-2xl text-white hover:text-slate-200 transition-all duration-300 hover:rotate-90'>
            <AiFillCloseCircle />
          </span>
        </div>

        {/* Wishlist Items */}
        <div className='px-6 py-6'>
          {Object.keys(wishlist).length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <div className='bg-red-100 p-8 rounded-full mb-6'>
                <AiOutlineHeart className='text-7xl text-red-300' />
              </div>
              <p className='text-slate-600 font-semibold text-xl'>Your wishlist is empty</p>
              <p className='text-slate-400 text-sm mt-3'>Save your favorite pieces here!</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {Object.keys(wishlist).map((k) => {
                return (
                  <div key={k} className='bg-white rounded-xl shadow-md p-5 border border-red-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]'>
                    <div className='flex flex-col gap-4'>
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <h3 className='font-bold text-slate-800 text-lg leading-tight mb-2'>
                            {wishlist[k].name}
                          </h3>
                          {(wishlist[k].size || wishlist[k].variant) && (
                            <p className='text-sm text-slate-500 bg-red-50 inline-block px-3 py-1 rounded-full'>
                              {wishlist[k].size && <span>Size: <span className='font-semibold text-slate-700'>{wishlist[k].size}</span></span>}
                              {wishlist[k].size && wishlist[k].variant && <span className='mx-1'>•</span>}
                              {wishlist[k].variant && <span>Color: <span className='font-semibold text-slate-700'>{wishlist[k].variant}</span></span>}
                            </p>
                          )}
                          <div className='font-bold text-slate-800 text-xl mt-3'>
                            ₹{wishlist[k].price}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(k)}
                          className='text-slate-400 hover:text-red-500 transition-all duration-300 hover:scale-125 hover:rotate-90'
                        >
                          <AiFillCloseCircle className='text-2xl' />
                        </button>
                      </div>
                      
                      <div className='flex gap-2'>
                        <button
                          onClick={() => moveToCart(k)}
                          className='flex-1 bg-gradient-to-r from-slate-700 to-slate-900 text-white py-3 px-4 rounded-xl hover:from-slate-800 hover:to-black transition-all duration-300 text-sm font-bold flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                        >
                          <CiShoppingCart className='mr-1 text-lg' />
                          Add to Cart
                        </button>
                        <Link href={`/checkout?item=${k}`}>
                          <button
                            className='flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm font-bold flex items-center justify-center whitespace-nowrap shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                          >
                            <BsBagCheckFill className='mr-1 text-sm' />
                            Buy Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Wishlist Footer */}
        {Object.keys(wishlist).length > 0 && (
          <div className='sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent border-t border-red-200 px-6 py-5 shadow-2xl backdrop-blur-sm'>
            <div className='flex justify-between items-center mb-4 pb-3 border-b-2 border-red-200'>
              <span className='text-slate-600 font-semibold text-lg'>Total Items:</span>
              <span className='text-2xl font-bold text-slate-800'>{wishlistItemCount}</span>
            </div>
            
            <button 
              onClick={clearWishlist} 
              className="w-full flex items-center justify-center text-slate-700 bg-red-100 border-0 py-3 px-4 focus:outline-none hover:bg-red-200 rounded-xl text-sm font-semibold transition-all duration-300"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar