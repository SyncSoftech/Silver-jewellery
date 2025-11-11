

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
    // Close wishlist if open
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
    // Close cart if open
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
    <div className='flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 bg-white z-50'>
      <div className="logo md:mx-5 cursor-pointer mr-auto">
        <Link href={'/'}><Image width={200} height={40} src="/LOGO.jpg" alt="Logo" /></Link>
      </div>
      <div className="nav">
        <ul className='flex items-center space-x-6 font-semibold md:text-xl'>
          <Link href={'/bracelets'}><span className='hover:text-blue-600 transition-colors'><li>Bracelets</li></span></Link>
          <Link href={'/earings'}><span className='hover:text-blue-600 transition-colors'><li>Earings</li></span></Link>
          <Link href={'/necklaces'}><span className='hover:text-blue-600 transition-colors'><li>Necklaces</li></span></Link>
          <Link href={'/rings'}><span className='hover:text-blue-600 transition-colors'><li>Rings</li></span></Link>
        </ul>
      </div>
      <div className='cart absolute right-0 mx-5 top-4 cursor-pointer flex'>
        <span onMouseOver={() => {setDropdown(true)}} onMouseLeave={() => {setDropdown(false)}}>
          {dropdown && (
            <div 
              onMouseOver={() => {setDropdown(true)}} 
              onMouseLeave={() => {setDropdown(false)}} 
              className='absolute right-8 bg-white shadow-2xl top-7 rounded-md px-5 py-4 w-32'
            >
              <ul>
                <Link href={'/myaccount'}><li className='py-1 hover:text-blue-700 transition-colors text-sm font-bold'>My Account</li></Link>
                <Link href={'/orders'}><li className='py-1 hover:text-blue-700 transition-colors text-sm font-bold'>Orders</li></Link>
                <span><li onClick={Logout} className='py-1 hover:text-blue-700 transition-colors text-sm font-bold cursor-pointer'>LogOut</li></span>
              </ul>
            </div>
          )}
          {user.value && <MdAccountCircle className='text-2xl font-bold md:text-3xl mx-2 hover:text-blue-600 transition-colors' />}
        </span>

        {!user.value && (
          <Link href={'/login'}>
            <div>
              <button className='bg-blue-600 px-2 py-1 rounded-md text-sm text-white mx-2 hover:bg-blue-700 transition-colors'>Login</button>
            </div>
          </Link>
        )}

        {/* Wishlist Icon */}
        <div className='relative mx-2'>
          <AiOutlineHeart onClick={toggleWishlist} className='text-2xl font-bold md:text-3xl hover:text-red-500 transition-colors' />
          {wishlistItemCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
              {wishlistItemCount}
            </span>
          )}
        </div>

        {/* Cart Icon */}
        <div className='relative'>
          <CiShoppingCart onClick={toggleCart} className='text-2xl font-bold md:text-3xl hover:text-blue-600 transition-colors' />
          {cartItemCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
              {cartItemCount}
            </span>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div ref={ref} className={`w-80 h-[100vh] sideCart overflow-y-auto absolute top-0 right-0 bg-gradient-to-b from-white to-pink-50 shadow-2xl transform transition-transform duration-300 ${Object.keys(cart).length !== 0 ? 'translate-x-0' : 'translate-x-full'}`} style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #f1f5f9'
      }}>
        {/* Cart Header */}
        <div className='sticky top-0 bg-white shadow-sm px-6 py-4 border-b border-gray-200 z-10'>
          <h2 className='font-bold text-2xl text-gray-800 flex items-center justify-center'>
            <HiOutlineShoppingBag className='mr-2 text-blue-600' />
            Shopping Cart
          </h2>
          <span onClick={toggleCart} className='absolute top-4 right-4 cursor-pointer text-2xl text-gray-600 hover:text-red-500 transition-colors'>
            <AiFillCloseCircle />
          </span>
        </div>

        {/* Cart Items */}
        <div className='px-6 py-4'>
          {Object.keys(cart).length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <HiOutlineShoppingBag className='text-6xl text-gray-300 mb-4' />
              <p className='text-gray-500 font-medium text-lg'>Your cart is empty</p>
              <p className='text-gray-400 text-sm mt-2'>Add some items to get started!</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {Object.keys(cart).map((k) => {
                return (
                  <div key={k} className='bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow'>
                    <div className='flex flex-col gap-3'>
                      {/* Product Details */}
                      <div>
                        <h3 className='font-semibold text-gray-800 text-base leading-tight mb-2'>
                          {cart[k].name}
                        </h3>
                        {(cart[k].size || cart[k].variant) && (
                          <p className='text-sm text-gray-500'>
                            {cart[k].size && <span>Size: <span className='font-medium'>{cart[k].size}</span></span>}
                            {cart[k].size && cart[k].variant && <span> | </span>}
                            {cart[k].variant && <span>Color: <span className='font-medium'>{cart[k].variant}</span></span>}
                          </p>
                        )}
                      </div>
                      
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center bg-gray-100 rounded-full px-3 py-1.5'>
                          <AiOutlineMinusCircle 
                            onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
                            className='cursor-pointer text-gray-600 hover:text-red-500 transition-colors text-xl'
                          />
                          <span className='mx-3 text-sm font-bold text-gray-800 min-w-[20px] text-center'>
                            {cart[k].qty}
                          </span>
                          <AiOutlinePlusCircle 
                            onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
                            className='cursor-pointer text-gray-600 hover:text-green-500 transition-colors text-xl'
                          />
                        </div>
                        <div className='font-bold text-gray-800 text-lg'>
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
          <div className='sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg'>
            <div className='flex justify-between items-center mb-4 pb-3 border-b border-gray-200'>
              <span className='text-gray-600 font-medium'>Subtotal:</span>
              <span className='text-2xl font-bold text-gray-800'>₹{subTotal}</span>
            </div>
            
            <div className='space-y-2'>
              <Link href={'/checkout'}>
                <button className="w-full flex items-center justify-center text-white bg-blue-600 border-0 py-3 px-4 focus:outline-none hover:bg-blue-700 rounded-lg text-base font-semibold transition-colors shadow-md">
                  <BsBagCheckFill className="mr-2" />
                  Checkout
                </button>
              </Link>
              <button 
                onClick={clearCart} 
                className="w-full flex items-center justify-center text-gray-700 bg-gray-200 border-0 py-2 px-4 focus:outline-none hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wishlist Sidebar */}
      <div ref={wishlistRef} className={`w-80 h-[100vh] sideCart overflow-y-auto absolute top-0 right-0 bg-gradient-to-b from-white to-red-50 shadow-2xl transform transition-transform duration-300 translate-x-full`} style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #f1f5f9'
      }}>
        {/* Wishlist Header */}
        <div className='sticky top-0 bg-white shadow-sm px-6 py-4 border-b border-gray-200 z-10'>
          <h2 className='font-bold text-2xl text-gray-800 flex items-center justify-center'>
            <AiFillHeart className='mr-2 text-red-500' />
            My Wishlist
          </h2>
          <span onClick={toggleWishlist} className='absolute top-4 right-4 cursor-pointer text-2xl text-gray-600 hover:text-red-500 transition-colors'>
            <AiFillCloseCircle />
          </span>
        </div>

        {/* Wishlist Items */}
        <div className='px-6 py-4'>
          {Object.keys(wishlist).length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <AiOutlineHeart className='text-6xl text-gray-300 mb-4' />
              <p className='text-gray-500 font-medium text-lg'>Your wishlist is empty</p>
              <p className='text-gray-400 text-sm mt-2'>Save your favorite items here!</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {Object.keys(wishlist).map((k) => {
                return (
                  <div key={k} className='bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow'>
                    <div className='flex flex-col gap-3'>
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <h3 className='font-semibold text-gray-800 text-base leading-tight mb-2'>
                            {wishlist[k].name}
                          </h3>
                          {(wishlist[k].size || wishlist[k].variant) && (
                            <p className='text-sm text-gray-500'>
                              {wishlist[k].size && <span>Size: <span className='font-medium'>{wishlist[k].size}</span></span>}
                              {wishlist[k].size && wishlist[k].variant && <span> | </span>}
                              {wishlist[k].variant && <span>Color: <span className='font-medium'>{wishlist[k].variant}</span></span>}
                            </p>
                          )}
                          <div className='font-bold text-gray-800 text-lg mt-2'>
                            ₹{wishlist[k].price}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(k)}
                          className='text-gray-400 hover:text-red-500 transition-colors'
                        >
                          <AiFillCloseCircle className='text-xl' />
                        </button>
                      </div>
                      
                      <div className='flex gap-2'>
                        <button
                          onClick={() => moveToCart(k)}
                          className='flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold flex items-center justify-center'
                        >
                          <CiShoppingCart className='mr-1 text-base' />
                          Add to Cart
                        </button>
                        <Link href={`/checkout?item=${k}`}>
                          <button
                            className='flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-xs font-semibold flex items-center justify-center whitespace-nowrap'
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
          <div className='sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg'>
            <div className='flex justify-between items-center mb-3'>
              <span className='text-gray-600 font-medium'>Total Items:</span>
              <span className='text-xl font-bold text-gray-800'>{wishlistItemCount}</span>
            </div>
            
            <button 
              onClick={clearWishlist} 
              className="w-full flex items-center justify-center text-gray-700 bg-gray-200 border-0 py-2 px-4 focus:outline-none hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
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