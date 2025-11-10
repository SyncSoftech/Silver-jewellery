// import '@/styles/globals.css'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
// import LoadingBar from 'react-top-loading-bar'


// export default function App({ Component, pageProps }) {
//   const [cart, setCart]= useState({})
//   const [subTotal, setSubTotal]= useState(0)
//   const [user, setUser]= useState({value:null})
//   const [key, setKey]= useState(9)
//   const [progress, setProgress] = useState(0)
//   const router = useRouter()
  
  

//   useEffect(()=>{
//     router.events.on('routeChangeStart', ()=>{
//       setProgress(40)
//     })
//     router.events.on('routeChangeComplete', ()=>{
//       setProgress(100)
//     })
//     // console.log("hey i am useEffect from _app.js")
//     try {
//       if(localStorage.getItem("cart")){
//         setCart(JSON.parse(localStorage.getItem("cart")))
//         saveCart(JSON.parse(localStorage.getItem("cart")))
//       }
      
//     } catch (error) {
//       console.error(error);
//       localStorage.clear() 
//     }
//     const token = localStorage.getItem('token') 
//     if(token){
//       setUser({value:token})
//       setKey(Math.random())
//     }

//   },[router.query])//video 58 time 11.54

//   const logout = ()=>{
//     localStorage.removeItem("token")
//     setUser({value:null})
//     setKey(Math.random())
//     router.push('/')
//   }

//   const saveCart =(myCart)=>{
//     localStorage.setItem("cart", JSON.stringify(myCart))
//     let subt = 0;
//     let keys = Object.keys(myCart)
//     for(let i=0; i<keys.length; i++){
//       subt += myCart[keys[i]].price * myCart[keys[i]].qty
//     }
//     setSubTotal(subt)
//   }


//   const addToCart = (itemCode, qty, price, name, size, variant, img) =>{
//     let newCart = { ...cart };
//     if (itemCode in newCart) {
//       newCart[itemCode].qty = newCart[itemCode].qty + qty;
//       if (!newCart[itemCode].img && img) newCart[itemCode].img = img;
//     }
//     else {
//       newCart[itemCode] = { qty: 1, price, name, size, variant, img };
//     }
//     setCart(newCart);
//     saveCart(newCart);
//   }

//   const buyNow = (itemCode, qty, price, name, size, variant, img) => {
//     let newCart = { ...cart };
//     if (itemCode in newCart) {
//       newCart[itemCode].qty = newCart[itemCode].qty + qty;
//       if (!newCart[itemCode].img && img) newCart[itemCode].img = img;
//     } else {
//       newCart[itemCode] = { qty: 1, price, name, size, variant, img };
//     }
//     setCart(newCart);
//     saveCart(newCart);
//     router.push('/checkout');
//   }

//   const clearCart = () =>{
//     setCart({})
//     saveCart({})
//   }

//   const removeFromCart = (itemCode, qty, price, name, size, variant) =>{
//     let newCart=cart;
//     if(itemCode in cart){
//       newCart[itemCode].qty= cart[itemCode].qty - qty
//     }
//     if(newCart[itemCode]["qty"]<=0){
//       delete newCart[itemCode]
//     }
//     setCart(newCart)
//     saveCart(newCart)
//   }
//   return <>
//   <LoadingBar
//         color='blue'
//         progress={progress}
//         waitingTime={400}
//         onLoaderFinished={() => setProgress(0)}
//       />

//    {key && <Navbar Logout={logout} user={user} key={key} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />}
//   <Component buyNow={buyNow} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
//   <Footer/>
  
//   </>
// }



// import '@/styles/globals.css'
// import Navbar from '@/components/Navbar'
// import Footer from '@/components/Footer'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/router'
// import LoadingBar from 'react-top-loading-bar'


// export default function App({ Component, pageProps }) {
//   const [cart, setCart]= useState({})
//   const [subTotal, setSubTotal]= useState(0)
//   const [user, setUser]= useState({value:null})
//   const [key, setKey]= useState(9)
//   const [progress, setProgress] = useState(0)
//   const router = useRouter()
  
  

//   useEffect(()=>{
//     router.events.on('routeChangeStart', ()=>{
//       setProgress(40)
//     })
//     router.events.on('routeChangeComplete', ()=>{
//       setProgress(100)
//     })
//     // console.log("hey i am useEffect from _app.js")
//     try {
//       if(localStorage.getItem("cart")){
//         setCart(JSON.parse(localStorage.getItem("cart")))
//         saveCart(JSON.parse(localStorage.getItem("cart")))
//       }
      
//     } catch (error) {
//       console.error(error);
//       localStorage.clear() 
//     }
//     const token = localStorage.getItem('token') 
//     if(token){
//       setUser({value:token})
//       setKey(Math.random())
//     }

//   },[router.query])//video 58 time 11.54

//   const logout = ()=>{
//     localStorage.removeItem("token")
//     setUser({value:null})
//     setKey(Math.random())
//     router.push('/')
//   }

//   const saveCart =(myCart)=>{
//     localStorage.setItem("cart", JSON.stringify(myCart))
//     let subt = 0;
//     let keys = Object.keys(myCart)
//     for(let i=0; i<keys.length; i++){
//       subt += myCart[keys[i]].price * myCart[keys[i]].qty
//     }
//     setSubTotal(subt)
//   }


//   const addToCart = (itemCode, qty, price, name, size, variant, img) =>{
//     let newCart = { ...cart };
//     if (itemCode in newCart) {
//       newCart[itemCode].qty = newCart[itemCode].qty + qty;
//       if (!newCart[itemCode].img && img) newCart[itemCode].img = img;
//     }
//     else {
//       newCart[itemCode] = { qty: 1, price, name, size, variant, img };
//     }
//     setCart(newCart);
//     saveCart(newCart);
//   }

//   const buyNow = (itemCode, qty, price, name, size, variant, img) => {
//     // Create a separate buy now item (don't add to cart)
//     let buyNowItem = {};
//     buyNowItem[itemCode] = { qty: qty, price, name, size, variant, img };
    
//     // Save to sessionStorage (temporary, only for this session)
//     sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    
//     // Navigate to checkout
//     router.push('/checkout?buyNow=true');
//   }

//   const clearCart = () =>{
//     setCart({})
//     saveCart({})
//   }

//   const removeFromCart = (itemCode, qty, price, name, size, variant) =>{
//     let newCart=cart;
//     if(itemCode in cart){
//       newCart[itemCode].qty= cart[itemCode].qty - qty
//     }
//     if(newCart[itemCode]["qty"]<=0){
//       delete newCart[itemCode]
//     }
//     setCart(newCart)
//     saveCart(newCart)
//   }
//   return <>
//   <LoadingBar
//         color='blue'
//         progress={progress}
//         waitingTime={400}
//         onLoaderFinished={() => setProgress(0)}
//       />

//    {key && <Navbar Logout={logout} user={user} key={key} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />}
//   <Component buyNow={buyNow} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
//   <Footer/>
  
//   </>
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
        recalcAndSaveCart(parsed) // ensure subtotal computed
      }
    } catch (error) {
      console.error('Error reading cart from localStorage:', error)
      localStorage.removeItem('cart')
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

  // helper: recalc subtotal & persist
  const recalcAndSaveCart = (myCart) => {
    try {
      const cartToSave = myCart && typeof myCart === 'object' ? myCart : {}
      localStorage.setItem('cart', JSON.stringify(cartToSave))
      let subt = 0
      const keys = Object.keys(cartToSave)
      for (let i = 0; i < keys.length; i++) {
        const item = cartToSave[keys[i]]
        // guard against missing fields
        const price = Number(item.price) || 0
        const qty = Number(item.qty) || 0
        subt += price * qty
      }
      setSubTotal(subt)
    } catch (e) {
      console.error('Error saving cart:', e)
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

      {/* Show Navbar only for non-admin pages (optional). If you want Navbar inside admin too, remove the condition. */}
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
        />
      )}

      {/* Admin pages wrapped with AdminLayout; others get Navbar + Footer */}
      {isAdminRoute ? <AdminLayout>{PageContent}</AdminLayout> : (
        <>
          {PageContent}
          <Footer />
        </>
      )}
    </>
  )
}
