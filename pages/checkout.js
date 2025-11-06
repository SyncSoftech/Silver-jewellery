import React from 'react'
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { BsBagCheckFill } from "react-icons/bs";
import Link from 'next/link'
import Head from 'next/head';
import Script from 'next/script';

const Checkout = ({ cart, clearCart, addToCart, removeFromCart, subTotal }) => {
  const initiatePayment = async() => {
    
    let oid = Math.floor(Math.random()* Date.now());
    //Get a transaction token
    

        const data = { cart, subTotal, oid, email:"email" };

        const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        let txnRes = await a.json()
        console.log(txnRes)
        let txnToken = txnRes.txnToken

    
    
    

    var config = {
      "root": "",
      "flow": "DEFAULT",
      "data": {
        "orderId":oid,
        "token": txnToken,
        "tokenType": "TXN_TOKEN",
        "amount": subTotal,

      },
      "handler": {
        "notifyMerChant": function (eventName, data) {
          console.log("notifyMerchant handler function called");
          console.log("eventName => ", eventName);
          console.log("data => ", data);
        }
      }
    };
   
            window.Paytm.CheckoutJS.init(config).then(function onSuccess(){
              
              window.Paytm.CheckoutJS.invoke();
            }).catch(function onError(error){
              console.log("error => ",error);
            });

  }

  return (
    <div className='container px-2 sm:m-auto'>
      <Head><meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" /></Head>
      <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}/>
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      <h2 className='font-samibold text-xl'>1. Delivery Details</h2>
      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2 '>
          <div class=" mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2 '>
          <div class=" mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>

      <div className='px-2 w-full '>
        <div class=" mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea name="address" id="address" cols="30" rows="2" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>
        </div>

        <div className='mx-auto flex my-2'>
          <div className='px-2 w-1/2 '>
            <div class=" mb-4">
              <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
              <input type="phone" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
          <div className='px-2 w-1/2 '>
            <div class=" mb-4">
              <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
              <input type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
        </div>

        <div className='mx-auto flex my-2'>
          <div className='px-2 w-1/2 '>
            <div class=" mb-4">
              <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
              <input type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
          <div className='px-2 w-1/2 '>
            <div class=" mb-4">
              <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
              <input type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
        </div>

      </div>

      <h2 className='font-semibold text-xl mt-8 mb-4 text-gray-800'>2. Review Cart Items</h2>

      <div className="rounded-lg shadow-lg p-6 m-4 border border-rose-200" style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}>
        {Object.keys(cart).length == 0 ? (
          <div className='flex flex-col items-center justify-center py-8'>
            <BsBagCheckFill className='text-rose-300 text-6xl mb-4' />
            <p className='text-rose-800 text-lg font-medium'>Your cart is empty!</p>
            <p className='text-rose-600 text-sm mt-2'>Add some items to get started</p>
          </div>
        ) : (
          <>
            <div className='space-y-4'>
              {Object.keys(cart).map((k) => {
                return (
                  <div key={k} className='flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200 shadow-sm border border-rose-100'>
                    <div className='flex items-center gap-4 flex-1'>
                      {/* Product Image */}
                      <div className='w-20 h-20 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg flex items-center justify-center overflow-hidden shadow-md flex-shrink-0'>
                        {cart[k].img ? (
                          <img src={cart[k].img} alt={cart[k].name} className='w-full h-full object-cover' />
                        ) : (
                          <BsBagCheckFill className='text-rose-400 text-3xl' />
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className='flex-1'>
                        <h3 className='font-semibold text-gray-800 text-lg'>{cart[k].name}</h3>
                        <div className='flex gap-2 mt-1'>
                          <span className='text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-medium'>
                            Size: {cart[k].size}
                          </span>
                          <span className='text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium'>
                            {cart[k].variant}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 mt-2 font-medium'>₹{cart[k].price} each</p>
                      </div>
                    </div>
                    
                    {/* Quantity Controls and Price */}
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center bg-white border-2 border-rose-200 rounded-lg px-3 py-2 shadow-sm'>
                        <AiOutlineMinusCircle 
                          onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
                          className='cursor-pointer text-rose-500 hover:text-rose-700 text-xl transition-colors' 
                        />
                        <span className='mx-3 text-lg font-semibold text-gray-800 min-w-[30px] text-center'>
                          {cart[k].qty}
                        </span>
                        <AiOutlinePlusCircle 
                          onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
                          className='cursor-pointer text-rose-500 hover:text-rose-700 text-xl transition-colors' 
                        />
                      </div>
                      <div className='text-right min-w-[80px]'>
                        <p className='text-lg font-bold text-rose-700'>₹{cart[k].qty * cart[k].price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Subtotal Section */}
            <div className='border-t-2 border-rose-300 mt-6 pt-4 bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm'>
              <div className='flex justify-between items-center'>
                <span className='text-lg font-semibold text-gray-800'>Subtotal</span>
                <span className='text-2xl font-bold text-rose-700'>₹{subTotal}</span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className='mx-4'>
        <Link href={'/checkout'}><button onClick={initiatePayment} className="flex  mr-2 text-white bg-indigo-500 border-0 py-2 px-2 focus:outline-none hover:bg-indigo-600 rounded text-sm"><BsBagCheckFill className="m-1" />Pay ₹{subTotal}</button></Link></div>

    </div>
  )
}

export default Checkout
