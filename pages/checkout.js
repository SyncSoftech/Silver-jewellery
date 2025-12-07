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
//         theme: { color: '#8B6F5E' }
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
//     <div className='min-h-screen px-2 py-6 sm:px-4' style={{
//       background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)',
//     }}>
//       <Head>
//         <title>Checkout - Your Store</title>
//         <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
//       </Head>
//       <Script
//         type="application/javascript"
//         crossOrigin="anonymous"
//       />

//       <div className='max-w-5xl mx-auto'>
//         <h1 className='font-bold text-2xl mb-6 text-center' style={{ color: '#8B6F5E' }}>Checkout</h1>

//         {/* Buy Now Banner */}
//         {isBuyNow && (
//           <div className='mb-4 p-3 rounded-lg' style={{
//             background: 'rgba(139, 111, 94, 0.1)',
//             borderLeft: '3px solid #8B6F5E'
//           }}>
//             <div className='flex items-center'>
//               <BsBagCheckFill className='h-4 w-4 mr-2' style={{ color: '#8B6F5E' }} />
//               <div>
//                 <p className='text-sm font-medium' style={{ color: '#8B6F5E' }}>Quick Checkout</p>
//                 <p className='text-xs' style={{ color: '#A08374' }}>Your cart items are safe</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
//           {/* Main Content */}
//           <div className='lg:col-span-2 space-y-4'>
//             {/* Delivery Address Section */}
//             <div className='rounded-lg p-4' style={{
//               background: 'rgba(255, 255, 255, 0.7)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(139, 111, 94, 0.2)'
//             }}>
//               <div className='flex justify-between items-center mb-4'>
//                 <h2 className='text-lg font-semibold' >Delivery Address</h2>
//                 <button
//                   onClick={() => setShowAddressForm(!showAddressForm)}
//                   className='flex items-center text-sm font-medium transition-colors'

//                 >
//                   <AiOutlinePlus className='mr-1 ' size={16}  /> Add New
//                 </button>
//               </div>

//               {/* Add New Address Form */}
//               {showAddressForm && (
//                 <form onSubmit={handleAddressSubmit} className='mb-4 p-3 rounded-lg' style={{
//                   background: 'rgba(224, 202, 197, 0.3)',
//                   border: '1px solid rgba(139, 111, 94, 0.2)'
//                 }}>
//                   <h3 className='text-base font-medium mb-3' style={{ color: '#8B6F5E' }}>Add New Address</h3>
//                   <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
//                     <div>
//                       <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Full Name</label>
//                       <input
//                         type='text'
//                         name='fullName'
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
//                         style={{
//                           borderColor: 'rgba(139, 111, 94, 0.3)',
//                           background: 'rgba(255, 255, 255, 0.9)'
//                         }}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Phone Number</label>
//                       <input
//                         type='tel'
//                         name='phone'
//                         value={formData.phone}
//                         minLength={10}
//                         maxLength={10}
//                         onChange={handleInputChange}
//                         className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
//                         style={{
//                           borderColor: 'rgba(139, 111, 94, 0.3)',
//                           background: 'rgba(255, 255, 255, 0.9)'
//                         }}
//                         required
//                       />
//                     </div>
//                     <div className='md:col-span-2'>
//                       <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Street Address</label>
//                       <input
//                         type='text'
//                         name='street'
//                         value={formData.street}
//                         onChange={handleInputChange}
//                         className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
//                         style={{
//                           borderColor: 'rgba(139, 111, 94, 0.3)',
//                           background: 'rgba(255, 255, 255, 0.9)'
//                         }}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>City</label>
//                       <input
//                         type='text'
//                         name='city'
//                         value={formData.city}
//                         onChange={handleInputChange}
//                         className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
//                         style={{
//                           borderColor: 'rgba(139, 111, 94, 0.3)',
//                           background: 'rgba(255, 255, 255, 0.9)'
//                         }}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>State</label>
//                       <input
//                         type='text'
//                         name='state'
//                         value={formData.state}
//                         onChange={handleInputChange}
//                         className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
//                         style={{
//                           borderColor: 'rgba(139, 111, 94, 0.3)',
//                           background: 'rgba(255, 255, 255, 0.9)'
//                         }}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Postal Code</label>
//                       <input
//                         type='text'
//                         name='postalCode'
//                         value={formData.postalCode}
//                         onChange={handleInputChange}
//                         className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
//                         style={{
//                           borderColor: 'rgba(139, 111, 94, 0.3)',
//                           background: 'rgba(255, 255, 255, 0.9)'
//                         }}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Country</label>
//                       <input
//                         type='text'
//                         name='country'
//                         value={formData.country}
//                         onChange={handleInputChange}
//                         className='w-full px-2 py-1.5 text-sm rounded border'
//                         style={{
//                           borderColor: 'rgba(139, 111, 94, 0.3)',
//                           background: 'rgba(224, 202, 197, 0.3)'
//                         }}
//                         readOnly
//                       />
//                     </div>
//                     <div className='md:col-span-2'>
//                       <label className='block text-xs font-medium mb-1' style={{ color: '#8B6F5E' }}>Landmark (Optional)</label>
//                       <input
//                         type='text'
//                         name='landmark'
//                         value={formData.landmark}
//                         onChange={handleInputChange}
//                         className='w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1'
//                         style={{
//                           borderColor: 'rgba(139, 111, 94, 0.3)',
//                           background: 'rgba(255, 255, 255, 0.9)'
//                         }}
//                       />
//                     </div>
//                     <div className='flex items-center'>
//                       <input
//                         type='checkbox'
//                         id='isDefault'
//                         name='isDefault'
//                         checked={formData.isDefault}
//                         onChange={handleInputChange}
//                         className='h-3 w-3 rounded'
//                         style={{ accentColor: '#8B6F5E' }}
//                       />
//                       <label htmlFor='isDefault' className='ml-2 text-xs' style={{ color: '#8B6F5E' }}>
//                         Set as default
//                       </label>
//                     </div>
//                   </div>
//                   <div className='mt-3 flex justify-end space-x-2'>
//                     <button
//                       type='button'
//                       onClick={() => setShowAddressForm(false)}
//                       className='px-3 py-1.5 rounded text-xs font-medium transition-colors'
//                       style={{
//                         background: 'rgba(255, 255, 255, 0.9)',
//                         color: '#8B6F5E',
//                         border: '1px solid rgba(139, 111, 94, 0.3)'
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type='submit'
//                       className='px-3 py-1.5 rounded text-xs font-medium text-white transition-colors'
//                       style={{ background: '#8B6F5E' }}
//                     >
//                       Save Address
//                     </button>
//                   </div>
//                 </form>
//               )}

//               {/* Address List */}
//               <div className='grid grid-cols-1 gap-3'>
//                 {addresses.length > 0 ? (
//                   addresses.map((address) => (
//                     <div
//                       key={address._id}
//                       onClick={() => setSelectedAddress(address._id)}
//                       className='p-3 rounded cursor-pointer transition-all duration-200'
//                       style={{
//                         background: selectedAddress === address._id
//                           ? '#FFF2EF'
//                           : 'rgba(255, 255, 255, 0.5)',
//                         border: selectedAddress === address._id
//                           ? '2px solid #505460'
//                           : '1px solid rgba(139, 111, 94, 0.2)'
//                       }}
//                     >
//                       <div className='flex justify-between items-start'>
//                         <div className='flex-1'>
//                           <h4 className='font-medium text-sm' >{address.fullName}</h4>
//                           <p className='text-xs mt-1' >
//                             {address.street}, {address.city}, {address.state} {address.postalCode}
//                           </p>
//                           <p className='text-xs' >Phone: {address.phone}</p>
//                           {address.landmark && (
//                             <p className='text-xs' >Landmark: {address.landmark}</p>
//                           )}
//                         </div>
//                         <div className='flex items-center gap-2'>
//                           {selectedAddress === address._id && (
//                             <div className='h-4 w-4 rounded-full flex items-center justify-center text-white' style={{ background: '#0BAF16' }}>
//                               <AiOutlineCheck size={10} />

//                             </div>
//                           )}
//                           {selectedAddress !== address._id && (
//                             <div className='h-4 w-4 rounded-full flex items-center justify-center text-white' style={{ border: '1px solid #8B6F5E' }}>
//                               <AiOutlineCheck size={10} />
//                             </div>
//                           )}
//                           {address.isDefault && (
//                             <span className='px-2 py-0.5 rounded-full text-xs font-medium' style={{
//                               background: 'rgba(139, 111, 94, 0.2)',
//                               color: '#8B6F5E'
//                             }}>
//                               Default
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className='text-center py-6'>
//                     <p className='text-sm' style={{ color: '#A08374' }}>No saved addresses. Please add one to continue.</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Order Items */}
//             <div className='rounded-lg p-4' style={{
//               background: 'rgba(255, 255, 255, 0.7)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(139, 111, 94, 0.2)'
//             }}>
//               <h2 className='text-lg font-semibold mb-3' >Order Items</h2>

//               <div className='space-y-3'>
//                 {Object.keys(checkoutItems).length === 0 ? (
//                   <div className='text-center py-6'>
//                     <p className='text-sm' style={{ color: '#A08374' }}>Your cart is empty</p>
//                   </div>
//                 ) : (
//                   Object.entries(checkoutItems).map(([key, item]) => {
//                     const isOutOfStock = item.availableQty !== undefined && item.availableQty <= 0;
//                     return (
//                       <div key={key} className={`flex items-center gap-3 pb-3 border-b ${isOutOfStock ? 'opacity-60' : ''}`} style={{ borderColor: 'rgba(139, 111, 94, 0.1)' }}>
//                         <div className='h-14 w-14 flex-shrink-0 overflow-hidden rounded' style={{ border: '1px solid rgba(139, 111, 94, 0.2)' }}>
//                           <img
//                             src={item.img || '/placeholder-product.png'}
//                             alt={item.name}
//                             className='h-full w-full object-cover'
//                           />
//                         </div>
//                         <div className='flex-1 min-w-0'>
//                           <h3 className='text-sm font-medium truncate' style={{ color: '#8B6F5E' }}>{item.name}</h3>
//                           <p className='text-xs' style={{ color: '#A08374' }}>{item.variant} | {item.size}</p>
//                           <p className='text-xs font-medium mt-1' style={{ color: '#8B6F5E' }}>₹{item.price} x {item.qty}</p>
//                           {isOutOfStock && (
//                             <p className='text-xs font-semibold text-red-600 mt-1'>Out of Stock</p>
//                           )}
//                         </div>
//                         {!isBuyNow && !isOutOfStock && (
//                           <div className='flex items-center gap-1'>
//                             <button
//                               onClick={() => removeFromCart(key, 1, item.price, item.name, item.size, item.variant)}
//                               className='transition-colors'
//                               style={{ color: '#A08374' }}
//                             >
//                               <AiOutlineMinusCircle size={18} />
//                             </button>
//                             <span className='w-6 text-center text-xs font-medium' style={{ color: '#8B6F5E' }}>{item.qty}</span>
//                             <button
//                               onClick={() => addToCart(key, 1, item.price, item.name, item.size, item.variant)}
//                               className='transition-colors'
//                               style={{ color: '#A08374' }}
//                             >
//                               <AiOutlinePlusCircle size={18} />
//                             </button>
//                           </div>
//                         )}
//                         {isBuyNow && (
//                           <div className='text-xs font-medium' style={{ color: '#8B6F5E' }}>
//                             Qty: {item.qty}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Order Summary Sidebar */}
//           <div className='lg:col-span-1'>
//             <div className='rounded-lg p-4 sticky top-4' style={{
//               background: 'rgba(255, 255, 255, 0.7)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(139, 111, 94, 0.2)'
//             }}>
//               <h2 className='text-lg font-semibold mb-4' >Order Summary</h2>

//               <div className='space-y-2 mb-4 pb-4' style={{ borderBottom: '1px solid rgba(139, 111, 94, 0.1)' }}>
//                 <div className='flex  justify-between text-sm'>
//                   <span >Subtotal</span>
//                   <span className='font-medium font-sans' >₹{checkoutSubTotal}</span>
//                 </div>
//                 <div className='flex justify-between text-sm'>
//                   <span >Shipping</span>
//                   <span className='font-medium' >FREE</span>
//                 </div>
//               </div>

//               <div className='flex justify-between text-base font-bold mb-4'>
//                 <span >Total</span>
//                 <span className='font-medium font-sans' >₹{checkoutSubTotal}</span>
//               </div>

//               {/* Stock Warning */}
//               {(hasOutOfStockItems || outOfStockItems.length > 0) && (
//                 <div className='mb-4 p-3 rounded-lg' style={{
//                   background: 'rgba(239, 68, 68, 0.1)',
//                   border: '1px solid rgba(239, 68, 68, 0.3)'
//                 }}>
//                   <p className='text-red-700 font-semibold text-xs text-center mb-2'>
//                     ⚠️ Stock Issues
//                   </p>
//                   <ul className='text-xs text-red-600 space-y-1'>
//                     {outOfStockItems.map((itemName, index) => (
//                       <li key={index} className='truncate'>• {itemName} - Out of stock</li>
//                     ))}
//                     {Object.values(checkoutItems).map((item) => {
//                       if (item.availableQty > 0 && item.qty > item.availableQty) {
//                         return (
//                           <li key={item._id || item.name} className='truncate'>
//                             • {item.name} - Only {item.availableQty} available
//                           </li>
//                         );
//                       }
//                       return null;
//                     })}
//                   </ul>
//                 </div>
//               )}

//               {/* Payment Button */}
//               <button
//                 onClick={handleProceedToPayment}
//                 disabled={
//                   Object.keys(checkoutItems).length === 0 ||
//                   !selectedAddress ||
//                   loading
//                 }
//                 className={`w-full flex justify-center items-center py-2.5 rounded-lg text-sm font-medium text-white transition-all ${
//                   Object.keys(checkoutItems).length === 0 ||
//                   !selectedAddress ||
//                   loading
//                     ? 'opacity-50 cursor-not-allowed'
//                     : 'hover:opacity-90'
//                 }`}
//                 style={{ background: '#000000' }}
//               >
//                 {loading ? (
//                   'Processing...'
//                 ) : (
//                   <>
//                     <BsBagCheckFill className='mr-2' size={16} />
//                     Pay ₹{checkoutSubTotal}
//                   </>
//                 )}
//               </button>

//               <p className='text-xs text-center mt-3' style={{ color: '#A08374' }}>
//                 Secure payment powered by Razorpay
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

// pages/checkout.js
import React, { useEffect, useState } from "react";
import {
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiOutlinePlus,
  AiOutlineCheck,
} from "react-icons/ai";
import { BsBagCheckFill } from "react-icons/bs";
import Link from "next/link";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { isAuthenticated, redirectToLogin } from "../utils/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = ({ cart, clearCart, addToCart, removeFromCart, subTotal }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [pinStatus, setPinStatus] = useState({
    loading: false,
    valid: null, // true, false, or null (not checked yet)
    message: "",
  });

  const checkPincodeRealtime = async (postalCode) => {
    if (postalCode.length !== 6) {
      setPinStatus({
        loading: false,
        valid: null,
        message: "",
      });
      return;
    }

    setPinStatus({
      loading: true,
      valid: null,
      message: "Checking...",
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/pincode?pincode=${postalCode}`
      );

      const data = await res.json();

      const isServiceable =
        data?.delivery_codes &&
        data.delivery_codes.length > 0 &&
        data.delivery_codes[0]?.postal_code?.pin;

      if (isServiceable) {
        setPinStatus({
          loading: false,
          valid: true,
          message: "Delivery available!",
        });
      } else {
        setPinStatus({
          loading: false,
          valid: false,
          message: "Not serviceable at this location.",
        });
      }
    } catch (error) {
      console.error("Pin check error:", error);
      setPinStatus({
        loading: false,
        valid: false,
        message: "Error checking pincode",
      });
    }
  };

  // Buy Now State
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState({});
  const [checkoutSubTotal, setCheckoutSubTotal] = useState(0);

  // Coupon State - improved
  const [coupon, setCoupon] = useState({
    code: "",
    discount: 0,
    discountType: "",
    value: 0,
    isApplied: false,
    loading: false,
    error: "",
    warning: "",
  });

  // Stock tracking
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [hasOutOfStockItems, setHasOutOfStockItems] = useState(false);

  // Helper: try to get userId from localStorage (if you store it)
  const getUserIdFromStorage = () => {
    try {
      // common patterns: "user", "userInfo", "userId"
      const maybeUser =
        localStorage.getItem("user") || localStorage.getItem("userInfo");
      if (maybeUser) {
        const parsed = JSON.parse(maybeUser);
        if (parsed && (parsed._id || parsed.id)) {
          return parsed._id || parsed.id;
        }
      }
      const maybeId = localStorage.getItem("userId");
      if (maybeId) return maybeId;
      // If you store JWT, you could decode it here to extract sub (not implemented to avoid depending on libs)
      return null;
    } catch (e) {
      return null;
    }
  };

  // Calculate order total with coupon
  const calculateOrderTotal = () => {
    let total = isBuyNow ? checkoutSubTotal : subTotal;

    // Apply coupon discount if applied
    if (coupon.isApplied && coupon.discount > 0) {
      total = Math.max(0, total - coupon.discount);
    }

    // TODO: add shipping or tax adjustments if required
    return total;
  };

  // Build items payload for coupon validation & pretransaction
  const buildItemsPayload = (itemsObj) => {
    // itemsObj is a map: key -> item
    const items = Object.values(itemsObj || {}).map((item) => {
      // Normalize fields so server gets product object with _id and category
      const productObj = item.product || {};
      // If item itself already contains _id and category at top-level, include them
      const product = {
        _id:
          productObj._id ||
          item._id ||
          productObj.id ||
          item.productId ||
          item.productId,
        category:
          productObj.category ||
          item.category ||
          productObj.categories ||
          item.categories ||
          [],
      };
      return {
        product,
        quantity: item.qty || item.quantity || item.qtyOrdered || 1,
        price: item.price || item.unitPrice || 0,
        name: item.name || item.title || "",
      };
    });
    return items;
  };

  // Handle coupon application
  const handleApplyCoupon = async (e) => {
    e && e.preventDefault();

    // clear previous errors/warnings
    setCoupon((prev) => ({ ...prev, error: "", warning: "" }));

    const code = (coupon.code || "").trim();
    if (!code) {
      setCoupon((prev) => ({ ...prev, error: "Please enter a coupon code" }));
      return;
    }

    const normalizedCode = code.toUpperCase();

    // compute cart total / items depending on checkout mode
    const currentTotal = isBuyNow ? checkoutSubTotal : subTotal;
    const itemsPayload = buildItemsPayload(isBuyNow ? checkoutItems : cart);

    if (!itemsPayload.length) {
      setCoupon((prev) => ({
        ...prev,
        error: "No items in cart to validate coupon against",
      }));
      return;
    }

    const userId = getUserIdFromStorage(); // optional - server will skip per-user checks if absent

    try {
      setCoupon((prev) => ({ ...prev, loading: true, error: "", warning: "" }));

      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: normalizedCode,
          cartTotal: currentTotal,
          items: itemsPayload,
          ...(userId ? { userId } : {}),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Use discountApplied from server as the canonical discount amount
        setCoupon((prev) => ({
          ...prev,
          code: normalizedCode,
          isApplied: true,
          discount: Number(data.data.discountApplied) || 0,
          discountType: data.data.discountType || "",
          value: data.data.value || 0,
          error: "",
          warning: data.data.warning || "",
        }));
        toast.success("Coupon applied successfully!");
      } else {
        // server responded with failure
        setCoupon((prev) => ({
          ...prev,
          isApplied: false,
          discount: 0,
          error: data.message || "Failed to apply coupon",
          warning: data.warning || "",
        }));
        if (data.message) toast.error(data.message);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCoupon((prev) => ({
        ...prev,
        isApplied: false,
        discount: 0,
        error: "An error occurred while applying the coupon",
      }));
      toast.error("An error occurred while applying the coupon");
    } finally {
      setCoupon((prev) => ({ ...prev, loading: false }));
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    setCoupon({
      code: "",
      discount: 0,
      discountType: "",
      value: 0,
      isApplied: false,
      loading: false,
      error: "",
      warning: "",
    });
    toast.info("Coupon removed");
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    landmark: "",
    addressType: "shipping",
    isDefault: false,
  });

  // Check stock availability for items
  const checkStockAvailability = async (items) => {
    try {
      // Get all unique product IDs or slugs
      const productIdentifiers = Array.from(
        new Set(
          Object.values(items).map(
            (item) =>
              item._id ||
              item.product?._id ||
              item.slug ||
              Object.keys(items)[0]
          )
        )
      );

      if (productIdentifiers.length === 0) {
        setHasOutOfStockItems(false);
        setOutOfStockItems([]);
        return items;
      }

      const response = await fetch(
        `/api/inventory/stock?productIds=${encodeURIComponent(
          JSON.stringify(productIdentifiers)
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to check stock");
      }

      const stockData = await response.json();
      const outOfStock = [];
      const updatedItems = { ...items };

      // Update items with stock information
      Object.entries(updatedItems).forEach(([key, item]) => {
        const stockInfo = stockData.find(
          (s) =>
            s.productId === (item._id || item.product?._id) ||
            s.slug === item.slug ||
            s._id === (item._id || item.product?._id)
        );

        if (stockInfo) {
          updatedItems[key] = {
            ...item,
            availableQty: stockInfo.availableQty,
            inStock: stockInfo.inStock,
          };

          if (stockInfo.availableQty < (item.qty || item.quantity || 1)) {
            outOfStock.push(item.name || item.title || "Item");
          }
        }
      });

      setOutOfStockItems(outOfStock);
      setHasOutOfStockItems(outOfStock.length > 0);
      return updatedItems;
    } catch (error) {
      console.error("Error checking stock:", error);
      toast.error("Error checking product availability");
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
        if (router.query.buyNow === "true") {
          const buyNowItem = sessionStorage.getItem("buyNowItem");
          if (buyNowItem) {
            const item = JSON.parse(buyNowItem);
            const itemsWithStock = await checkStockAvailability(item);
            setCheckoutItems(itemsWithStock);
            setIsBuyNow(true);

            // Calculate subtotal
            const subt = Object.values(itemsWithStock).reduce(
              (sum, it) =>
                sum + Number(it.price || 0) * (it.qty || it.quantity || 1),
              0
            );
            setCheckoutSubTotal(subt);
          } else {
            // ensure empty state handled
            setCheckoutItems({});
            setCheckoutSubTotal(0);
            setIsBuyNow(true);
          }
        } else {
          const itemsWithStock = await checkStockAvailability(cart || {});
          setCheckoutItems(itemsWithStock);
          setCheckoutSubTotal(subTotal || 0);
          setIsBuyNow(false);
        }
      } catch (error) {
        console.error("Error initializing checkout:", error);
        // Fallback to original items if there's an error
        const fallback =
          router.query.buyNow === "true"
            ? JSON.parse(sessionStorage.getItem("buyNowItem") || "{}")
            : cart || {};
        setCheckoutItems(fallback);
        setCheckoutSubTotal(subTotal || 0);
      }
    };

    initializeCheckout();
    // re-run when cart or subTotal changes
  }, [router.query, cart, subTotal]);

  const fetchUserAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/address`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses || []);
        const defaultAddress = (data.addresses || []).find(
          (addr) => addr.isDefault
        );
        if (defaultAddress) setSelectedAddress(defaultAddress._id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  // };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Realtime Pincode Check
   if (name === "postalCode") {
  // Allow only numbers
  const numeric = value.replace(/\D/g, "");

  // Always limit to 6 digits
  const trimmed = numeric.slice(0, 6);

  setFormData(prev => ({ ...prev, postalCode: trimmed }));

  // Only check when exactly 6 digits typed
  if (trimmed.length === 6) {
    checkPincodeRealtime(trimmed);
  } else {
    setPinStatus({
      loading: false,
      valid: null,
      message: ""
    });
  }

  return;
}
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      redirectToLogin(router);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Address saved successfully");
        setShowAddressForm(false);
        setFormData({
          fullName: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          country: "India",
          postalCode: "",
          landmark: "",
          addressType: "shipping",
          isDefault: false,
        });
        fetchUserAddresses();
      } else {
        toast.error(data.error || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (Object.keys(checkoutItems).length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Re-validate stock before proceeding to payment
    const updatedItems = await checkStockAvailability(checkoutItems);
    setCheckoutItems(updatedItems);

    // Check if any items are out of stock
    const hasOutOfStock = Object.values(updatedItems).some(
      (item) =>
        (item.availableQty !== undefined && item.availableQty <= 0) ||
        item.qty > (item.availableQty || 0)
    );

    if (hasOutOfStock) {
      toast.error(
        "Some items in your cart are out of stock. Please update your cart."
      );
      return;
    }

    await initiatePayment();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
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
      const token = localStorage.getItem("token");

      // Prepare appliedCoupon object if coupon applied
      const appliedCoupon = coupon.isApplied
        ? {
            code: coupon.code,
            discount: coupon.discount,
            discountType: coupon.discountType,
            value: coupon.value,
          }
        : null;

      // Use checkoutItems and checkoutSubTotal instead of cart and subTotal
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cart: checkoutItems,
            subTotal: checkoutSubTotal,
            addressId: selectedAddress,
            isBuyNow: isBuyNow,
            appliedCoupon,
          }),
        }
      );
      const data = await resp.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      const razorpayOrderId = data.order?.id || data.order?.order_id;
      const dbOrderId = data.dbOrderId;
      if (!razorpayOrderId || !dbOrderId) {
        throw new Error("Payment initialization returned invalid ids");
      }

      const loaded = await loadRazorpayScript();
      if (!loaded)
        throw new Error("Failed to load payment processor. Try again.");

      const selectedAddr =
        addresses.find((a) => a._id === selectedAddress) || {};
      const prefillName = selectedAddr.fullName || formData.fullName || "";
      const prefillContact = selectedAddr.phone || formData.phone || "";
      const prefillEmail = "";

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (razorpayResponse) {
          try {
            setLoading(true);
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                  razorpayOrderId: razorpayResponse.razorpay_order_id,
                  razorpaySignature: razorpayResponse.razorpay_signature,
                  dbOrderId,
                }),
              }
            );

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              toast.error(verifyData.error || "Payment verification failed");
              console.error("Verification failed", verifyData);
              return;
            }

            localStorage.setItem(
              "lastOrder",
              JSON.stringify({
                _id: verifyData.order._id || dbOrderId,
                amount: verifyData.order.amount || checkoutSubTotal,
                status: verifyData.order.status || "Paid",
                paymentMethod: "Online Payment (Razorpay)",
                createdAt:
                  verifyData.order.createdAt || new Date().toISOString(),
                items:
                  verifyData.order.orderItems ||
                  Object.values(checkoutItems).map((i) => ({
                    name: i.name,
                    qty: i.qty || i.quantity,
                    price: i.price,
                  })),
              })
            );

            // Clear based on checkout type
            if (isBuyNow) {
              sessionStorage.removeItem("buyNowItem");
              toast.success("Order placed successfully!");
            } else {
              clearCart();
              toast.success("Order placed successfully!");
            }

            const finalOrderId = verifyData.order._id || dbOrderId;
            router.push(`/order/success?orderId=${finalOrderId}`);
          } catch (err) {
            console.error("Post-payment error:", err);
            toast.error("Something went wrong after payment. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: prefillName,
          email: prefillEmail,
          contact: prefillContact,
        },
        notes: {
          addressId: selectedAddress,
          dbOrderId,
          isBuyNow: isBuyNow,
        },
        theme: { color: "#8B6F5E" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  // UI rendering - minor adjustments to reflect coupon state
  const totalToPay = calculateOrderTotal();



  return (
    <div
      className="min-h-screen pt-20  lg:pt-0 px-2 py-6 sm:px-4"
      style={{
        background: "radial-gradient(circle, #FFF2EF, #E0CAC5)",
      }}
    >
      <Head>
        <title>Checkout - Your Store</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <Script type="application/javascript" crossOrigin="anonymous" />

      <div className="max-w-5xl mx-auto">
        <h1
          className="font-bold text-2xl mb-6 text-center"
          style={{ color: "#8B6F5E" }}
        >
          Checkout
        </h1>

        {/* Buy Now Banner */}
        {isBuyNow && (
          <div
            className="mb-4 p-3 rounded-lg"
            style={{
              background: "rgba(139, 111, 94, 0.1)",
              borderLeft: "3px solid #8B6F5E",
            }}
          >
            <div className="flex items-center">
              <BsBagCheckFill
                className="h-4 w-4 mr-2"
                style={{ color: "#8B6F5E" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "#8B6F5E" }}>
                  Quick Checkout
                </p>
                <p className="text-xs" style={{ color: "#A08374" }}>
                  Your cart items are safe
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address Section */}
            <div
              className="rounded-lg p-4"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(139, 111, 94, 0.2)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Delivery Address</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center text-sm font-medium transition-colors"
                >
                  <AiOutlinePlus className="mr-1 " size={16} /> Add New
                </button>
              </div>

              {/* Add New Address Form */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddressSubmit}
                  className="mb-4 p-3 rounded-lg"
                  style={{
                    background: "rgba(224, 202, 197, 0.3)",
                    border: "1px solid rgba(139, 111, 94, 0.2)",
                  }}
                >
                  <h3
                    className="text-base font-medium mb-3"
                    style={{ color: "#8B6F5E" }}
                  >
                    Add New Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: "#8B6F5E" }}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "rgba(139, 111, 94, 0.3)",
                          background: "rgba(255, 255, 255, 0.9)",
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: "#8B6F5E" }}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        minLength={10}
                        maxLength={10}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "rgba(139, 111, 94, 0.3)",
                          background: "rgba(255, 255, 255, 0.9)",
                        }}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: "#8B6F5E" }}
                      >
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "rgba(139, 111, 94, 0.3)",
                          background: "rgba(255, 255, 255, 0.9)",
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: "#8B6F5E" }}
                      >
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "rgba(139, 111, 94, 0.3)",
                          background: "rgba(255, 255, 255, 0.9)",
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: "#8B6F5E" }}
                      >
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "rgba(139, 111, 94, 0.3)",
                          background: "rgba(255, 255, 255, 0.9)",
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: "#8B6F5E" }}
                      >
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "rgba(139, 111, 94, 0.3)",
                          background: "rgba(255, 255, 255, 0.9)",
                        }}
                        required
                      />
                      {pinStatus.loading && (
                        <p className="text-xs mt-1 text-gray-500">
                          Checking...
                        </p>
                      )}

                      {pinStatus.valid === true && (
                        <p className="text-xs mt-1 text-green-600">
                          ✓ {pinStatus.message}
                        </p>
                      )}

                      {pinStatus.valid === false && (
                        <p className="text-xs mt-1 text-red-600">
                          ✗ {pinStatus.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: "#8B6F5E" }}
                      >
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 text-sm rounded border"
                        style={{
                          borderColor: "rgba(139, 111, 94, 0.3)",
                          background: "rgba(224, 202, 197, 0.3)",
                        }}
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: "#8B6F5E" }}
                      >
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-1"
                        style={{
                          borderColor: "rgba(139, 111, 94, 0.3)",
                          background: "rgba(255, 255, 255, 0.9)",
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="h-3 w-3 rounded"
                        style={{ accentColor: "#8B6F5E" }}
                      />
                      <label
                        htmlFor="isDefault"
                        className="ml-2 text-xs"
                        style={{ color: "#8B6F5E" }}
                      >
                        Set as default
                      </label>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        color: "#8B6F5E",
                        border: "1px solid rgba(139, 111, 94, 0.3)",
                      }}
                    >
                      Cancel
                    </button>
                    {/* <button
                      type='submit'
                      className='px-3 py-1.5 rounded text-xs font-medium text-white transition-colors'
                      style={{ background: '#8B6F5E' }}
                    >
                      Save Address
                    </button> */}
                    <button
                      type="submit"
                      disabled={pinStatus.valid !== true}
                      className={`px-3 py-1.5 rounded text-xs font-medium text-white transition-colors ${
                        pinStatus.valid !== true
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      style={{ background: "#8B6F5E" }}
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 gap-3">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => setSelectedAddress(address._id)}
                      className="p-3 rounded cursor-pointer transition-all duration-200"
                      style={{
                        background:
                          selectedAddress === address._id
                            ? "#FFF2EF"
                            : "rgba(255, 255, 255, 0.5)",
                        border:
                          selectedAddress === address._id
                            ? "2px solid #505460"
                            : "1px solid rgba(139, 111, 94, 0.2)",
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {address.fullName}
                          </h4>
                          <p className="text-xs mt-1">
                            {address.street}, {address.city}, {address.state}{" "}
                            {address.postalCode}
                          </p>
                          <p className="text-xs">Phone: {address.phone}</p>
                          {address.landmark && (
                            <p className="text-xs">
                              Landmark: {address.landmark}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedAddress === address._id && (
                            <div
                              className="h-4 w-4 rounded-full flex items-center justify-center text-white"
                              style={{ background: "#0BAF16" }}
                            >
                              <AiOutlineCheck size={10} />
                            </div>
                          )}
                          {selectedAddress !== address._id && (
                            <div
                              className="h-4 w-4 rounded-full flex items-center justify-center text-white"
                              style={{ border: "1px solid #8B6F5E" }}
                            >
                              <AiOutlineCheck size={10} />
                            </div>
                          )}
                          {address.isDefault && (
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                background: "rgba(139, 111, 94, 0.2)",
                                color: "#8B6F5E",
                              }}
                            >
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm" style={{ color: "#A08374" }}>
                      No saved addresses. Please add one to continue.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div
              className="rounded-lg p-4"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(139, 111, 94, 0.2)",
              }}
            >
              <h2 className="text-lg font-semibold mb-3">Order Items</h2>

              <div className="space-y-3">
                {Object.keys(checkoutItems).length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm" style={{ color: "#A08374" }}>
                      Your cart is empty
                    </p>
                  </div>
                ) : (
                  Object.entries(checkoutItems).map(([key, item]) => {
                    const isOutOfStock =
                      item.availableQty !== undefined && item.availableQty <= 0;
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-3 pb-3 border-b ${
                          isOutOfStock ? "opacity-60" : ""
                        }`}
                        style={{ borderColor: "rgba(139, 111, 94, 0.1)" }}
                      >
                        <div
                          className="h-14 w-14 flex-shrink-0 overflow-hidden rounded"
                          style={{
                            border: "1px solid rgba(139, 111, 94, 0.2)",
                          }}
                        >
                          <img
                            src={item.img || "/placeholder-product.png"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-sm font-medium truncate"
                            style={{ color: "#8B6F5E" }}
                          >
                            {item.name}
                          </h3>
                          <p className="text-xs" style={{ color: "#A08374" }}>
                            {item.variant} | {item.size}
                          </p>
                          <p
                            className="text-xs font-medium mt-1"
                            style={{ color: "#8B6F5E" }}
                          >
                            ₹{item.price} x {item.qty}
                          </p>
                          {isOutOfStock && (
                            <p className="text-xs font-semibold text-red-600 mt-1">
                              Out of Stock
                            </p>
                          )}
                        </div>
                        {!isBuyNow && !isOutOfStock && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                removeFromCart(
                                  key,
                                  1,
                                  item.price,
                                  item.name,
                                  item.size,
                                  item.variant
                                )
                              }
                              className="transition-colors"
                              style={{ color: "#A08374" }}
                            >
                              <AiOutlineMinusCircle size={18} />
                            </button>
                            <span
                              className="w-6 text-center text-xs font-medium"
                              style={{ color: "#8B6F5E" }}
                            >
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                addToCart(
                                  key,
                                  1,
                                  item.price,
                                  item.name,
                                  item.size,
                                  item.variant
                                )
                              }
                              className="transition-colors"
                              style={{ color: "#A08374" }}
                            >
                              <AiOutlinePlusCircle size={18} />
                            </button>
                          </div>
                        )}
                        {isBuyNow && (
                          <div
                            className="text-xs font-medium"
                            style={{ color: "#8B6F5E" }}
                          >
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
          <div className="lg:col-span-1">
            <div
              className="rounded-lg p-4 sticky top-4"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(139, 111, 94, 0.2)",
              }}
            >
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div
                className="space-y-2 mb-4 pb-4"
                style={{ borderBottom: "1px solid rgba(139, 111, 94, 0.1)" }}
              >
                <div className="flex  justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium font-sans">
                    ₹{checkoutSubTotal}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="font-medium">FREE</span>
                </div>

                {/* Coupon UI */}
                <div className="mt-3">
                  {!coupon.isApplied ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Have a coupon? Enter code"
                        value={coupon.code}
                        onChange={(e) =>
                          setCoupon((prev) => ({
                            ...prev,
                            code: e.target.value,
                            error: "",
                            warning: "",
                          }))
                        }
                        className="flex-1 text-sm p-2 rounded border"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={coupon.loading}
                        className="px-3 py-1 rounded text-sm text-white"
                        style={{ background: "#8B6F5E" }}
                      >
                        {coupon.loading ? "Applying..." : "Apply"}
                      </button>
                    </form>
                  ) : (
                    <div
                      className="p-2 rounded"
                      style={{ background: "rgba(224,224,224,0.2)" }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">
                            {coupon.code}
                          </div>
                          <div className="text-xs text-gray-600">
                            {coupon.discountType === "percentage"
                              ? `${coupon.value}% (max ₹${
                                  coupon.maxDiscount || "—"
                                })`
                              : `₹${coupon.value}`}
                          </div>
                          <div className="text-xs text-green-700 font-semibold">
                            - ₹{coupon.discount.toFixed(2)}
                          </div>
                          {coupon.warning && (
                            <div className="text-xs text-yellow-700">
                              {coupon.warning}
                            </div>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-xs text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {coupon.error && (
                    <div className="text-xs text-red-600 mt-2">
                      {coupon.error}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-base font-bold mb-4">
                <span>Total</span>
                <span className="font-medium font-sans">₹{totalToPay}</span>
              </div>

              {/* Stock Warning */}
              {(hasOutOfStockItems || outOfStockItems.length > 0) && (
                <div
                  className="mb-4 p-3 rounded-lg"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  <p className="text-red-700 font-semibold text-xs text-center mb-2">
                    ⚠️ Stock Issues
                  </p>
                  <ul className="text-xs text-red-600 space-y-1">
                    {outOfStockItems.map((itemName, index) => (
                      <li key={index} className="truncate">
                        • {itemName} - Out of stock
                      </li>
                    ))}
                    {Object.values(checkoutItems).map((item) => {
                      if (
                        item.availableQty > 0 &&
                        item.qty > item.availableQty
                      ) {
                        return (
                          <li key={item._id || item.name} className="truncate">
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
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
                style={{ background: "#000000" }}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <BsBagCheckFill className="mr-2" size={16} />
                    Pay ₹{totalToPay}
                  </>
                )}
              </button>

              <p
                className="text-xs text-center mt-3"
                style={{ color: "#A08374" }}
              >
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
