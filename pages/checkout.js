
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
    
    const updatedItems = await checkStockAvailability(checkoutItems);
    setCheckoutItems(updatedItems);
    
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
    <div className='min-h-screen py-8' style={{
      background: 'radial-gradient(circle at top, #FFF2EF 0%, #F5E6E3 30%, #E8D5D1 60%, #E0CAC5 100%)',
    }}>
      <Head>
        <title>Checkout - Your Store</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <Script 
        type="application/javascript" 
        crossOrigin="anonymous" 
      />
      
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
        <h1 className='font-bold text-4xl my-10 text-center text-gray-800 tracking-tight'>
          Secure Checkout
        </h1>
        
        {/* Buy Now Banner */}
        {isBuyNow && (
          <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-5 mb-8 transform hover:scale-[1.01] transition-transform'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 bg-white rounded-full p-3'>
                <BsBagCheckFill className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-base font-semibold text-white'>
                  Quick Checkout - Buy Now
                </p>
                <p className='text-sm text-blue-100 mt-1'>
                  Your cart items are safe and will not be affected by this purchase
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Delivery Address Section */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-rose-100'>
          <div className='flex justify-between items-center mb-8'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold shadow-md'>
                1
              </div>
              <h2 className='text-2xl font-bold text-gray-800'>Select Delivery Address</h2>
            </div>
            <button 
              onClick={() => setShowAddressForm(!showAddressForm)}
              className='flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105'
            >
              <AiOutlinePlus className='text-lg' /> Add New Address
            </button>
          </div>

          {/* Add New Address Form */}
          {showAddressForm && (
            <form onSubmit={handleAddressSubmit} className='mb-8 p-6 border-2 border-rose-200 rounded-2xl bg-gradient-to-br from-white to-rose-50/50'>
              <h3 className='text-xl font-semibold mb-6 text-gray-800'>Add New Address</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Full Name</label>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Phone Number</label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Street Address</label>
                  <input
                    type='text'
                    name='street'
                    value={formData.street}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>City</label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>State</label>
                  <input
                    type='text'
                    name='state'
                    value={formData.state}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Postal Code</label>
                  <input
                    type='text'
                    name='postalCode'
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Country</label>
                  <input
                    type='text'
                    name='country'
                    value={formData.country}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm bg-gray-50 text-gray-600'
                    readOnly
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Landmark (Optional)</label>
                  <input
                    type='text'
                    name='landmark'
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all'
                  />
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='isDefault'
                    name='isDefault'
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className='h-5 w-5 text-rose-600 focus:ring-rose-500 border-gray-300 rounded cursor-pointer'
                  />
                  <label htmlFor='isDefault' className='ml-3 block text-sm font-medium text-gray-700 cursor-pointer'>
                    Set as default address
                  </label>
                </div>
              </div>
              <div className='mt-6 flex justify-end gap-3'>
                <button
                  type='button'
                  onClick={() => setShowAddressForm(false)}
                  className='px-6 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-6 py-2.5 border-2 border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-md hover:shadow-lg transition-all transform hover:scale-105'
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Address List */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div 
                  key={address._id}
                  onClick={() => setSelectedAddress(address._id)}
                  className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                    selectedAddress === address._id 
                      ? 'border-rose-500 ring-4 ring-rose-100 bg-gradient-to-br from-rose-50 to-white shadow-lg' 
                      : 'border-gray-200 hover:border-rose-300 bg-white hover:shadow-md'
                  }`}
                >
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <h4 className='font-semibold text-gray-900 text-lg'>{address.fullName}</h4>
                      <p className='text-sm text-gray-600 mt-2'>{address.street}</p>
                      <p className='text-sm text-gray-600'>{address.city}, {address.state} {address.postalCode}</p>
                      <p className='text-sm text-gray-600'>{address.country}</p>
                      <p className='text-sm text-gray-700 mt-2 font-medium'>📞 {address.phone}</p>
                      {address.landmark && (
                        <p className='text-sm text-gray-500 mt-1'>📍 {address.landmark}</p>
                      )}
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      {selectedAddress === address._id && (
                        <div className='h-7 w-7 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-md'>
                          <AiOutlineCheck size={16} />
                        </div>
                      )}
                      {address.isDefault && (
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'>
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='md:col-span-2 text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300'>
                <p className='text-gray-500 text-lg'>No saved addresses found. Please add an address to continue.</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-rose-100'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold shadow-md'>
              2
            </div>
            <h2 className='text-2xl font-bold text-gray-800'>Order Summary</h2>
          </div>
          
          {/* Cart Items */}
          <div className='space-y-4 mb-8'>
            {Object.keys(checkoutItems).length === 0 ? (
              <div className='text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300'>
                <p className='text-gray-500 text-lg'>Your cart is empty</p>
              </div>
            ) : (
              Object.entries(checkoutItems).map(([key, item]) => {
                const isOutOfStock = item.availableQty !== undefined && item.availableQty <= 0;
                return (
                  <div key={key} className={`flex justify-between items-center bg-gradient-to-r from-white to-rose-50/30 rounded-2xl p-5 border-2 border-gray-100 hover:shadow-md transition-all ${isOutOfStock ? 'opacity-60' : ''}`}>
                    <div className='flex items-center flex-1 gap-4'>
                      <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm'>
                        <img
                          src={item.img || '/placeholder-product.png'}
                          alt={item.name}
                          className='h-full w-full object-cover object-center'
                        />
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-base font-semibold text-gray-900'>{item.name}</h3>
                        <p className='mt-1 text-sm text-gray-600'>{item.variant} | {item.size}</p>
                        <p className='mt-2 text-base font-bold text-rose-600'>₹{item.price} × {item.qty}</p>
                        {isOutOfStock && (
                          <p className='mt-2 text-sm font-bold text-red-600 bg-red-50 inline-block px-3 py-1 rounded-full'>
                            Out of Stock
                          </p>
                        )}
                      </div>
                    </div>
                    {!isBuyNow && !isOutOfStock && (
                      <div className='flex items-center gap-3 bg-white rounded-xl px-4 py-2 border-2 border-gray-200'>
                        <button
                          onClick={() => removeFromCart(key, 1, item.price, item.name, item.size, item.variant)}
                          className='text-gray-400 hover:text-rose-600 transition-colors'
                        >
                          <AiOutlineMinusCircle size={24} />
                        </button>
                        <span className='w-8 text-center font-semibold text-gray-800'>{item.qty}</span>
                        <button
                          onClick={() => addToCart(key, 1, item.price, item.name, item.size, item.variant)}
                          className='text-gray-400 hover:text-rose-600 transition-colors'
                        >
                          <AiOutlinePlusCircle size={24} />
                        </button>
                      </div>
                    )}
                    {isBuyNow && (
                      <div className='text-sm font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-xl'>
                        Qty: {item.qty}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Order Total */}
          <div className='bg-gradient-to-br from-rose-50 to-white rounded-2xl p-6 border-2 border-rose-100'>
            <div className='flex justify-between text-base font-medium text-gray-700 mb-3'>
              <p>Subtotal</p>
              <p className='font-semibold'>₹{checkoutSubTotal}</p>
            </div>
            <div className='flex justify-between text-base font-medium text-gray-700 mb-4'>
              <p>Shipping</p>
              <p className='font-semibold text-green-600'>FREE</p>
            </div>
            <div className='flex justify-between text-xl font-bold text-gray-900 border-t-2 border-rose-200 pt-4'>
              <p>Total</p>
              <p className='text-rose-600'>₹{checkoutSubTotal}</p>
            </div>
            
            {/* Check for out of stock items */}
            {(hasOutOfStockItems || outOfStockItems.length > 0) && (
              <div className='mt-6 p-5 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl shadow-md'>
                <p className='text-red-800 font-bold text-center mb-3 text-lg'>
                  ⚠️ Some items are out of stock or have insufficient quantity
                </p>
                <ul className='text-sm text-red-700 space-y-2'>
                  {outOfStockItems.map((itemName, index) => (
                    <li key={index} className='flex items-center gap-2'>
                      <span className='w-2 h-2 bg-red-500 rounded-full'></span>
                      {itemName} - Out of stock
                    </li>
                  ))}
                  {Object.values(checkoutItems).map((item) => {
                    if (item.availableQty > 0 && item.qty > item.availableQty) {
                      return (
                        <li key={item._id || item.name} className='flex items-center gap-2'>
                          <span className='w-2 h-2 bg-red-500 rounded-full'></span>
                          {item.name} - Only {item.availableQty} available
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            )}

            {/* Payment Button */}
            <div className='mt-6'>
              <button
                onClick={handleProceedToPayment}
                disabled={
                  Object.keys(checkoutItems).length === 0 || 
                  !selectedAddress || 
                  loading
                }
                className={`w-full flex justify-center items-center py-4 px-6 border-2 border-transparent rounded-2xl text-lg font-bold text-white shadow-lg transform transition-all duration-200 ${
                  Object.keys(checkoutItems).length === 0 || 
                  !selectedAddress || 
                  loading
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <div className='flex items-center gap-3'>
                    <div className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin'></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <BsBagCheckFill className='mr-3 text-xl' />
                    Pay ₹{checkoutSubTotal}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;