// // pages/order.js
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';

// export default function OrderPage() {
//   const router = useRouter();
//   const { orderId } = router.query;
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // redirect if not logged in
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push(`/login?redirect=${encodeURIComponent('/order' + (orderId ? `?orderId=${orderId}` : ''))}`);
//       return;
//     }

//     const fetchOrder = async () => {
//       if (!orderId) return;
//       try {
//         setLoading(true);
//         const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/${orderId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         if (res.status === 401) {
//           router.push(`/login?redirect=${encodeURIComponent('/order?orderId=' + orderId)}`);
//           return;
//         }
//         if (res.status === 404) {
//           setError('Order not found');
//           setLoading(false);
//           return;
//         }
//         if (!res.ok) {
//           const body = await res.json().catch(() => ({}));
//           throw new Error(body.error || `Failed to fetch order (${res.status})`);
//         }
//         const data = await res.json();
//         if (!data.success) {
//           throw new Error(data.error || 'Failed to fetch order');
//         }
//         setOrder(data.order);
//       } catch (err) {
//         console.error('Error loading order:', err);
//         setError(err.message || 'Could not load order');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId, router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
//           <p className="mt-4 text-gray-600">Loading order...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//         <div className="max-w-lg w-full bg-white p-6 rounded shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">Could not load order</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="flex justify-center gap-3">
//             <button onClick={() => router.back()} className="px-4 py-2 rounded bg-gray-200">Go Back</button>
//             <Link href="/orders"className="px-4 py-2 rounded bg-indigo-600 text-white">My Orders</Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render order details
//   return (
//     <section className="text-gray-600 body-font overflow-hidden">
//       <div className="container px-5 py-12 mx-auto">
//         <div className="lg:w-4/5 mx-auto flex flex-wrap">
//           <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
//             <h2 className="text-sm title-font text-gray-500 tracking-widest">Your Store</h2>
//             <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
//               Order {order.orderNumber || `#${order._id}`}
//             </h1>

//             <p className="leading-relaxed mb-4">Status: <strong>{order.status}</strong></p>

//             <div className="flex mb-4 font-medium text-gray-700">
//               <div className="flex-grow">Item Description</div>
//               <div className="w-24 text-center">Quantity</div>
//               <div className="w-28 text-right">Item Total</div>
//             </div>

//             {order.orderItems && order.orderItems.length > 0 ? (
//               order.orderItems.map((it, i) => (
//                 <div key={i} className="flex border-t border-gray-200 py-4">
//                   <div className="flex-grow">
//                     <div className="text-gray-900">{it.name}</div>
//                     <div className="text-sm text-gray-500">{it.product ? `ProductId: ${it.product}` : ''}</div>
//                   </div>
//                   <div className="w-24 text-center text-gray-900">{it.quantity}</div>
//                   <div className="w-28 text-right text-gray-900">₹{Number(it.price * it.quantity).toLocaleString('en-IN')}</div>
//                 </div>
//               ))
//             ) : (
//               <div className="py-4 text-gray-500">No items found for this order.</div>
//             )}

//             <div className="flex border-t border-b mt-6 mb-6 border-gray-200 py-6">
//               <div className="flex-grow">
//                 <p className="text-gray-700">Shipping Address</p>
//                 <p className="text-gray-900">
//                   {order.shippingAddress?.fullName}<br />
//                   {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
//                   {order.shippingAddress?.country}<br />
//                   Phone: {order.shippingAddress?.phone}
//                 </p>
//               </div>
//               <div className="w-48">
//                 <p className="text-gray-500">Payment</p>
//                 <p className="text-gray-900">{order.paymentInfo?.method || order.paymentMethod || 'Online Payment (Razorpay)'}</p>
//                 <p className="text-sm text-gray-500">Payment status: {order.paymentInfo?.status || (order.isPaid ? 'paid' : 'pending')}</p>
//               </div>
//             </div>

//             <div className="flex flex-col">
//               <span className="title-font font-medium text-2xl text-gray-900">Total: ₹{Number(order.amount).toLocaleString('en-IN')}</span>
//               <div className="my-6">
//                 <Link
//   href={`/order/${order._id || order.id}/tracking`}
//   className="flex mx-0 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded mr-3"
// >
//   Track Order
// </Link>
//                 <button onClick={() => router.back()} className="ml-2 px-4 py-2 rounded border">Back</button>
//               </div>
//             </div>
//           </div>

//           <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={order.orderItems?.[0]?.image || 'https://dummyimage.com/400x400'} />
//         </div>
//       </div>
//     </section>
//   );
// }



// // pages/order.js
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';

// export default function OrderPage() {
//   const router = useRouter();
//   const { orderId } = router.query;
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // redirect if not logged in
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push(`/login?redirect=${encodeURIComponent('/order' + (orderId ? `?orderId=${orderId}` : ''))}`);
//       return;
//     }

//     const fetchOrder = async () => {
//       if (!orderId) return;
//       try {
//         setLoading(true);
//         const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/${orderId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         if (res.status === 401) {
//           router.push(`/login?redirect=${encodeURIComponent('/order?orderId=' + orderId)}`);
//           return;
//         }
//         if (res.status === 404) {
//           setError('Order not found');
//           setLoading(false);
//           return;
//         }
//         if (!res.ok) {
//           const body = await res.json().catch(() => ({}));
//           throw new Error(body.error || `Failed to fetch order (${res.status})`);
//         }
//         const data = await res.json();
//         if (!data.success) {
//           throw new Error(data.error || 'Failed to fetch order');
//         }
//         setOrder(data.order);
//       } catch (err) {
//         console.error('Error loading order:', err);
//         setError(err.message || 'Could not load order');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId, router]);

//   if (loading) {
//     return (
//       <div 
//         className="min-h-screen flex items-center justify-center"
//         style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}
//       >
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto" />
//           <p className="mt-4 text-rose-800">Loading order...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div 
//         className="min-h-screen flex items-center justify-center p-4"
//         style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}
//       >
//         <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
//           <h2 className="text-xl font-semibold mb-2 text-rose-900">Could not load order</h2>
//           <p className="text-rose-700 mb-4">{error}</p>
//           <div className="flex flex-col sm:flex-row justify-center gap-3">
//             <button 
//               onClick={() => router.back()} 
//               className="px-4 py-2 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 transition"
//             >
//               Go Back
//             </button>
//             <Link 
//               href="/orders" 
//               className="px-4 py-2 rounded-lg bg-rose-400 text-white hover:bg-rose-500 transition"
//             >
//               My Orders
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render order details
//   return (
//     <section 
//       className="min-h-screen py-8 sm:py-12"
//       style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}
//     >
//       <div className="container px-4 sm:px-5 mx-auto">
//         <div className="max-w-6xl mx-auto">
//           <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
//             <div className="flex flex-col-reverse lg:flex-row">
//               {/* Order Details Section */}
//               <div className="lg:w-3/5 w-full p-6 sm:p-8 lg:p-10">
//                 <h2 className="text-xs sm:text-sm text-rose-600 tracking-widest uppercase mb-2">
//                   Your Store
//                 </h2>
//                 <h1 className="text-rose-900 text-2xl sm:text-3xl font-bold mb-4">
//                   Order {order.orderNumber || `#${order._id}`}
//                 </h1>

//                 <div className="inline-block mb-6 px-4 py-2 bg-rose-50 rounded-full">
//                   <p className="text-sm text-rose-800">
//                     Status: <strong className="font-semibold">{order.status}</strong>
//                   </p>
//                 </div>

//                 {/* Order Items Header - Hidden on mobile */}
//                 <div className="hidden sm:flex mb-4 font-medium text-rose-800 text-sm border-b border-rose-200 pb-2">
//                   <div className="flex-grow">Item Description</div>
//                   <div className="w-20 text-center">Qty</div>
//                   <div className="w-28 text-right">Total</div>
//                 </div>

//                 {/* Order Items */}
//                 {order.orderItems && order.orderItems.length > 0 ? (
//                   <div className="space-y-4 mb-6">
//                     {order.orderItems.map((it, i) => (
//                       <div 
//                         key={i} 
//                         className="flex flex-col sm:flex-row sm:items-center border-t border-rose-200 pt-4 gap-2"
//                       >
//                         <div className="flex-grow">
//                           <div className="text-rose-900 font-medium">{it.name}</div>
//                           {it.product && (
//                             <div className="text-xs text-rose-600 mt-1">
//                               Product ID: {it.product}
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex sm:block justify-between sm:w-20 sm:text-center">
//                           <span className="text-sm text-rose-700 sm:hidden">Quantity:</span>
//                           <span className="text-rose-900 font-medium">{it.quantity}</span>
//                         </div>
//                         <div className="flex sm:block justify-between sm:w-28 sm:text-right">
//                           <span className="text-sm text-rose-700 sm:hidden">Item Total:</span>
//                           <span className="text-rose-900 font-semibold">
//                             ₹{Number(it.price * it.quantity).toLocaleString('en-IN')}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="py-4 text-rose-600 text-center">No items found for this order.</div>
//                 )}

//                 {/* Shipping and Payment Info */}
//                 <div className="border-t border-b border-rose-200 py-6 my-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <p className="text-rose-700 font-semibold mb-2">Shipping Address</p>
//                       <div className="text-rose-900 text-sm leading-relaxed">
//                         <p className="font-medium">{order.shippingAddress?.fullName}</p>
//                         <p>{order.shippingAddress?.street}</p>
//                         <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
//                         <p>{order.shippingAddress?.country}</p>
//                         <p className="mt-2">Phone: {order.shippingAddress?.phone}</p>
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-rose-700 font-semibold mb-2">Payment</p>
//                       <div className="text-rose-900 text-sm">
//                         <p className="font-medium">
//                           {order.paymentInfo?.method || order.paymentMethod || 'Online Payment (Razorpay)'}
//                         </p>
//                         <p className="text-rose-600 mt-1">
//                           Payment status: {order.paymentInfo?.status || (order.isPaid ? 'paid' : 'pending')}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Total and Actions */}
//                 <div className="flex flex-col gap-4">
//                   <div className="flex justify-between items-center bg-rose-50 p-4 rounded-lg">
//                     <span className="text-rose-800 font-medium">Order Total</span>
//                     <span className="text-2xl sm:text-3xl font-bold text-rose-900">
//                       ₹{Number(order.amount).toLocaleString('en-IN')}
//                     </span>
//                   </div>
                  
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     <Link
//                       href={`/order/${order._id || order.id}/tracking`}
//                       className="flex-1 text-center text-white bg-rose-400 hover:bg-rose-500 py-3 px-6 rounded-lg font-medium transition shadow-md"
//                     >
//                       Track Order
//                     </Link>
//                     <button 
//                       onClick={() => router.back()} 
//                       className="sm:flex-none px-6 py-3 rounded-lg border-2 border-rose-300 text-rose-800 hover:bg-rose-50 transition font-medium"
//                     >
//                       Back
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Image Section */}
//               <div className="lg:w-2/5 w-full">
//                 <img 
//                   alt="order item" 
//                   className="w-full h-64 sm:h-80 lg:h-full object-cover" 
//                   src={order.orderItems?.[0]?.image || 'https://dummyimage.com/400x400'} 
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// pages/order.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function OrderPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // redirect if not logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent('/order' + (orderId ? `?orderId=${orderId}` : ''))}`);
      return;
    }

    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 401) {
          router.push(`/login?redirect=${encodeURIComponent('/order?orderId=' + orderId)}`);
          return;
        }
        if (res.status === 404) {
          setError('Order not found');
          setLoading(false);
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed to fetch order (${res.status})`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch order');
        }
        setOrder(data.order);
      } catch (err) {
        console.error('Error loading order:', err);
        setError(err.message || 'Could not load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto" />
          <p className="mt-4 text-rose-800">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}
      >
        <div className="max-w-lg w-full bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2 text-rose-900">Could not load order</h2>
          <p className="text-rose-700 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 transition"
            >
              Go Back
            </button>
            <Link 
              href="/orders" 
              className="px-4 py-2 rounded-lg bg-rose-400 text-white hover:bg-rose-500 transition"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // helper for formatting INR
  const fmt = (num) => {
    const n = Number(num) || 0;
    return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  // Render order details
  // Use finalAmount if present, otherwise fallback to amount
  const subtotalVal = order?.amount ?? 0;
  const discountVal = order?.discountAmount ?? (order?.appliedCoupon?.discountApplied ?? 0);
  const finalVal = typeof order?.finalAmount !== 'undefined' ? order.finalAmount : Math.max(0, subtotalVal - (discountVal || 0));

  return (
    <section 
      className="min-h-screen py-32  lg:pt-0 pb-5 lg:py-8 sm:py-12"
      style={{ background: 'radial-gradient(circle, #FFF2EF, #E0CAC5)' }}
    >
      <div className="container px-4 sm:px-5 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col-reverse lg:flex-row">
              {/* Order Details Section */}
              <div className="lg:w-3/5 w-full p-6 sm:p-8 lg:p-10">
                <h2 className="text-xs sm:text-sm text-rose-600 tracking-widest uppercase mb-2">
                  Your Store
                </h2>
                <h1 className="text-rose-900 text-2xl sm:text-3xl font-bold mb-4">
                  Order {order.orderNumber || `#${order._id}`}
                </h1>

                <div className="inline-block mb-6 px-4 py-2 bg-rose-50 rounded-full">
                  <p className="text-sm text-rose-800">
                    Status: <strong className="font-semibold">{order.status}</strong>
                  </p>
                </div>

                {/* Order Items Header - Hidden on mobile */}
                <div className="hidden sm:flex mb-4 font-medium text-rose-800 text-sm border-b border-rose-200 pb-2">
                  <div className="flex-grow">Item Description</div>
                  <div className="w-20 text-center">Qty</div>
                  <div className="w-28 text-right">Total</div>
                </div>

                {/* Order Items */}
                {order.orderItems && order.orderItems.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {order.orderItems.map((it, i) => (
                      <div 
                        key={i} 
                        className="flex flex-col sm:flex-row sm:items-center border-t border-rose-200 pt-4 gap-2"
                      >
                        <div className="flex-grow">
                          <div className="text-rose-900 font-medium">{it.name}</div>
                          {it.product && (
                            <div className="text-xs text-rose-600 mt-1">
                              Product ID: {it.product}
                            </div>
                          )}
                        </div>
                        <div className="flex sm:block justify-between sm:w-20 sm:text-center">
                          <span className="text-sm text-rose-700 sm:hidden">Quantity:</span>
                          <span className="text-rose-900 font-medium">{it.quantity}</span>
                        </div>
                        <div className="flex sm:block justify-between sm:w-28 sm:text-right">
                          <span className="text-sm text-rose-700 sm:hidden">Item Total:</span>
                          <span className="text-rose-900 font-semibold">
                            ₹{fmt(it.price * it.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-rose-600 text-center">No items found for this order.</div>
                )}

                {/* Shipping and Payment Info */}
                <div className="border-t border-b border-rose-200 py-6 my-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-rose-700 font-semibold mb-2">Shipping Address</p>
                      <div className="text-rose-900 text-sm leading-relaxed">
                        <p className="font-medium">{order.shippingAddress?.fullName}</p>
                        <p>{order.shippingAddress?.street}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
                        <p>{order.shippingAddress?.country}</p>
                        <p className="mt-2">Phone: {order.shippingAddress?.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-rose-700 font-semibold mb-2">Payment</p>
                      <div className="text-rose-900 text-sm">
                        <p className="font-medium">
                          {order.paymentInfo?.method || order.paymentMethod || 'Online Payment (Razorpay)'}
                        </p>
                        <p className="text-rose-600 mt-1">
                          Payment status: {order.paymentInfo?.status || (order.isPaid ? 'paid' : 'pending')}
                        </p>
                        {order.appliedCoupon?.code && (
                          <p className="text-sm mt-2 text-green-700">Coupon applied: <strong>{order.appliedCoupon.code}</strong></p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total and Actions */}
                <div className="flex flex-col gap-4">
                  <div className="bg-rose-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-rose-800">Subtotal</span>
                      <span className="text-rose-800 font-medium">₹{fmt(subtotalVal)}</span>
                    </div>

                    {discountVal > 0 && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-rose-700">Discount</span>
                        <span className="text-rose-700 font-medium">- ₹{fmt(discountVal)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <span className="text-rose-800 font-medium">Total Paid</span>
                      <span className="text-2xl sm:text-3xl font-bold text-rose-900">₹{fmt(finalVal)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/order/${order._id || order.id}/tracking`}
                      className="flex-1 text-center text-white bg-rose-400 hover:bg-rose-500 py-3 px-6 rounded-lg font-medium transition shadow-md"
                    >
                      Track Order
                    </Link>
                    <button 
                      onClick={() => router.back()} 
                      className="sm:flex-none px-6 py-3 rounded-lg border-2 border-rose-300 text-rose-800 hover:bg-rose-50 transition font-medium"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="lg:w-2/5 w-full">
                <img 
                  alt="order item" 
                  className="w-full h-64 sm:h-80 lg:h-full object-cover" 
                  src={order.orderItems?.[0]?.image || 'https://dummyimage.com/400x400'} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
