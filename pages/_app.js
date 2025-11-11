
// // pages/_app.js
// import '@/styles/globals.css'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import AdminLayout from '@/components/AdminLayout'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
// import LoadingBar from 'react-top-loading-bar'

// export default function App({ Component, pageProps }) {
//   const [cart, setCart] = useState({})
//   const [subTotal, setSubTotal] = useState(0)
//   const [user, setUser] = useState({ value: null })
//   const [key, setKey] = useState(9)
//   const [progress, setProgress] = useState(0)
//   const router = useRouter()

//   // init & route-change handlers
//   useEffect(() => {
//     const handleStart = () => setProgress(40)
//     const handleComplete = () => setProgress(100)

//     router.events.on('routeChangeStart', handleStart)
//     router.events.on('routeChangeComplete', handleComplete)
//     router.events.on('routeChangeError', handleComplete)

//     // load cart from localStorage
//     try {
//       const raw = localStorage.getItem('cart')
//       if (raw) {
//         const parsed = JSON.parse(raw)
//         setCart(parsed)
//         recalcAndSaveCart(parsed) // ensure subtotal computed
//       }
//     } catch (error) {
//       console.error('Error reading cart from localStorage:', error)
//       localStorage.removeItem('cart')
//     }

//     // load token / user
//     try {
//       const token = localStorage.getItem('token')
//       if (token) {
//         setUser({ value: token })
//         setKey(Math.random())
//       }
//     } catch (e) {
//       console.error('Error reading token from localStorage', e)
//     }

//     // cleanup on unmount
//     return () => {
//       router.events.off('routeChangeStart', handleStart)
//       router.events.off('routeChangeComplete', handleComplete)
//       router.events.off('routeChangeError', handleComplete)
//     }
//   }, [router])

//   // logout
//   const logout = () => {
//     try {
//       localStorage.removeItem('token')
//     } catch (e) { /* ignore */ }
//     setUser({ value: null })
//     setKey(Math.random())
//     router.push('/')
//   }

//   // helper: recalc subtotal & persist
//   const recalcAndSaveCart = (myCart) => {
//     try {
//       const cartToSave = myCart && typeof myCart === 'object' ? myCart : {}
//       localStorage.setItem('cart', JSON.stringify(cartToSave))
//       let subt = 0
//       const keys = Object.keys(cartToSave)
//       for (let i = 0; i < keys.length; i++) {
//         const item = cartToSave[keys[i]]
//         // guard against missing fields
//         const price = Number(item.price) || 0
//         const qty = Number(item.qty) || 0
//         subt += price * qty
//       }
//       setSubTotal(subt)
//     } catch (e) {
//       console.error('Error saving cart:', e)
//     }
//   }

//   // add to cart (immutable update)
//   const addToCart = (itemCode, qty = 1, price = 0, name = '', size = '', variant = '', img = '') => {
//     setCart(prevCart => {
//       const newCart = { ...prevCart }
//       if (itemCode in newCart) {
//         newCart[itemCode] = {
//           ...newCart[itemCode],
//           qty: (Number(newCart[itemCode].qty) || 0) + Number(qty),
//           price: price ?? newCart[itemCode].price,
//           name: name || newCart[itemCode].name,
//           size: size || newCart[itemCode].size,
//           variant: variant || newCart[itemCode].variant,
//           img: newCart[itemCode].img || img || ''
//         }
//       } else {
//         newCart[itemCode] = {
//           qty: Number(qty) || 1,
//           price: Number(price) || 0,
//           name,
//           size,
//           variant,
//           img
//         }
//       }
//       recalcAndSaveCart(newCart)
//       return newCart
//     })
//   }

//   // buy now (temporary storage) - keeps cart untouched
//   const buyNow = (itemCode, qty = 1, price = 0, name = '', size = '', variant = '', img = '') => {
//     const buyNowItem = {}
//     buyNowItem[itemCode] = { qty: Number(qty) || 1, price: Number(price) || 0, name, size, variant, img }
//     try {
//       sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem))
//     } catch (e) {
//       console.error('Error storing buyNowItem', e)
//     }
//     router.push('/checkout?buyNow=true')
//   }

//   // clear cart
//   const clearCart = () => {
//     setCart({})
//     recalcAndSaveCart({})
//   }

//   // remove from cart (immutable update)
//   const removeFromCart = (itemCode, qty = 1) => {
//     setCart(prevCart => {
//       const newCart = { ...prevCart }
//       if (!(itemCode in newCart)) return prevCart
//       newCart[itemCode] = { ...newCart[itemCode], qty: Number(newCart[itemCode].qty) - Number(qty) }
//       if (newCart[itemCode].qty <= 0) delete newCart[itemCode]
//       recalcAndSaveCart(newCart)
//       return newCart
//     })
//   }

//   // If the route starts with /admin, wrap page in AdminLayout
//   const isAdminRoute = router.pathname.startsWith('/admin')

//   const PageContent = (
//     <Component
//       buyNow={buyNow}
//       cart={cart}
//       addToCart={addToCart}
//       removeFromCart={removeFromCart}
//       clearCart={clearCart}
//       subTotal={subTotal}
//       {...pageProps}
//     />
//   )

//   return (
//     <>
//       <LoadingBar
//         color="blue"
//         progress={progress}
//         waitingTime={400}
//         onLoaderFinished={() => setProgress(0)}
//       />

//       {/* Show Navbar only for non-admin pages (optional). If you want Navbar inside admin too, remove the condition. */}
//       {!isAdminRoute && key && (
//         <Navbar
//           Logout={logout}
//           user={user}
//           key={key}
//           cart={cart}
//           addToCart={addToCart}
//           removeFromCart={removeFromCart}
//           clearCart={clearCart}
//           subTotal={subTotal}
//         />
//       )}

//       {/* Admin pages wrapped with AdminLayout; others get Navbar + Footer */}
//       {isAdminRoute ? <AdminLayout>{PageContent}</AdminLayout> : (
//         <>
//           {PageContent}
//           <Footer />
//         </>
//       )}
//     </>
//   )
// }


// pages/_app.js
import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdminLayout from '@/components/AdminLayout'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LoadingBar from 'react-top-loading-bar'

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({})
  const [wishlist, setWishlist] = useState({})
  const [subTotal, setSubTotal] = useState(0)
  const [user, setUser] = useState({ value: null })
  const [key, setKey] = useState(9)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  // init & route-change handlers
  useEffect(() => {
    const handleStart = () => setProgress(40)
    const handleComplete = () => setProgress(100)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    // load cart from localStorage
    try {
      const raw = localStorage.getItem('cart')
      if (raw) {
        const parsed = JSON.parse(raw)
        setCart(parsed)
        recalcAndSaveCart(parsed)
      }
    } catch (error) {
      console.error('Error reading cart from localStorage:', error)
      localStorage.removeItem('cart')
    }

    // load wishlist from localStorage
    try {
      const rawWishlist = localStorage.getItem('wishlist')
      if (rawWishlist) {
        const parsedWishlist = JSON.parse(rawWishlist)
        setWishlist(parsedWishlist)
      }
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error)
      localStorage.removeItem('wishlist')
    }

    // load token / user
    try {
      const token = localStorage.getItem('token')
      if (token) {
        setUser({ value: token })
        setKey(Math.random())
      }
    } catch (e) {
      console.error('Error reading token from localStorage', e)
    }

    // cleanup on unmount
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  // logout
  const logout = () => {
    try {
      localStorage.removeItem('token')
    } catch (e) { /* ignore */ }
    setUser({ value: null })
    setKey(Math.random())
    router.push('/')
  }

  // helper: recalc subtotal & persist cart
  const recalcAndSaveCart = (myCart) => {
    try {
      const cartToSave = myCart && typeof myCart === 'object' ? myCart : {}
      localStorage.setItem('cart', JSON.stringify(cartToSave))
      let subt = 0
      const keys = Object.keys(cartToSave)
      for (let i = 0; i < keys.length; i++) {
        const item = cartToSave[keys[i]]
        const price = Number(item.price) || 0
        const qty = Number(item.qty) || 0
        subt += price * qty
      }
      setSubTotal(subt)
    } catch (e) {
      console.error('Error saving cart:', e)
    }
  }

  // helper: persist wishlist to localStorage
  const saveWishlist = (myWishlist) => {
    try {
      const wishlistToSave = myWishlist && typeof myWishlist === 'object' ? myWishlist : {}
      localStorage.setItem('wishlist', JSON.stringify(wishlistToSave))
    } catch (e) {
      console.error('Error saving wishlist:', e)
    }
  }

  // add to cart (immutable update)
  const addToCart = (itemCode, qty = 1, price = 0, name = '', size = '', variant = '', img = '') => {
    setCart(prevCart => {
      const newCart = { ...prevCart }
      if (itemCode in newCart) {
        newCart[itemCode] = {
          ...newCart[itemCode],
          qty: (Number(newCart[itemCode].qty) || 0) + Number(qty),
          price: price ?? newCart[itemCode].price,
          name: name || newCart[itemCode].name,
          size: size || newCart[itemCode].size,
          variant: variant || newCart[itemCode].variant,
          img: newCart[itemCode].img || img || ''
        }
      } else {
        newCart[itemCode] = {
          qty: Number(qty) || 1,
          price: Number(price) || 0,
          name,
          size,
          variant,
          img
        }
      }
      recalcAndSaveCart(newCart)
      return newCart
    })
  }

  // add to wishlist (immutable update)
  const addToWishlist = (itemCode, price = 0, name = '', size = '', variant = '', img = '') => {
    setWishlist(prevWishlist => {
      const newWishlist = { ...prevWishlist }
      if (!(itemCode in newWishlist)) {
        newWishlist[itemCode] = {
          price: Number(price) || 0,
          name,
          size,
          variant,
          img,
          addedAt: Date.now()
        }
        saveWishlist(newWishlist)
      }
      return newWishlist
    })
  }

  // remove from wishlist (immutable update)
  const removeFromWishlist = (itemCode) => {
    setWishlist(prevWishlist => {
      const newWishlist = { ...prevWishlist }
      if (itemCode in newWishlist) {
        delete newWishlist[itemCode]
        saveWishlist(newWishlist)
      }
      return newWishlist
    })
  }

  // clear wishlist
  const clearWishlist = () => {
    setWishlist({})
    saveWishlist({})
  }

  // move item from wishlist to cart
  const moveToCart = (itemCode) => {
    if (itemCode in wishlist) {
      const item = wishlist[itemCode]
      addToCart(itemCode, 1, item.price, item.name, item.size, item.variant, item.img)
      removeFromWishlist(itemCode)
    }
  }

  // buy now (temporary storage) - keeps cart untouched
  const buyNow = (itemCode, qty = 1, price = 0, name = '', size = '', variant = '', img = '') => {
    const buyNowItem = {}
    buyNowItem[itemCode] = { qty: Number(qty) || 1, price: Number(price) || 0, name, size, variant, img }
    try {
      sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem))
    } catch (e) {
      console.error('Error storing buyNowItem', e)
    }
    router.push('/checkout?buyNow=true')
  }

  // clear cart
  const clearCart = () => {
    setCart({})
    recalcAndSaveCart({})
  }

  // remove from cart (immutable update)
  const removeFromCart = (itemCode, qty = 1) => {
    setCart(prevCart => {
      const newCart = { ...prevCart }
      if (!(itemCode in newCart)) return prevCart
      newCart[itemCode] = { ...newCart[itemCode], qty: Number(newCart[itemCode].qty) - Number(qty) }
      if (newCart[itemCode].qty <= 0) delete newCart[itemCode]
      recalcAndSaveCart(newCart)
      return newCart
    })
  }

  // If the route starts with /admin, wrap page in AdminLayout
  const isAdminRoute = router.pathname.startsWith('/admin')

  const PageContent = (
    <Component
      buyNow={buyNow}
      cart={cart}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
      clearCart={clearCart}
      subTotal={subTotal}
      wishlist={wishlist}
      addToWishlist={addToWishlist}
      removeFromWishlist={removeFromWishlist}
      clearWishlist={clearWishlist}
      moveToCart={moveToCart}
      {...pageProps}
    />
  )

  return (
    <>
      <LoadingBar
        color="blue"
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />

      {!isAdminRoute && key && (
        <Navbar
          Logout={logout}
          user={user}
          key={key}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          subTotal={subTotal}
          wishlist={wishlist}
          addToWishlist={addToWishlist}
          removeFromWishlist={removeFromWishlist}
          clearWishlist={clearWishlist}
          moveToCart={moveToCart}
        />
      )}

      {isAdminRoute ? <AdminLayout>{PageContent}</AdminLayout> : (
        <>
          {PageContent}
          <Footer />
        </>
      )}
    </>
  )
}