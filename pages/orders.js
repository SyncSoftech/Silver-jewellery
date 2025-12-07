// // pages/orders.js
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';

// export default function Orders() {
//   const router = useRouter();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // redirect if not logged in
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login?redirect=/orders');
//       return;
//     }

//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         if (res.status === 401) {
//           // unauthorized - redirect to login
//           router.push('/login?redirect=/orders');
//           return;
//         }
//         if (!res.ok) {
//           const err = await res.json();
//           throw new Error(err.error || `Failed to fetch orders (${res.status})`);
//         }
//         const data = await res.json();
//         if (!data.success) {
//           throw new Error(data.error || 'Failed to fetch orders');
//         }
//         // normalize date strings for display
//         const normalized = (data.orders || []).map(o => ({
//           ...o,
//           createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
//           amount: o.amount ?? 0
//         }));
//         setOrders(normalized);
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setError(err.message || 'Could not load orders');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
//           <p className="mt-4 text-gray-600">Loading your orders...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//         <div className="max-w-xl w-full bg-white p-6 rounded shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">Could not load orders</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => router.reload()}
//             className="px-4 py-2 rounded bg-indigo-600 text-white"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <h1 className="text-2xl font-semibold text-center mb-8">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-600 mb-4">You have not placed any orders yet.</p>
//           <Link href="/">
//             <a className="inline-block px-6 py-2 bg-indigo-600 text-white rounded">Continue Shopping</a>
//           </Link>
//         </div>
//       ) : (
//         <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {orders.map((order, idx) => (
//                 <tr key={order._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderNumber || order._id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     ₹{Number(order.amount).toLocaleString('en-IN')}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       order.status === 'Paid' || order.status === 'paid' ? 'bg-green-100 text-green-800' :
//                       order.status === 'Processing' || order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
//                       order.status === 'Shipped' || order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <Link 
//   href={`/order?orderId=${order._id}`} 
//   className="text-indigo-600 hover:text-indigo-900"
// >
//   View
// </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


// // pages/orders.js
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';

// export default function Orders() {
//   const router = useRouter();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login?redirect=/orders');
//       return;
//     }

//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (res.status === 401) {
//           router.push('/login?redirect=/orders');
//           return;
//         }

//         if (!res.ok) {
//           const err = await res.json();
//           throw new Error(err.error || `Failed to fetch orders (${res.status})`);
//         }

//         const data = await res.json();
//         if (!data.success) {
//           throw new Error(data.error || 'Failed to fetch orders');
//         }

//         const normalized = (data.orders || []).map((o) => ({
//           ...o,
//           createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
//           amount: o.amount ?? 0,
//         }));

//         setOrders(normalized);
       
        
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setError(err.message || 'Could not load orders');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
//           <p className="mt-4 text-gray-600">Loading your orders...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//         <div className="max-w-xl w-full bg-white p-6 rounded shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">Could not load orders</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => router.reload()}
//             className="px-4 py-2 rounded bg-indigo-600 text-white"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-2xl font-semibold text-center mb-8">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-600 mb-4">You have not placed any orders yet.</p>
//           <Link href="/">
//             <a className="inline-block px-6 py-2 bg-indigo-600 text-white rounded">
//               Continue Shopping
//             </a>
//           </Link>
//         </div>
//       ) : (
//         <>
//           {/* Desktop view */}
//           <div className="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {orders.map((order, idx) => {
//                     const image =
//                       order.orderItems?.[0]?.image ||
//                       order.products?.[0]?.img ||
//                       order.items?.[0]?.image ||
//                       '/no-image.png';
//                     return (
//                       <tr key={order._id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {idx + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <img
//                             src={image}
//                             alt="Product"
//                             className="h-12 w-12 object-cover rounded-md border"
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {order.orderNumber || order._id}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {order.createdAt
//                             ? new Date(order.createdAt).toLocaleString()
//                             : '-'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           ₹{Number(order.amount).toLocaleString('en-IN')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm">
//                           <span
//                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               order.status === 'Paid' || order.status === 'paid'
//                                 ? 'bg-green-100 text-green-800'
//                                 : order.status === 'Processing' ||
//                                   order.status === 'processing'
//                                 ? 'bg-yellow-100 text-yellow-800'
//                                 : order.status === 'Shipped' ||
//                                   order.status === 'shipped'
//                                 ? 'bg-blue-100 text-blue-800'
//                                 : 'bg-gray-100 text-gray-800'
//                             }`}
//                           >
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <Link
//                             href={`/order?orderId=${order._id}`}
//                             className="text-indigo-600 hover:text-indigo-900"
//                           >
//                             View
//                           </Link>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Mobile view */}
//           <div className="md:hidden space-y-4">
//             {orders.map((order, idx) => {
//               const firstImage =
//                 order.products?.[0]?.img ||
//                 order.items?.[0]?.image ||
//                 '/no-image.png';
//               return (
//                 <div key={order._id} className="bg-white shadow rounded-lg p-4 flex gap-4">
//                   <img
//                     src={firstImage}
//                     alt="Product"
//                     className="w-20 h-20 object-cover rounded-md border flex-shrink-0"
//                   />
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className="text-sm text-gray-500">
//                           #{idx + 1} · {order.orderNumber || order._id}
//                         </div>
//                         <div className="mt-1 text-sm text-gray-700 font-medium">
//                           ₹{Number(order.amount).toLocaleString('en-IN')}
//                         </div>
//                         <div className="mt-1 text-xs text-gray-500">
//                           {order.createdAt
//                             ? new Date(order.createdAt).toLocaleString()
//                             : '-'}
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             order.status === 'Paid' || order.status === 'paid'
//                               ? 'bg-green-100 text-green-800'
//                               : order.status === 'Processing' ||
//                                 order.status === 'processing'
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : order.status === 'Shipped' ||
//                                 order.status === 'shipped'
//                               ? 'bg-blue-100 text-blue-800'
//                               : 'bg-gray-100 text-gray-800'
//                           }`}
//                         >
//                           {order.status}
//                         </div>
//                         <div className="mt-3">
//                           <Link
//                             href={`/order?orderId=${order._id}`}
//                             className="inline-block text-sm px-3 py-1 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


// // pages/orders.js
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';

// export default function Orders() {
//   const router = useRouter();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Helper: make a usable image URL from DB value
//   const resolveImage = (img) => {
//     if (!img) return '/no-image.png';
//     const trimmed = String(img).trim();
//     // already full URL or protocol-relative
//     if (/^https?:\/\//i.test(trimmed) || /^\/\//.test(trimmed)) return trimmed;
//     // absolute path on same host
//     if (trimmed.startsWith('/')) return `${process.env.NEXT_PUBLIC_HOST}${trimmed}`;
//     // bare filename or relative path -> prefix host
//     return `${process.env.NEXT_PUBLIC_HOST}/${trimmed}`;
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login?redirect=/orders');
//       return;
//     }

//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
//         if (res.status === 401) {
//           router.push('/login?redirect=/orders');
//           return;
//         }
//         if (!res.ok) {
//           const err = await res.json();
//           throw new Error(err.error || `Failed to fetch orders (${res.status})`);
//         }
//         const data = await res.json();
//         if (!data.success) {
//           throw new Error(data.error || 'Failed to fetch orders');
//         }

//         // debug: inspect first order structure in browser console
//         console.log('orders API response (sample):', data.orders && data.orders[0] ? JSON.stringify(data.orders[0], null, 2) : data.orders);

//         // normalize date strings for display
//         const normalized = (data.orders || []).map(o => ({
//           ...o,
//           createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
//           amount: o.amount ?? 0
//         }));
//         setOrders(normalized);
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setError(err.message || 'Could not load orders');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
//           <p className="mt-4 text-gray-600">Loading your orders...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//         <div className="max-w-xl w-full bg-white p-6 rounded shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">Could not load orders</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => router.reload()}
//             className="px-4 py-2 rounded bg-indigo-600 text-white"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-2xl font-semibold text-center mb-8">My Orders</h1>

//       {orders.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-600 mb-4">You have not placed any orders yet.</p>
//           <Link href="/">
//             <span className="inline-block px-6 py-2 bg-indigo-600 text-white rounded">Continue Shopping</span>
//           </Link>
//         </div>
//       ) : (
//         <>
//           {/* Desktop / Tablet: table view */}
//           <div className="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {orders.map((order, idx) => {
//                     const firstImageRaw =
//                       order.orderItems?.[0]?.image ||
//                       order.orderItems?.[0]?.img ||
//                       order.products?.[0]?.img ||
//                       order.items?.[0]?.image ||
//                       order.items?.[0]?.img ||
//                       null;
//                     const firstImage = resolveImage(firstImageRaw);

//                     return (
//                       <tr key={order._id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <img
//                             src={encodeURI(firstImage)}
//                             alt={order.orderItems?.[0]?.name || 'Product'}
//                             className="h-12 w-12 object-cover rounded-md border"
//                             onError={(e) => { e.currentTarget.src = '/no-image.png'; }}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderNumber || order._id}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           ₹{Number(order.amount).toLocaleString('en-IN')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             order.status === 'Paid' || order.status === 'paid' ? 'bg-green-100 text-green-800' :
//                             order.status === 'Processing' || order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
//                             order.status === 'Shipped' || order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                             'bg-gray-100 text-gray-800'
//                           }`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <Link href={`/order?orderId=${order._id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Mobile: stacked card view */}
//           <div className="md:hidden space-y-4">
//             {orders.map((order, idx) => {
//               const firstImageRaw =
//                 order.orderItems?.[0]?.image ||
//                 order.orderItems?.[0]?.img ||
//                 order.products?.[0]?.img ||
//                 order.items?.[0]?.image ||
//                 null;
//               const firstImage = resolveImage(firstImageRaw);

//               return (
//                 <div key={order._id} className="bg-white shadow rounded-lg p-4 flex gap-4">
//                   <img
//                     src={encodeURI(firstImage)}
//                     alt={order.orderItems?.[0]?.name || 'Product'}
//                     className="w-20 h-20 object-cover rounded-md border flex-shrink-0"
//                     onError={(e) => { e.currentTarget.src = '/no-image.png'; }}
//                   />
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className="text-sm text-gray-500">#{idx + 1} · {order.orderNumber || order._id}</div>
//                         <div className="mt-1 text-sm text-gray-700 font-medium">₹{Number(order.amount).toLocaleString('en-IN')}</div>
//                         <div className="mt-1 text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</div>
//                       </div>
//                       <div className="text-right">
//                         <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           order.status === 'Paid' || order.status === 'paid' ? 'bg-green-100 text-green-800' :
//                           order.status === 'Processing' || order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
//                           order.status === 'Shipped' || order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>{order.status}</div>
//                         <div className="mt-3">
//                           <Link href={`/order?orderId=${order._id}`} className="inline-block text-sm px-3 py-1 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">View</Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



// pages/orders.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper: make a usable image URL from DB value
  const resolveImage = (img) => {
    if (!img) return '/no-image.png';
    const trimmed = String(img).trim();
    // already full URL or protocol-relative
    if (/^https?:\/\//i.test(trimmed) || /^\/\//.test(trimmed)) return trimmed;
    // absolute path on same host
    if (trimmed.startsWith('/')) return `${process.env.NEXT_PUBLIC_HOST}${trimmed}`;
    // bare filename or relative path -> prefix host
    return `${process.env.NEXT_PUBLIC_HOST}/${trimmed}`;
  };

  // Format number to INR style
  const fmt = (num) => {
    const n = Number(num) || 0;
    return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 401) {
  localStorage.removeItem("token");   // 🆕 IMPORTANT
  router.push('/login?redirect=/orders');
  return;
}
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Failed to fetch orders (${res.status})`);
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch orders');
        }

        // debug: inspect first order structure in browser console
        console.log('orders API response (sample):', data.orders && data.orders[0] ? JSON.stringify(data.orders[0], null, 2) : data.orders);

        // normalize date strings for display and ensure finalAmount/discountAmount are available
        const normalized = (data.orders || []).map(o => {
          const subtotal = o.amount ?? 0;
          const discount = o.discountAmount ?? o.appliedCoupon?.discountApplied ?? 0;
          const finalAmount = typeof o.finalAmount !== 'undefined' ? o.finalAmount : Math.max(0, subtotal - (discount || 0));
          return {
            ...o,
            createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : null,
            amount: subtotal,
            discountAmount: discount,
            finalAmount
          };
        });
        setOrders(normalized);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Could not load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-xl w-full bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Could not load orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.reload()}
            className="px-4 py-2 rounded bg-indigo-600 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-32  lg:pt-0 pb-6 lg:py-8 px-4 sm:px-6 lg:px-8" style={{ background: 'radial-gradient(circle, #FFF2Ef,#DBC4BF)' }}>
      <h1 className="text-2xl font-semibold text-center mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You have not placed any orders yet.</p>
          <Link href="/">
            <span className="inline-block px-6 py-2 bg-indigo-600 text-white rounded">Continue Shopping</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop / Tablet: table view */}
          <div className="hidden md:block shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, idx) => {
                    const firstImageRaw =
                      order.orderItems?.[0]?.image ||
                      order.orderItems?.[0]?.img ||
                      order.products?.[0]?.img ||
                      order.items?.[0]?.image ||
                      order.items?.[0]?.img ||
                      null;
                    const firstImage = resolveImage(firstImageRaw);

                    // Display finalAmount if present, else fallback to amount
                    const displayAmount = order.finalAmount ?? order.amount ?? 0;

                    return (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={encodeURI(firstImage)}
                            alt={order.orderItems?.[0]?.name || 'Product'}
                            className="h-12 w-12 object-cover rounded-md border"
                            onError={(e) => { e.currentTarget.src = '/no-image.png'; }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderNumber || order._id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{fmt(displayAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            (order.status || '').toLowerCase().includes('paid') ? 'bg-green-100 text-green-800' :
                            (order.status || '').toLowerCase().includes('process') ? 'bg-yellow-100 text-yellow-800' :
                            (order.status || '').toLowerCase().includes('ship') ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/order?orderId=${order._id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: stacked card view */}
          <div className="md:hidden space-y-4">
            {orders.map((order, idx) => {
              const firstImageRaw =
                order.orderItems?.[0]?.image ||
                order.orderItems?.[0]?.img ||
                order.products?.[0]?.img ||
                order.items?.[0]?.image ||
                null;
              const firstImage = resolveImage(firstImageRaw);

              const displayAmount = order.finalAmount ?? order.amount ?? 0;

              return (
                <div key={order._id} className="bg-white shadow rounded-lg p-4 flex gap-4">
                  <img
                    src={encodeURI(firstImage)}
                    alt={order.orderItems?.[0]?.name || 'Product'}
                    className="w-20 h-20 object-cover rounded-md border flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = '/no-image.png'; }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500">#{idx + 1} · {order.orderNumber || order._id}</div>
                        <div className="mt-1 text-sm text-gray-700 font-medium">₹{fmt(displayAmount)}</div>
                        <div className="mt-1 text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          (order.status || '').toLowerCase().includes('paid') ? 'bg-green-100 text-green-800' :
                          (order.status || '').toLowerCase().includes('process') ? 'bg-yellow-100 text-yellow-800' :
                          (order.status || '').toLowerCase().includes('ship') ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>{order.status}</div>
                        <div className="mt-3">
                          <Link href={`/order?orderId=${order._id}`} className="inline-block text-sm px-3 py-1 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">View</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
