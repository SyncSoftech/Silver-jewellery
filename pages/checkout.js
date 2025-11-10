// // pages/chackout.js
// import React, { useEffect, useState } from 'react';
// import { AiOutlinePlusCircle, AiOutlineMinusCircle, AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
// import { BsBagCheckFill } from "react-icons/bs";
// import Link from 'next/link';
// import Head from 'next/head';
// import Script from 'next/script';
// import { useRouter } from 'next/router';
// import { isAuthenticated, redirectToLogin } from '../utils/auth';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Checkout = ({ cart, clearCart, addToCart, removeFromCart, subTotal }) => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     phone: '',
//     street: '',
//     city: '',
//     state: '',
//     country: 'India',
//     postalCode: '',
//     landmark: '',
//     addressType: 'shipping',
//     isDefault: false
//   });

//   useEffect(() => {
//     if (isAuthenticated()) {
//       fetchUserAddresses();
//     }
//   }, []);

//   const fetchUserAddresses = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/address`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (data.success) {
//         setAddresses(data.addresses);
//         const defaultAddress = data.addresses.find(addr => addr.isDefault);
//         if (defaultAddress) setSelectedAddress(defaultAddress._id);
//       }
//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//       toast.error('Failed to load addresses');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const handleAddressSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated()) {
//       redirectToLogin(router);
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/address`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();
//       if (data.success) {
//         toast.success('Address saved successfully');
//         setShowAddressForm(false);
//         setFormData({
//           fullName: '',
//           phone: '',
//           street: '',
//           city: '',
//           state: '',
//           country: 'India',
//           postalCode: '',
//           landmark: '',
//           addressType: 'shipping',
//           isDefault: false
//         });
//         fetchUserAddresses();
//       } else {
//         toast.error(data.error || 'Failed to save address');
//       }
//     } catch (error) {
//       console.error('Error saving address:', error);
//       toast.error('Failed to save address');
//     }
//   };

//   const handleProceedToPayment = async () => {
//     if (!selectedAddress) {
//       toast.error('Please select a delivery address');
//       return;
//     }
//     if (Object.keys(cart).length === 0) {
//       toast.error('Your cart is empty');
//       return;
//     }
//     await initiatePayment();
//   };

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.async = true;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const initiatePayment = async () => {
//     if (!isAuthenticated()) {
//       redirectToLogin(router);
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       // 1) Create razorpay order & DB order (pretransaction)
//       const resp = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify({ cart, subTotal, addressId: selectedAddress })
//       });
//       const data = await resp.json();
//       if (!data.success) {
//         throw new Error(data.error || 'Failed to initialize payment');
//       }

//       const razorpayOrderId = data.order?.id || data.order?.order_id;
//       const dbOrderId = data.dbOrderId;
//       if (!razorpayOrderId || !dbOrderId) {
//         throw new Error('Payment initialization returned invalid ids');
//       }

//       // 2) Load Razorpay script
//       const loaded = await loadRazorpayScript();
//       if (!loaded) throw new Error('Failed to load payment processor. Try again.');

//       // prefill details
//       const selectedAddr = addresses.find(a => a._id === selectedAddress) || {};
//       const prefillName = selectedAddr.fullName || formData.fullName || '';
//       const prefillContact = selectedAddr.phone || formData.phone || '';
//       const prefillEmail = ''; // if you have user email, set here

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: data.order.amount,
//         currency: data.order.currency,
//         name: 'Your Store Name',
//         description: 'Order Payment',
//         order_id: razorpayOrderId,
//         handler: async function (razorpayResponse) {
//           // called when payment is completed on Razorpay
//           try {
//             setLoading(true);
//             // POST to /api/posttransaction for signature verification & marking order Paid
//             const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//               body: JSON.stringify({
//                 razorpayPaymentId: razorpayResponse.razorpay_payment_id,
//                 razorpayOrderId: razorpayResponse.razorpay_order_id,
//                 razorpaySignature: razorpayResponse.razorpay_signature,
//                 dbOrderId
//               })
//             });

//             const verifyData = await verifyRes.json();
//             if (!verifyData.success) {
//               toast.error(verifyData.error || 'Payment verification failed');
//               console.error('Verification failed', verifyData);
//               return;
//             }

//             // Save last order locally (useful fallback)
//             localStorage.setItem('lastOrder', JSON.stringify({
//               _id: verifyData.order._id || dbOrderId,
//               amount: verifyData.order.amount || subTotal,
//               status: verifyData.order.status || 'Paid',
//               paymentMethod: 'Online Payment (Razorpay)',
//               createdAt: verifyData.order.createdAt || new Date().toISOString(),
//               items: verifyData.order.orderItems || Object.values(cart).map(i => ({ name: i.name, qty: i.qty, price: i.price }))
//             }));

//             // Clear the cart after successful payment
//             clearCart();
//             // Redirect to success page using DB order id returned from server
//             const finalOrderId = verifyData.order._id || dbOrderId;
//             router.push(`/order/success?orderId=${finalOrderId}`);
//           } catch (err) {
//             console.error('Post-payment error:', err);
//             toast.error('Something went wrong after payment. Contact support.');
//           } finally {
//             setLoading(false);
//           }
//         },
//         prefill: {
//           name: prefillName,
//           email: prefillEmail,
//           contact: prefillContact
//         },
//         notes: {
//           addressId: selectedAddress,
//           dbOrderId
//         },
//         theme: { color: '#3399cc' }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error('Payment error:', error);
//       toast.error(error.message || 'Failed to process payment');
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className='container px-2 sm:m-auto'>
//       <Head>
//         <title>Checkout - Your Store</title>
//         <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
//       </Head>
//       <Script 
//         type="application/javascript" 
//         crossOrigin="anonymous" 
//       />
      
//       <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      
//       {/* Delivery Address Section */}
//       <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
//         <div className='flex justify-between items-center mb-6'>
//           <h2 className='text-xl font-semibold text-gray-800'>1. Select Delivery Address</h2>
//           <button 
//             onClick={() => setShowAddressForm(!showAddressForm)}
//             className='flex items-center text-indigo-600 hover:text-indigo-800 font-medium'
//           >
//             <AiOutlinePlus className='mr-1' /> Add New Address
//           </button>
//         </div>

//         {/* Add New Address Form */}
//         {showAddressForm && (
//           <form onSubmit={handleAddressSubmit} className='mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50'>
//             <h3 className='text-lg font-medium mb-4'>Add New Address</h3>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//               <div>
//                 <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
//                 <input
//                   type='text'
//                   name='fullName'
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//                   required
//                 />
//               </div>
//               <div>
//                 <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
//                 <input
//                   type='tel'
//                   name='phone'
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//                   required
//                 />
//               </div>
//               <div className='md:col-span-2'>
//                 <label className='block text-sm font-medium text-gray-700 mb-1'>Street Address</label>
//                 <input
//                   type='text'
//                   name='street'
//                   value={formData.street}
//                   onChange={handleInputChange}
//                   className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//                   required
//                 />
//               </div>
//               <div>
//                 <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
//                 <input
//                   type='text'
//                   name='city'
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//                   required
//                 />
//               </div>
//               <div>
//                 <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
//                 <input
//                   type='text'
//                   name='state'
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//                   required
//                 />
//               </div>
//               <div>
//                 <label className='block text-sm font-medium text-gray-700 mb-1'>Postal Code</label>
//                 <input
//                   type='text'
//                   name='postalCode'
//                   value={formData.postalCode}
//                   onChange={handleInputChange}
//                   className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//                   required
//                 />
//               </div>
//               <div>
//                 <label className='block text-sm font-medium text-gray-700 mb-1'>Country</label>
//                 <input
//                   type='text'
//                   name='country'
//                   value={formData.country}
//                   onChange={handleInputChange}
//                   className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100'
//                   readOnly
//                 />
//               </div>
//               <div className='md:col-span-2'>
//                 <label className='block text-sm font-medium text-gray-700 mb-1'>Landmark (Optional)</label>
//                 <input
//                   type='text'
//                   name='landmark'
//                   value={formData.landmark}
//                   onChange={handleInputChange}
//                   className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
//                 />
//               </div>
//               <div className='flex items-center'>
//                 <input
//                   type='checkbox'
//                   id='isDefault'
//                   name='isDefault'
//                   checked={formData.isDefault}
//                   onChange={handleInputChange}
//                   className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
//                 />
//                 <label htmlFor='isDefault' className='ml-2 block text-sm text-gray-700'>
//                   Set as default address
//                 </label>
//               </div>
//             </div>
//             <div className='mt-4 flex justify-end space-x-3'>
//               <button
//                 type='button'
//                 onClick={() => setShowAddressForm(false)}
//                 className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
//               >
//                 Cancel
//               </button>
//               <button
//                 type='submit'
//                 className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
//               >
//                 Save Address
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Address List */}
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//           {addresses.length > 0 ? (
//             addresses.map((address) => (
//               <div 
//                 key={address._id}
//                 onClick={() => setSelectedAddress(address._id)}
//                 className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
//                   selectedAddress === address._id 
//                     ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50' 
//                     : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
//                 }`}
//               >
//                 <div className='flex justify-between items-start'>
//                   <div>
//                     <h4 className='font-medium text-gray-900'>{address.fullName}</h4>
//                     <p className='text-sm text-gray-600'>{address.street}</p>
//                     <p className='text-sm text-gray-600'>{address.city}, {address.state} {address.postalCode}</p>
//                     <p className='text-sm text-gray-600'>{address.country}</p>
//                     <p className='text-sm text-gray-600 mt-1'>Phone: {address.phone}</p>
//                     {address.landmark && (
//                       <p className='text-sm text-gray-500'>Landmark: {address.landmark}</p>
//                     )}
//                   </div>
//                   <div className='flex items-center'>
//                     {selectedAddress === address._id && (
//                       <div className='h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-white'>
//                         <AiOutlineCheck size={14} />
//                       </div>
//                     )}
//                     {address.isDefault && (
//                       <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
//                         Default
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className='md:col-span-2 text-center py-8'>
//               <p className='text-gray-500'>No saved addresses found. Please add an address to continue.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Order Summary */}
//       <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
//         <h2 className='text-xl font-semibold text-gray-800 mb-4'>2. Order Summary</h2>
        
//         {/* Cart Items */}
//         <div className='space-y-4 mb-6'>
//           {Object.keys(cart).length === 0 ? (
//             <div className='text-center py-8'>
//               <p className='text-gray-500'>Your cart is empty</p>
//             </div>
//           ) : (
//             Object.entries(cart).map(([key, item]) => (
//               <div key={key} className='flex justify-between items-center border-b pb-4'>
//                 <div className='flex items-center'>
//                   <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
//                     <img
//                       src={item.img || '/placeholder-product.png'}
//                       alt={item.name}
//                       className='h-full w-full object-cover object-center'
//                     />
//                   </div>
//                   <div className='ml-4'>
//                     <h3 className='text-sm font-medium text-gray-900'>{item.name}</h3>
//                     <p className='mt-1 text-sm text-gray-500'>{item.variant} | {item.size}</p>
//                     <p className='mt-1 text-sm font-medium text-gray-900'>₹{item.price} x {item.qty}</p>
//                   </div>
//                 </div>
//                 <div className='flex items-center space-x-2'>
//                   <button
//                     onClick={() => removeFromCart(key, 1, item.price, item.name, item.size, item.variant)}
//                     className='text-gray-400 hover:text-gray-500'
//                   >
//                     <AiOutlineMinusCircle size={20} />
//                   </button>
//                   <span className='w-6 text-center'>{item.qty}</span>
//                   <button
//                     onClick={() => addToCart(key, 1, item.price, item.name, item.size, item.variant)}
//                     className='text-gray-400 hover:text-gray-500'
//                   >
//                     <AiOutlinePlusCircle size={20} />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Order Total */}
//         <div className='border-t border-gray-200 pt-6'>
//           <div className='flex justify-between text-base font-medium text-gray-900 mb-4'>
//             <p>Subtotal</p>
//             <p>₹{subTotal}</p>
//           </div>
//           <div className='flex justify-between text-base font-medium text-gray-900 mb-4'>
//             <p>Shipping</p>
//             <p>FREE</p>
//           </div>
//           <div className='flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4'>
//             <p>Total</p>
//             <p>₹{subTotal}</p>
//           </div>
          
//           {/* Payment Button */}
//           <div className='mt-6'>
//             <button
//               onClick={handleProceedToPayment}
//               disabled={Object.keys(cart).length === 0 || !selectedAddress || loading}
//               className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
//                 Object.keys(cart).length === 0 || !selectedAddress || loading
//                   ? 'bg-indigo-300 cursor-not-allowed'
//                   : 'bg-indigo-600 hover:bg-indigo-700'
//               } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
//             >
//               {loading ? (
//                 'Processing...'
//               ) : (
//                 <>
//                   <BsBagCheckFill className='mr-2' />
//                   Pay ₹{subTotal}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


// pages/checkout.js
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
  
  // Buy Now State
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState({});
  const [checkoutSubTotal, setCheckoutSubTotal] = useState(0);
  
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

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserAddresses();
    }
    
    // Check if this is a "Buy Now" checkout
    if (router.query.buyNow === 'true') {
      const buyNowItem = sessionStorage.getItem('buyNowItem');
      if (buyNowItem) {
        try {
          const item = JSON.parse(buyNowItem);
          setCheckoutItems(item);
          setIsBuyNow(true);
          
          // Calculate subtotal for buy now item
          let subt = 0;
          let keys = Object.keys(item);
          for (let i = 0; i < keys.length; i++) {
            subt += item[keys[i]].price * item[keys[i]].qty;
          }
          setCheckoutSubTotal(subt);
        } catch (error) {
          console.error('Error parsing buy now item:', error);
          toast.error('Invalid buy now item');
          router.push('/');
        }
      } else {
        toast.error('No item found for quick checkout');
        router.push('/');
      }
    } else {
      // Regular cart checkout
      setCheckoutItems(cart);
      setCheckoutSubTotal(subTotal);
      setIsBuyNow(false);
    }
  }, [router.query, cart, subTotal]);

  const fetchUserAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/address`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
        const defaultAddress = data.addresses.find(addr => addr.isDefault);
        if (defaultAddress) setSelectedAddress(defaultAddress._id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
    if (Object.keys(checkoutItems).length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    await initiatePayment();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    if (!isAuthenticated()) {
      redirectToLogin(router);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Use checkoutItems and checkoutSubTotal instead of cart and subTotal
      const resp = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          cart: checkoutItems, 
          subTotal: checkoutSubTotal, 
          addressId: selectedAddress,
          isBuyNow: isBuyNow 
        })
      });
      const data = await resp.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      const razorpayOrderId = data.order?.id || data.order?.order_id;
      const dbOrderId = data.dbOrderId;
      if (!razorpayOrderId || !dbOrderId) {
        throw new Error('Payment initialization returned invalid ids');
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load payment processor. Try again.');

      const selectedAddr = addresses.find(a => a._id === selectedAddress) || {};
      const prefillName = selectedAddr.fullName || formData.fullName || '';
      const prefillContact = selectedAddr.phone || formData.phone || '';
      const prefillEmail = '';

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Your Store Name',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (razorpayResponse) {
          try {
            setLoading(true);
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                razorpayOrderId: razorpayResponse.razorpay_order_id,
                razorpaySignature: razorpayResponse.razorpay_signature,
                dbOrderId
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              toast.error(verifyData.error || 'Payment verification failed');
              console.error('Verification failed', verifyData);
              return;
            }

            localStorage.setItem('lastOrder', JSON.stringify({
              _id: verifyData.order._id || dbOrderId,
              amount: verifyData.order.amount || checkoutSubTotal,
              status: verifyData.order.status || 'Paid',
              paymentMethod: 'Online Payment (Razorpay)',
              createdAt: verifyData.order.createdAt || new Date().toISOString(),
              items: verifyData.order.orderItems || Object.values(checkoutItems).map(i => ({ 
                name: i.name, 
                qty: i.qty, 
                price: i.price 
              }))
            }));

            // Clear based on checkout type
            if (isBuyNow) {
              sessionStorage.removeItem('buyNowItem');
              toast.success('Order placed successfully!');
            } else {
              clearCart();
              toast.success('Order placed successfully!');
            }
            
            const finalOrderId = verifyData.order._id || dbOrderId;
            router.push(`/order/success?orderId=${finalOrderId}`);
          } catch (err) {
            console.error('Post-payment error:', err);
            toast.error('Something went wrong after payment. Contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: prefillName,
          email: prefillEmail,
          contact: prefillContact
        },
        notes: {
          addressId: selectedAddress,
          dbOrderId,
          isBuyNow: isBuyNow
        },
        theme: { color: '#3399cc' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container px-2 sm:m-auto'>
      <Head>
        <title>Checkout - Your Store</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <Script 
        type="application/javascript" 
        crossOrigin="anonymous" 
      />
      
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      
      {/* Buy Now Banner */}
      {isBuyNow && (
        <div className='bg-blue-50 border-l-4 border-blue-400 p-4 mb-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <BsBagCheckFill className='h-5 w-5 text-blue-400' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-blue-800'>
                Quick Checkout - Buy Now
              </p>
              <p className='text-xs text-blue-600 mt-1'>
                Your cart items are safe and will not be affected by this purchase
              </p>
            </div>
          </div>
        </div>
      )}
      
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

      {/* Order Summary */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>2. Order Summary</h2>
        
        {/* Cart Items */}
        <div className='space-y-4 mb-6'>
          {Object.keys(checkoutItems).length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-gray-500'>Your cart is empty</p>
            </div>
          ) : (
            Object.entries(checkoutItems).map(([key, item]) => (
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
                {!isBuyNow && (
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
                )}
                {isBuyNow && (
                  <div className='text-sm font-medium text-gray-900'>
                    Qty: {item.qty}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Order Total */}
        <div className='border-t border-gray-200 pt-6'>
          <div className='flex justify-between text-base font-medium text-gray-900 mb-4'>
            <p>Subtotal</p>
            <p>₹{checkoutSubTotal}</p>
          </div>
          <div className='flex justify-between text-base font-medium text-gray-900 mb-4'>
            <p>Shipping</p>
            <p>FREE</p>
          </div>
          <div className='flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4'>
            <p>Total</p>
            <p>₹{checkoutSubTotal}</p>
          </div>
          
          {/* Payment Button */}
          <div className='mt-6'>
            <button
              onClick={handleProceedToPayment}
              disabled={Object.keys(checkoutItems).length === 0 || !selectedAddress || loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                Object.keys(checkoutItems).length === 0 || !selectedAddress || loading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <BsBagCheckFill className='mr-2' />
                  Pay ₹{checkoutSubTotal}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;