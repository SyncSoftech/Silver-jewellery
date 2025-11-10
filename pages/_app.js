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



import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LoadingBar from 'react-top-loading-bar'


export default function App({ Component, pageProps }) {
  const [cart, setCart]= useState({})
  const [subTotal, setSubTotal]= useState(0)
  const [user, setUser]= useState({value:null})
  const [key, setKey]= useState(9)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  
  

  useEffect(()=>{
    router.events.on('routeChangeStart', ()=>{
      setProgress(40)
    })
    router.events.on('routeChangeComplete', ()=>{
      setProgress(100)
    })
    // console.log("hey i am useEffect from _app.js")
    try {
      if(localStorage.getItem("cart")){
        setCart(JSON.parse(localStorage.getItem("cart")))
        saveCart(JSON.parse(localStorage.getItem("cart")))
      }
      
    } catch (error) {
      console.error(error);
      localStorage.clear() 
    }
    const token = localStorage.getItem('token') 
    if(token){
      setUser({value:token})
      setKey(Math.random())
    }

  },[router.query])//video 58 time 11.54

  const logout = ()=>{
    localStorage.removeItem("token")
    setUser({value:null})
    setKey(Math.random())
    router.push('/')
  }

  const saveCart =(myCart)=>{
    localStorage.setItem("cart", JSON.stringify(myCart))
    let subt = 0;
    let keys = Object.keys(myCart)
    for(let i=0; i<keys.length; i++){
      subt += myCart[keys[i]].price * myCart[keys[i]].qty
    }
    setSubTotal(subt)
  }


  const addToCart = (itemCode, qty, price, name, size, variant, img) =>{
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty = newCart[itemCode].qty + qty;
      if (!newCart[itemCode].img && img) newCart[itemCode].img = img;
    }
    else {
      newCart[itemCode] = { qty: 1, price, name, size, variant, img };
    }
    setCart(newCart);
    saveCart(newCart);
  }

  const buyNow = (itemCode, qty, price, name, size, variant, img) => {
    // Create a separate buy now item (don't add to cart)
    let buyNowItem = {};
    buyNowItem[itemCode] = { qty: qty, price, name, size, variant, img };
    
    // Save to sessionStorage (temporary, only for this session)
    sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    
    // Navigate to checkout
    router.push('/checkout?buyNow=true');
  }

  const clearCart = () =>{
    setCart({})
    saveCart({})
  }

  const removeFromCart = (itemCode, qty, price, name, size, variant) =>{
    let newCart=cart;
    if(itemCode in cart){
      newCart[itemCode].qty= cart[itemCode].qty - qty
    }
    if(newCart[itemCode]["qty"]<=0){
      delete newCart[itemCode]
    }
    setCart(newCart)
    saveCart(newCart)
  }
  return <>
  <LoadingBar
        color='blue'
        progress={progress}
        waitingTime={400}
        onLoaderFinished={() => setProgress(0)}
      />

   {key && <Navbar Logout={logout} user={user} key={key} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} />}
  <Component buyNow={buyNow} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} subTotal={subTotal} {...pageProps} />
  <Footer/>
  
  </>
}