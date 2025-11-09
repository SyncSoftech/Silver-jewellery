// import React from 'react'
// import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
// import { BsBagCheckFill } from "react-icons/bs";
// import Link from 'next/link'
// import Head from 'next/head';
// import Script from 'next/script';

// const Checkout = ({ cart, clearCart, addToCart, removeFromCart, subTotal }) => {
//   const initiatePayment = async() => {
    
//     let oid = Math.floor(Math.random()* Date.now());
//     //Get a transaction token
    

//         const data = { cart, subTotal, oid, email:"email" };

//         const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
//           method: "POST", // or 'PUT'
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         })
//         let txnRes = await a.json()
//         console.log(txnRes)
//         let txnToken = txnRes.txnToken

    
    
    

//     var config = {
//       "root": "",
//       "flow": "DEFAULT",
//       "data": {
//         "orderId":oid,
//         "token": txnToken,
//         "tokenType": "TXN_TOKEN",
//         "amount": subTotal,

//       },
//       "handler": {
//         "notifyMerChant": function (eventName, data) {
//           console.log("notifyMerchant handler function called");
//           console.log("eventName => ", eventName);
//           console.log("data => ", data);
//         }
//       }
//     };
   
//             window.Paytm.CheckoutJS.init(config).then(function onSuccess(){
              
//               window.Paytm.CheckoutJS.invoke();
//             }).catch(function onError(error){
//               console.log("error => ",error);
//             });

//   }

//   return (
//     <div className='container px-2 sm:m-auto'>
//       <Head><meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" /></Head>
//       <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}/>
//       <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
//       <h2 className='font-samibold text-xl'>1. Delivery Details</h2>
//       <div className='mx-auto flex my-2'>
//         <div className='px-2 w-1/2 '>
//           <div class=" mb-4">
//             <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
//             <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//           </div>
//         </div>
//         <div className='px-2 w-1/2 '>
//           <div class=" mb-4">
//             <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
//             <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//           </div>
//         </div>
//       </div>

//       <div className='px-2 w-full '>
//         <div class=" mb-4">
//           <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
//           <textarea name="address" id="address" cols="30" rows="2" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>
//         </div>

//         <div className='mx-auto flex my-2'>
//           <div className='px-2 w-1/2 '>
//             <div class=" mb-4">
//               <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
//               <input type="phone" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//             </div>
//           </div>
//           <div className='px-2 w-1/2 '>
//             <div class=" mb-4">
//               <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
//               <input type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//             </div>
//           </div>
//         </div>

//         <div className='mx-auto flex my-2'>
//           <div className='px-2 w-1/2 '>
//             <div class=" mb-4">
//               <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
//               <input type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//             </div>
//           </div>
//           <div className='px-2 w-1/2 '>
//             <div class=" mb-4">
//               <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
//               <input type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//             </div>
//           </div>
//         </div>

//       </div>

//       <h2 className='font-semibold text-xl mt-8 mb-4 text-gray-800'>2. Review Cart Items</h2>

//       <div className="rounded-lg shadow-lg p-6 m-4 border border-rose-200" style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}>
//         {Object.keys(cart).length == 0 ? (
//           <div className='flex flex-col items-center justify-center py-8'>
//             <BsBagCheckFill className='text-rose-300 text-6xl mb-4' />
//             <p className='text-rose-800 text-lg font-medium'>Your cart is empty!</p>
//             <p className='text-rose-600 text-sm mt-2'>Add some items to get started</p>
//           </div>
//         ) : (
//           <>
//             <div className='space-y-4'>
//               {Object.keys(cart).map((k) => {
//                 return (
//                   <div key={k} className='flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200 shadow-sm border border-rose-100'>
//                     <div className='flex items-center gap-4 flex-1'>
//                       {/* Product Image */}
//                       <div className='w-20 h-20 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg flex items-center justify-center overflow-hidden shadow-md flex-shrink-0'>
//                         {cart[k].img ? (
//                           <img src={cart[k].img} alt={cart[k].name} className='w-full h-full object-cover' />
//                         ) : (
//                           <BsBagCheckFill className='text-rose-400 text-3xl' />
//                         )}
//                       </div>
                      
//                       {/* Product Details */}
//                       <div className='flex-1'>
//                         <h3 className='font-semibold text-gray-800 text-lg'>{cart[k].name}</h3>
//                         <div className='flex gap-2 mt-1'>
//                           <span className='text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full font-medium'>
//                             Size: {cart[k].size}
//                           </span>
//                           <span className='text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium'>
//                             {cart[k].variant}
//                           </span>
//                         </div>
//                         <p className='text-sm text-gray-600 mt-2 font-medium'>₹{cart[k].price} each</p>
//                       </div>
//                     </div>
                    
//                     {/* Quantity Controls and Price */}
//                     <div className='flex items-center gap-4'>
//                       <div className='flex items-center bg-white border-2 border-rose-200 rounded-lg px-3 py-2 shadow-sm'>
//                         <AiOutlineMinusCircle 
//                           onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
//                           className='cursor-pointer text-rose-500 hover:text-rose-700 text-xl transition-colors' 
//                         />
//                         <span className='mx-3 text-lg font-semibold text-gray-800 min-w-[30px] text-center'>
//                           {cart[k].qty}
//                         </span>
//                         <AiOutlinePlusCircle 
//                           onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} 
//                           className='cursor-pointer text-rose-500 hover:text-rose-700 text-xl transition-colors' 
//                         />
//                       </div>
//                       <div className='text-right min-w-[80px]'>
//                         <p className='text-lg font-bold text-rose-700'>₹{cart[k].qty * cart[k].price}</p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             {/* Subtotal Section */}
//             <div className='border-t-2 border-rose-300 mt-6 pt-4 bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm'>
//               <div className='flex justify-between items-center'>
//                 <span className='text-lg font-semibold text-gray-800'>Subtotal</span>
//                 <span className='text-2xl font-bold text-rose-700'>₹{subTotal}</span>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//       <div className='mx-4'>
//         <Link href={'/checkout'}><button onClick={initiatePayment} className="flex  mr-2 text-white bg-indigo-500 border-0 py-2 px-2 focus:outline-none hover:bg-indigo-600 rounded text-sm"><BsBagCheckFill className="m-1" />Pay ₹{subTotal}</button></Link></div>

//     </div>
//   )
// }

// export default Checkout


import React, { useEffect, useState } from 'react';
import { AiOutlinePlusCircle, AiOutlineMinusCircle, AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { BsBagCheckFill } from "react-icons/bs";
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { isAuthenticated, redirectToLogin } from '../utils/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = ({ cart, clearCart, addToCart, removeFromCart, subTotal }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    landmark: '',
    addressType: 'shipping',
    isDefault: false
  });

  // Fetch user addresses on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserAddresses();
    }
  }, []);

  const fetchUserAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/address`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
        // Set default address if available
        const defaultAddress = data.addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      redirectToLogin(router);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Address saved successfully');
        setShowAddressForm(false);
        setFormData({
          fullName: '',
          phone: '',
          street: '',
          city: '',
          state: '',
          country: 'India',
          postalCode: '',
          landmark: '',
          addressType: 'shipping',
          isDefault: false
        });
        fetchUserAddresses();
      } else {
        toast.error(data.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    
    if (Object.keys(cart).length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    await initiatePayment();
  };

  const initiatePayment = async () => {
    if (!isAuthenticated()) {
      redirectToLogin(router);
      return;
    }
    
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
      <Head>
        <title>Checkout - Your Store</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <Script type="application/javascript" crossorigin="anonymous" src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}/>
      
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      
      {/* Delivery Address Section */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-gray-800'>1. Select Delivery Address</h2>
          <button 
            onClick={() => setShowAddressForm(!showAddressForm)}
            className='flex items-center text-indigo-600 hover:text-indigo-800 font-medium'
          >
            <AiOutlinePlus className='mr-1' /> Add New Address
          </button>
        </div>

        {/* Add New Address Form */}
        {showAddressForm && (
          <form onSubmit={handleAddressSubmit} className='mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50'>
            <h3 className='text-lg font-medium mb-4'>Add New Address</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  required
                />
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Street Address</label>
                <input
                  type='text'
                  name='street'
                  value={formData.street}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                <input
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
                <input
                  type='text'
                  name='state'
                  value={formData.state}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Postal Code</label>
                <input
                  type='text'
                  name='postalCode'
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Country</label>
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100'
                  readOnly
                />
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Landmark (Optional)</label>
                <input
                  type='text'
                  name='landmark'
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                />
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='isDefault'
                  name='isDefault'
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                />
                <label htmlFor='isDefault' className='ml-2 block text-sm text-gray-700'>
                  Set as default address
                </label>
              </div>
            </div>
            <div className='mt-4 flex justify-end space-x-3'>
              <button
                type='button'
                onClick={() => setShowAddressForm(false)}
                className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Save Address
              </button>
            </div>
          </form>
        )}

        {/* Address List */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div 
                key={address._id}
                onClick={() => setSelectedAddress(address._id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAddress === address._id 
                    ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='font-medium text-gray-900'>{address.fullName}</h4>
                    <p className='text-sm text-gray-600'>{address.street}</p>
                    <p className='text-sm text-gray-600'>{address.city}, {address.state} {address.postalCode}</p>
                    <p className='text-sm text-gray-600'>{address.country}</p>
                    <p className='text-sm text-gray-600 mt-1'>Phone: {address.phone}</p>
                    {address.landmark && (
                      <p className='text-sm text-gray-500'>Landmark: {address.landmark}</p>
                    )}
                  </div>
                  <div className='flex items-center'>
                    {selectedAddress === address._id && (
                      <div className='h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-white'>
                        <AiOutlineCheck size={14} />
                      </div>
                    )}
                    {address.isDefault && (
                      <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='md:col-span-2 text-center py-8'>
              <p className='text-gray-500'>No saved addresses found. Please add an address to continue.</p>
            </div>
          )}
        </div>
      </div>
          </div>
          <div className='px-2 w-1/2 '>
            <div className=" mb-4">
              <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
              <input type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
        </div>

        <div className='mx-auto flex my-2'>
          <div className='px-2 w-1/2 '>
            <div className=" mb-4">
              <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
              <input type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
          <div className='px-2 w-1/2 '>
            <div className=" mb-4">
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
                  <div key={k} className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200 shadow-sm border border-rose-100'>

                    {/* Left: Image + Details */}
                    <div className='flex flex-1 w-full sm:w-auto gap-4 items-start sm:items-center'>
                      {/* Product Image */}
                      <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg flex items-center justify-center overflow-hidden shadow-md flex-shrink-0'>
                        {cart[k].img ? (
                          <img src={cart[k].img} alt={cart[k].name} className='w-full h-full object-cover' />
                        ) : (
                          <BsBagCheckFill className='text-rose-400 text-3xl' />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-gray-800 text-lg truncate'>{cart[k].name}</h3>
                        <div className='flex gap-2 mt-1 flex-wrap'>
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

                    {/* Right: Quantity Controls and Price */}
                    <div className='mt-3 sm:mt-0 flex items-center gap-4 sm:flex-shrink-0'>
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
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                <span className='text-lg font-semibold text-gray-800'>Subtotal</span>
                <span className='text-2xl font-bold text-rose-700'>₹{subTotal}</span>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Order Summary */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>2. Order Summary</h2>
        
        {/* Cart Items */}
        <div className='space-y-4 mb-6'>
          {Object.keys(cart).length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-gray-500'>Your cart is empty</p>
            </div>
          ) : (
            Object.entries(cart).map(([key, item]) => (
              <div key={key} className='flex justify-between items-center border-b pb-4'>
                <div className='flex items-center'>
                  <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
                    <img
                      src={item.img || '/placeholder-product.png'}
                      alt={item.name}
                      className='h-full w-full object-cover object-center'
                    />
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-sm font-medium text-gray-900'>{item.name}</h3>
                    <p className='mt-1 text-sm text-gray-500'>{item.variant} | {item.size}</p>
                    <p className='mt-1 text-sm font-medium text-gray-900'>₹{item.price} x {item.qty}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => removeFromCart(key, 1, item.price, item.name, item.size, item.variant)}
                    className='text-gray-400 hover:text-gray-500'
                  >
                    <AiOutlineMinusCircle size={20} />
                  </button>
                  <span className='w-6 text-center'>{item.qty}</span>
                  <button
                    onClick={() => addToCart(key, 1, item.price, item.name, item.size, item.variant)}
                    className='text-gray-400 hover:text-gray-500'
                  >
                    <AiOutlinePlusCircle size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Total */}
        <div className='border-t border-gray-200 pt-6'>
          <div className='flex justify-between text-base font-medium text-gray-900 mb-4'>
            <p>Subtotal</p>
            <p>₹{subTotal}</p>
          </div>
          <div className='flex justify-between text-base font-medium text-gray-900 mb-4'>
            <p>Shipping</p>
            <p>FREE</p>
          </div>
          <div className='flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4'>
            <p>Total</p>
            <p>₹{subTotal}</p>
          </div>
          
          {/* Payment Button */}
          <div className='mt-6'>
            <button
              onClick={handleProceedToPayment}
              disabled={Object.keys(cart).length === 0 || !selectedAddress || loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                Object.keys(cart).length === 0 || !selectedAddress || loading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <BsBagCheckFill className='mr-2' />
                  Pay ₹{subTotal}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Checkout
