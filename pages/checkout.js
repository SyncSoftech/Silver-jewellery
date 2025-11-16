
// // pages/checkout.js
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
  
//   // Buy Now State
//   const [isBuyNow, setIsBuyNow] = useState(false);
//   const [checkoutItems, setCheckoutItems] = useState({});
//   const [checkoutSubTotal, setCheckoutSubTotal] = useState(0);
  
//   // Stock tracking
//   const [outOfStockItems, setOutOfStockItems] = useState([]);
//   const [hasOutOfStockItems, setHasOutOfStockItems] = useState(false);
  
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

//   // Check stock availability for items
//   const checkStockAvailability = async (items) => {
//   try {
//     // Get all unique product IDs or slugs
//     const productIdentifiers = Array.from(
//       new Set(
//         Object.values(items).map(item => item._id || item.slug || Object.keys(items)[0])
//       )
//     );

//     if (productIdentifiers.length === 0) {
//       setHasOutOfStockItems(false);
//       setOutOfStockItems([]);
//       return items;
//     }

//     const response = await fetch(
//       `/api/inventory/stock?productIds=${JSON.stringify(productIdentifiers)}`
//     );
    
//     if (!response.ok) {
//       throw new Error('Failed to check stock');
//     }

//     const stockData = await response.json();
//     const outOfStock = [];
//     const updatedItems = { ...items };

//     // Update items with stock information
//     Object.entries(updatedItems).forEach(([key, item]) => {
//       const stockInfo = stockData.find(s => 
//         s.productId === item._id || s.slug === item.slug || s._id === item._id
//       );

//       if (stockInfo) {
//         updatedItems[key] = {
//           ...item,
//           availableQty: stockInfo.availableQty,
//           inStock: stockInfo.inStock
//         };

//         if (stockInfo.availableQty < (item.qty || 1)) {
//           outOfStock.push(item.name);
//         }
//       }
//     });

//     setOutOfStockItems(outOfStock);
//     setHasOutOfStockItems(outOfStock.length > 0);
//     return updatedItems;
//   } catch (error) {
//     console.error('Error checking stock:', error);
//     toast.error('Error checking product availability');
//     // In case of error, don't block the UI - assume items are in stock
//     return items;
//   }
// };

//   useEffect(() => {
//   if (isAuthenticated()) {
//     fetchUserAddresses();
//   }
  
//   const initializeCheckout = async () => {
//     try {
//       if (router.query.buyNow === 'true') {
//         const buyNowItem = sessionStorage.getItem('buyNowItem');
//         if (buyNowItem) {
//           const item = JSON.parse(buyNowItem);
//           const itemsWithStock = await checkStockAvailability(item);
//           setCheckoutItems(itemsWithStock);
//           setIsBuyNow(true);
          
//           // Calculate subtotal
//           const subt = Object.values(itemsWithStock).reduce(
//             (sum, item) => sum + (item.price * (item.qty || 1)), 
//             0
//           );
//           setCheckoutSubTotal(subt);
//         }
//       } else {
//         const itemsWithStock = await checkStockAvailability(cart);
//         setCheckoutItems(itemsWithStock);
//         setCheckoutSubTotal(subTotal);
//         setIsBuyNow(false);
//       }
//     } catch (error) {
//       console.error('Error initializing checkout:', error);
//       // Fallback to original items if there's an error
//       setCheckoutItems(router.query.buyNow === 'true' ? 
//         JSON.parse(sessionStorage.getItem('buyNowItem') || '{}') : 
//         cart
//       );
//     }
//   };
  
//   initializeCheckout();
// }, [router.query, cart, subTotal]);

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
//     if (Object.keys(checkoutItems).length === 0) {
//       toast.error('Your cart is empty');
//       return;
//     }
    
//     // Re-validate stock before proceeding to payment
//     const updatedItems = await checkStockAvailability(checkoutItems);
//     setCheckoutItems(updatedItems);
    
//     // Check if any items are out of stock
//     const hasOutOfStock = Object.values(updatedItems).some(
//       item => (item.availableQty !== undefined && item.availableQty <= 0) || 
//              (item.qty > (item.availableQty || 0))
//     );
    
//     if (hasOutOfStock) {
//       toast.error('Some items in your cart are out of stock. Please update your cart.');
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

//       // Use checkoutItems and checkoutSubTotal instead of cart and subTotal
//       const resp = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify({ 
//           cart: checkoutItems, 
//           subTotal: checkoutSubTotal, 
//           addressId: selectedAddress,
//           isBuyNow: isBuyNow 
//         })
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

//       const loaded = await loadRazorpayScript();
//       if (!loaded) throw new Error('Failed to load payment processor. Try again.');

//       const selectedAddr = addresses.find(a => a._id === selectedAddress) || {};
//       const prefillName = selectedAddr.fullName || formData.fullName || '';
//       const prefillContact = selectedAddr.phone || formData.phone || '';
//       const prefillEmail = '';

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: data.order.amount,
//         currency: data.order.currency,
//         name: 'Your Store Name',
//         description: 'Order Payment',
//         order_id: razorpayOrderId,
//         handler: async function (razorpayResponse) {
//           try {
//             setLoading(true);
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

//             localStorage.setItem('lastOrder', JSON.stringify({
//               _id: verifyData.order._id || dbOrderId,
//               amount: verifyData.order.amount || checkoutSubTotal,
//               status: verifyData.order.status || 'Paid',
//               paymentMethod: 'Online Payment (Razorpay)',
//               createdAt: verifyData.order.createdAt || new Date().toISOString(),
//               items: verifyData.order.orderItems || Object.values(checkoutItems).map(i => ({ 
//                 name: i.name, 
//                 qty: i.qty, 
//                 price: i.price 
//               }))
//             }));

//             // Clear based on checkout type
//             if (isBuyNow) {
//               sessionStorage.removeItem('buyNowItem');
//               toast.success('Order placed successfully!');
//             } else {
//               clearCart();
//               toast.success('Order placed successfully!');
//             }
            
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
//           dbOrderId,
//           isBuyNow: isBuyNow
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
//     <div className='container px-2 sm:m-auto' style={{
//       background: 'radial-gradient(circle, #FFF2Ef,#E0CAC5)',
//     }} >
//       <Head>
//         <title>Checkout - Your Store</title>
//         <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
//       </Head>
//       <Script 
//         type="application/javascript" 
//         crossOrigin="anonymous" 
//       />
      
//       <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      
//       {/* Buy Now Banner */}
//       {isBuyNow && (
//         <div className='bg-blue-50 border-l-4 border-blue-400 p-4 mb-6'>
//           <div className='flex items-center'>
//             <div className='flex-shrink-0'>
//               <BsBagCheckFill className='h-5 w-5 text-blue-400' />
//             </div>
//             <div className='ml-3'>
//               <p className='text-sm font-medium text-blue-800'>
//                 Quick Checkout - Buy Now
//               </p>
//               <p className='text-xs text-blue-600 mt-1'>
//                 Your cart items are safe and will not be affected by this purchase
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
      
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
//           {Object.keys(checkoutItems).length === 0 ? (
//             <div className='text-center py-8'>
//               <p className='text-gray-500'>Your cart is empty</p>
//             </div>
//           ) : (
//             Object.entries(checkoutItems).map(([key, item]) => {
//               const isOutOfStock = item.availableQty !== undefined && item.availableQty <= 0;
//               return (
//                 <div key={key} className={`flex justify-between items-center border-b pb-4 ${isOutOfStock ? 'opacity-60' : ''}`}>
//                   <div className='flex items-center flex-1'>
//                     <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
//                       <img
//                         src={item.img || '/placeholder-product.png'}
//                         alt={item.name}
//                         className='h-full w-full object-cover object-center'
//                       />
//                     </div>
//                     <div className='ml-4 flex-1'>
//                       <h3 className='text-sm font-medium text-gray-900'>{item.name}</h3>
//                       <p className='mt-1 text-sm text-gray-500'>{item.variant} | {item.size}</p>
//                       <p className='mt-1 text-sm font-medium text-gray-900'>₹{item.price} x {item.qty}</p>
//                       {isOutOfStock && (
//                         <p className='mt-2 text-sm font-semibold text-red-600'>Out of Stock</p>
//                       )}
//                     </div>
//                   </div>
//                   {!isBuyNow && !isOutOfStock && (
//                     <div className='flex items-center space-x-2'>
//                       <button
//                         onClick={() => removeFromCart(key, 1, item.price, item.name, item.size, item.variant)}
//                         className='text-gray-400 hover:text-gray-500'
//                       >
//                         <AiOutlineMinusCircle size={20} />
//                       </button>
//                       <span className='w-6 text-center'>{item.qty}</span>
//                       <button
//                         onClick={() => addToCart(key, 1, item.price, item.name, item.size, item.variant)}
//                         className='text-gray-400 hover:text-gray-500'
//                       >
//                         <AiOutlinePlusCircle size={20} />
//                       </button>
//                     </div>
//                   )}
//                   {isBuyNow && (
//                     <div className='text-sm font-medium text-gray-900'>
//                       Qty: {item.qty}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Order Total */}
//         <div className='border-t border-gray-200 pt-6'>
//           <div className='flex justify-between text-base font-medium text-gray-900 mb-4'>
//             <p>Subtotal</p>
//             <p>₹{checkoutSubTotal}</p>
//           </div>
//           <div className='flex justify-between text-base font-medium text-gray-900 mb-4'>
//             <p>Shipping</p>
//             <p>FREE</p>
//           </div>
//           <div className='flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4'>
//             <p>Total</p>
//             <p>₹{checkoutSubTotal}</p>
//           </div>
          
//           {/* Check for out of stock items */}
//           {(hasOutOfStockItems || outOfStockItems.length > 0) && (
//             <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
//               <p className='text-red-700 font-semibold text-center mb-2'>
//                 ⚠️ Some items in your cart are out of stock or have insufficient quantity.
//               </p>
//               <ul className='text-sm text-red-600 list-disc pl-5'>
//                 {outOfStockItems.map((itemName, index) => (
//                   <li key={index}>{itemName} - Out of stock</li>
//                 ))}
//                 {Object.values(checkoutItems).map((item) => {
//                   if (item.availableQty > 0 && item.qty > item.availableQty) {
//                     return (
//                       <li key={item._id || item.name}>
//                         {item.name} - Only {item.availableQty} available
//                       </li>
//                     );
//                   }
//                   return null;
//                 })}
//               </ul>
//             </div>
//           )}

//           {/* Payment Button */}
//           <div className='mt-6'>
//             <button
//   onClick={handleProceedToPayment}
//   disabled={
//     Object.keys(checkoutItems).length === 0 || 
//     !selectedAddress || 
//     loading
//   }
//   className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
//     Object.keys(checkoutItems).length === 0 || 
//     !selectedAddress || 
//     loading
//       ? 'bg-gray-400 cursor-not-allowed'
//       : 'bg-indigo-600 hover:bg-indigo-700'
//   } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
// >
//   {loading ? (
//     'Processing...'
//   ) : (
//     <>
//       <BsBagCheckFill className='mr-2' />
//       Pay ₹{checkoutSubTotal}
//     </>
//   )}
// </button>
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
  
  // Stock tracking
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [hasOutOfStockItems, setHasOutOfStockItems] = useState(false);
  
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

  // Check stock availability for items
  const checkStockAvailability = async (items) => {
  try {
    // Get all unique product IDs or slugs
    const productIdentifiers = Array.from(
      new Set(
        Object.values(items).map(item => item._id || item.slug || Object.keys(items)[0])
      )
    );

    if (productIdentifiers.length === 0) {
      setHasOutOfStockItems(false);
      setOutOfStockItems([]);
      return items;
    }

    const response = await fetch(
      `/api/inventory/stock?productIds=${JSON.stringify(productIdentifiers)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to check stock');
    }

    const stockData = await response.json();
    const outOfStock = [];
    const updatedItems = { ...items };

    // Update items with stock information
    Object.entries(updatedItems).forEach(([key, item]) => {
      const stockInfo = stockData.find(s => 
        s.productId === item._id || s.slug === item.slug || s._id === item._id
      );

      if (stockInfo) {
        updatedItems[key] = {
          ...item,
          availableQty: stockInfo.availableQty,
          inStock: stockInfo.inStock
        };

        if (stockInfo.availableQty < (item.qty || 1)) {
          outOfStock.push(item.name);
        }
      }
    });

    setOutOfStockItems(outOfStock);
    setHasOutOfStockItems(outOfStock.length > 0);
    return updatedItems;
  } catch (error) {
    console.error('Error checking stock:', error);
    toast.error('Error checking product availability');
    // In case of error, don't block the UI - assume items are in stock
    return items;
  }
};

  useEffect(() => {
  if (isAuthenticated()) {
    fetchUserAddresses();
  }
  
  const initializeCheckout = async () => {
    try {
      if (router.query.buyNow === 'true') {
        const buyNowItem = sessionStorage.getItem('buyNowItem');
        if (buyNowItem) {
          const item = JSON.parse(buyNowItem);
          const itemsWithStock = await checkStockAvailability(item);
          setCheckoutItems(itemsWithStock);
          setIsBuyNow(true);
          
          // Calculate subtotal
          const subt = Object.values(itemsWithStock).reduce(
            (sum, item) => sum + (item.price * (item.qty || 1)), 
            0
          );
          setCheckoutSubTotal(subt);
        }
      } else {
        const itemsWithStock = await checkStockAvailability(cart);
        setCheckoutItems(itemsWithStock);
        setCheckoutSubTotal(subTotal);
        setIsBuyNow(false);
      }
    } catch (error) {
      console.error('Error initializing checkout:', error);
      // Fallback to original items if there's an error
      setCheckoutItems(router.query.buyNow === 'true' ? 
        JSON.parse(sessionStorage.getItem('buyNowItem') || '{}') : 
        cart
      );
    }
  };
  
  initializeCheckout();
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
    
    // Re-validate stock before proceeding to payment
    const updatedItems = await checkStockAvailability(checkoutItems);
    setCheckoutItems(updatedItems);
    
    // Check if any items are out of stock
    const hasOutOfStock = Object.values(updatedItems).some(
      item => (item.availableQty !== undefined && item.availableQty <= 0) || 
             (item.qty > (item.availableQty || 0))
    );
    
    if (hasOutOfStock) {
      toast.error('Some items in your cart are out of stock. Please update your cart.');
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
        theme: { color: '#8B6F5E' }
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
    <div className='min-h-screen px-2 py-6 sm:px-4' style={{
      background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)',
    }}>
      <Head>
        <title>Checkout - Your Store</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <Script 
        type="application/javascript" 
        crossOrigin="anonymous" 
      />
      
      <div className='max-w-5xl mx-auto'>
        <h1 className='font-bold text-2xl mb-6 text-center' style={{ color: '#8B6F5E' }}>Checkout</h1>
        
        {/* Buy Now Banner */}
        {isBuyNow && (
          <div className='mb-4 p-3 rounded-lg' style={{ 
            background: 'rgba(139, 111, 94, 0.1)', 
            borderLeft: '3px solid #8B6F5E' 
          }}>
            <div className='flex items-center'>
              <BsBagCheckFill className='h-4 w-4 mr-2' style={{ color: '#8B6F5E' }} />
              <div>
                <p className='text-sm font-medium' style={{ color: '#8B6F5E' }}>Quick Checkout</p>
                <p className='text-xs' style={{ color: '#A08374' }}>Your cart items are safe</p>
              </div>
            </div>
          </div>
        )}
        
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-4'>
            {/* Delivery Address Section */}
            <div className='rounded-lg p-4' style={{ 
              background: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(139, 111, 94, 0.2)'
            }}>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold' >Delivery Address</h2>
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className='flex items-center text-sm font-medium transition-colors'
                  
                >
                  <AiOutlinePlus className='mr-1 ' size={16}  /> Add New
                </button>
              </div>

              {/* Add New Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className='mb-4 p-3 rounded-lg' style={{ 
                  background: 'rgba(224, 202, 197, 0.3)',
                  border: '1px solid rgba(139, 111, 94, 0.2)'
                }}>
                  <h3 className='text-base font-medium mb-3' style={{ color: '#8B6F5E' }}>Add New Address</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Full Name</label>
                      <input
                        type='text'
                        name='fullName'
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
                        style={{ 
                          borderColor: 'rgba(139, 111, 94, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Phone Number</label>
                      <input
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        minLength={10}
                        maxLength={10}
                        onChange={handleInputChange}
                        className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
                        style={{ 
                          borderColor: 'rgba(139, 111, 94, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                        required
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Street Address</label>
                      <input
                        type='text'
                        name='street'
                        value={formData.street}
                        onChange={handleInputChange}
                        className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
                        style={{ 
                          borderColor: 'rgba(139, 111, 94, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>City</label>
                      <input
                        type='text'
                        name='city'
                        value={formData.city}
                        onChange={handleInputChange}
                        className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
                        style={{ 
                          borderColor: 'rgba(139, 111, 94, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>State</label>
                      <input
                        type='text'
                        name='state'
                        value={formData.state}
                        onChange={handleInputChange}
                        className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
                        style={{ 
                          borderColor: 'rgba(139, 111, 94, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Postal Code</label>
                      <input
                        type='text'
                        name='postalCode'
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
                        style={{ 
                          borderColor: 'rgba(139, 111, 94, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Country</label>
                      <input
                        type='text'
                        name='country'
                        value={formData.country}
                        onChange={handleInputChange}
                        className='w-full px-2 py-1.5 text-sm rounded border'
                        style={{ 
                          borderColor: 'rgba(139, 111, 94, 0.3)',
                          background: 'rgba(224, 202, 197, 0.3)'
                        }}
                        readOnly
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Landmark (Optional)</label>
                      <input
                        type='text'
                        name='landmark'
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
                        style={{ 
                          borderColor: 'rgba(139, 111, 94, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                      />
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        id='isDefault'
                        name='isDefault'
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className='h-3 w-3 rounded'
                        style={{ accentColor: '#8B6F5E' }}
                      />
                      <label htmlFor='isDefault' className='ml-2 text-xs' style={{ color: '#8B6F5E' }}>
                        Set as default
                      </label>
                    </div>
                  </div>
                  <div className='mt-3 flex justify-end space-x-2'>
                    <button
                      type='button'
                      onClick={() => setShowAddressForm(false)}
                      className='px-3 py-1.5 rounded text-xs font-medium transition-colors'
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#8B6F5E',
                        border: '1px solid rgba(139, 111, 94, 0.3)'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='px-3 py-1.5 rounded text-xs font-medium text-white transition-colors'
                      style={{ background: '#8B6F5E' }}
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className='grid grid-cols-1 gap-3'>
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div 
                      key={address._id}
                      onClick={() => setSelectedAddress(address._id)}
                      className='p-3 rounded cursor-pointer transition-all duration-200'
                      style={{ 
                        background: selectedAddress === address._id 
                          ? '#FFF2EF' 
                          : 'rgba(255, 255, 255, 0.5)',
                        border: selectedAddress === address._id 
                          ? '2px solid #505460' 
                          : '1px solid rgba(139, 111, 94, 0.2)'
                      }}
                    >
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <h4 className='font-medium text-sm' >{address.fullName}</h4>
                          <p className='text-xs mt-1' >
                            {address.street}, {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className='text-xs' >Phone: {address.phone}</p>
                          {address.landmark && (
                            <p className='text-xs' >Landmark: {address.landmark}</p>
                          )}
                        </div>
                        <div className='flex items-center gap-2'>
                          {selectedAddress === address._id && (
                            <div className='h-4 w-4 rounded-full flex items-center justify-center text-white' style={{ background: '#0BAF16' }}>
                              <AiOutlineCheck size={10} />
                            
                            </div>
                          )}
                          {selectedAddress !== address._id && (
                            <div className='h-4 w-4 rounded-full flex items-center justify-center text-white' style={{ border: '1px solid #8B6F5E' }}>
                              <AiOutlineCheck size={10} />
                            </div>
                          )}
                          {address.isDefault && (
                            <span className='px-2 py-0.5 rounded-full text-xs font-medium' style={{ 
                              background: 'rgba(139, 111, 94, 0.2)',
                              color: '#8B6F5E'
                            }}>
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-6'>
                    <p className='text-sm' style={{ color: '#A08374' }}>No saved addresses. Please add one to continue.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className='rounded-lg p-4' style={{ 
              background: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(139, 111, 94, 0.2)'
            }}>
              <h2 className='text-lg font-semibold mb-3' >Order Items</h2>
              
              <div className='space-y-3'>
                {Object.keys(checkoutItems).length === 0 ? (
                  <div className='text-center py-6'>
                    <p className='text-sm' style={{ color: '#A08374' }}>Your cart is empty</p>
                  </div>
                ) : (
                  Object.entries(checkoutItems).map(([key, item]) => {
                    const isOutOfStock = item.availableQty !== undefined && item.availableQty <= 0;
                    return (
                      <div key={key} className={`flex items-center gap-3 pb-3 border-b ${isOutOfStock ? 'opacity-60' : ''}`} style={{ borderColor: 'rgba(139, 111, 94, 0.1)' }}>
                        <div className='h-14 w-14 flex-shrink-0 overflow-hidden rounded' style={{ border: '1px solid rgba(139, 111, 94, 0.2)' }}>
                          <img
                            src={item.img || '/placeholder-product.png'}
                            alt={item.name}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='text-sm font-medium truncate' style={{ color: '#8B6F5E' }}>{item.name}</h3>
                          <p className='text-xs' style={{ color: '#A08374' }}>{item.variant} | {item.size}</p>
                          <p className='text-xs font-medium mt-1' style={{ color: '#8B6F5E' }}>₹{item.price} x {item.qty}</p>
                          {isOutOfStock && (
                            <p className='text-xs font-semibold text-red-600 mt-1'>Out of Stock</p>
                          )}
                        </div>
                        {!isBuyNow && !isOutOfStock && (
                          <div className='flex items-center gap-1'>
                            <button
                              onClick={() => removeFromCart(key, 1, item.price, item.name, item.size, item.variant)}
                              className='transition-colors'
                              style={{ color: '#A08374' }}
                            >
                              <AiOutlineMinusCircle size={18} />
                            </button>
                            <span className='w-6 text-center text-xs font-medium' style={{ color: '#8B6F5E' }}>{item.qty}</span>
                            <button
                              onClick={() => addToCart(key, 1, item.price, item.name, item.size, item.variant)}
                              className='transition-colors'
                              style={{ color: '#A08374' }}
                            >
                              <AiOutlinePlusCircle size={18} />
                            </button>
                          </div>
                        )}
                        {isBuyNow && (
                          <div className='text-xs font-medium' style={{ color: '#8B6F5E' }}>
                            Qty: {item.qty}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className='lg:col-span-1'>
            <div className='rounded-lg p-4 sticky top-4' style={{ 
              background: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(139, 111, 94, 0.2)'
            }}>
              <h2 className='text-lg font-semibold mb-4' >Order Summary</h2>
              
              <div className='space-y-2 mb-4 pb-4' style={{ borderBottom: '1px solid rgba(139, 111, 94, 0.1)' }}>
                <div className='flex  justify-between text-sm'>
                  <span >Subtotal</span>
                  <span className='font-medium font-sans' >₹{checkoutSubTotal}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span >Shipping</span>
                  <span className='font-medium' >FREE</span>
                </div>
              </div>
              
              <div className='flex justify-between text-base font-bold mb-4'>
                <span >Total</span>
                <span className='font-medium font-sans' >₹{checkoutSubTotal}</span>
              </div>
              
              {/* Stock Warning */}
              {(hasOutOfStockItems || outOfStockItems.length > 0) && (
                <div className='mb-4 p-3 rounded-lg' style={{ 
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  <p className='text-red-700 font-semibold text-xs text-center mb-2'>
                    ⚠️ Stock Issues
                  </p>
                  <ul className='text-xs text-red-600 space-y-1'>
                    {outOfStockItems.map((itemName, index) => (
                      <li key={index} className='truncate'>• {itemName} - Out of stock</li>
                    ))}
                    {Object.values(checkoutItems).map((item) => {
                      if (item.availableQty > 0 && item.qty > item.availableQty) {
                        return (
                          <li key={item._id || item.name} className='truncate'>
                            • {item.name} - Only {item.availableQty} available
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={
                  Object.keys(checkoutItems).length === 0 || 
                  !selectedAddress || 
                  loading
                }
                className={`w-full flex justify-center items-center py-2.5 rounded-lg text-sm font-medium text-white transition-all ${
                  Object.keys(checkoutItems).length === 0 || 
                  !selectedAddress || 
                  loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:opacity-90'
                }`}
                style={{ background: '#000000' }}
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <BsBagCheckFill className='mr-2' size={16} />
                    Pay ₹{checkoutSubTotal}
                  </>
                )}
              </button>
              
              <p className='text-xs text-center mt-3' style={{ color: '#A08374' }}>
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
