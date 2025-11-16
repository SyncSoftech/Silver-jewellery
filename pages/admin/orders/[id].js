

// // pages/admin/orders/[id].js
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import { format } from 'date-fns';

// export default function AdminOrderDetails() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [order, setOrder] = useState(null);
//   const [timeline, setTimeline] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [eventForm, setEventForm] = useState({
//     status: 'processing',
//     note: '',
//     carrier: '',
//     trackingNumber: '',
//     trackingUrl: '',
//     eta: ''
//   });
  
//   const [isMarkingPaid, setIsMarkingPaid] = useState(false);

//   const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

//   // ---------- Fetch order and timeline ----------
//   useEffect(() => {
//     if (!id) return;
//     let mounted = true;
//     setLoading(true);
//     setError(null);

//     const fetchData = async () => {
//       try {
//         const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};

//         // fetch order
//         const orderRes = await fetch(`/api/admin/orders/${id}`, { headers });
//         if (!orderRes.ok) throw new Error(`Order fetch failed: ${orderRes.status}`);
//         const orderData = await orderRes.json();

//         // compute total if missing
//         let total = 0;
//         if (typeof orderData.total === 'number' && orderData.total > 0) {
//           total = orderData.total;
//         } else if (Array.isArray(orderData.orderItems) && orderData.orderItems.length) {
//           total = orderData.orderItems.reduce((acc, it) => {
//             const price = Number(it.price || 0);
//             const qty = Number(it.quantity ?? it.qty ?? 0);
//             return acc + price * qty;
//           }, 0);
//         }

//         // fetch timeline
//         let timelineData = [];
//         try {
//           const tlRes = await fetch(`/api/admin/orders/${id}/track`, { headers });
//           if (tlRes.ok) timelineData = await tlRes.json();
//         } catch (e) {
//           console.warn('Failed to fetch timeline:', e);
//         }

//         if (mounted) {
//           setOrder({ ...orderData, total });
//           setTimeline(Array.isArray(timelineData) ? timelineData : []);
//         }
//       } catch (err) {
//         console.error(err);
//         if (mounted) setError(err.message || 'Error fetching order');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchData();
//     return () => { mounted = false; };
//   }, [id, adminToken]);

//   // ---------- Helpers ----------
//   const prettyStatus = (raw) => {
//     if (!raw) return 'Pending';
//     const s = String(raw);
//     return s.charAt(0).toUpperCase() + s.slice(1);
//   };

//   const statusBadgeClass = (raw) => {
//     const s = String(raw || '').toLowerCase();
//     if (s.includes('completed') || s.includes('paid') || s.includes('delivered')) return 'bg-green-100 text-green-800';
//     if (s.includes('processing')) return 'bg-yellow-100 text-yellow-800';
//     if (s.includes('shipped')) return 'bg-indigo-100 text-indigo-800';
//     if (s.includes('cancel') || s.includes('refunded') || s.includes('failed')) return 'bg-red-100 text-red-800';
//     return 'bg-gray-100 text-gray-800';
//   };

//   const formatDate = (d) => {
//     try {
//       return format(new Date(d), 'PPP p');
//     } catch {
//       return '—';
//     }
//   };

//   // ---------- Event form handlers ----------
//   const handleEventChange = (e) => {
//     const { name, value } = e.target;
//     setEventForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddEvent = async (e) => {
//     e.preventDefault();
//     if (!id) return alert('Missing order id');
//     try {
//       const headers = {
//         'Content-Type': 'application/json',
//         ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
//       };

//       const body = {
//         status: eventForm.status,
//         note: eventForm.note,
//         carrier: eventForm.carrier,
//         trackingNumber: eventForm.trackingNumber,
//         trackingUrl: eventForm.trackingUrl,
//         eta: eventForm.eta ? new Date(eventForm.eta).toISOString() : undefined,
//         updatedByModel: 'Admin'
//       };

//       const res = await fetch(`/api/admin/orders/${id}/track`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(body)
//       });

//       if (!res.ok) throw new Error(`Failed to add event: ${res.status}`);
//       const newEvent = await res.json();

//       // Only update timeline (DO NOT change order.status)
//       setTimeline(prev => {
//         const arr = [...prev, newEvent];
//         return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//       });

//       // clear form fields (keep status for next event)
//       setEventForm(prev => ({ ...prev, note: '', carrier: '', trackingNumber: '', trackingUrl: '', eta: '' }));

//       alert('Tracking event added successfully');
//     } catch (err) {
//       console.error(err);
//       alert(err.message || 'Error adding event');
//     }
//   };

//   // ---------- Mark as paid ----------
//   const handleMarkAsPaid = async () => {
//     if (!order?._id || !window.confirm('Mark this order as paid?')) return;
    
//     setIsMarkingPaid(true);
//     try {
//       const res = await fetch(`/api/admin/orders/${order._id}/payment`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
//         },
//         body: JSON.stringify({ status: 'paid' })
//       });
      
//       if (!res.ok) throw new Error('Failed to update payment status');
      
//       // Refresh order data
//       const updatedOrder = await res.json();
//       setOrder(prev => ({
//         ...prev,
//         isPaid: true,
//         paymentInfo: {
//           ...prev.paymentInfo,
//           status: 'paid'
//         }
//       }));
      
//       // Add to timeline
//       setTimeline(prev => [
//         {
//           status: 'Payment Status Updated',
//           note: 'Marked as paid by admin',
//           createdAt: new Date().toISOString()
//         },
//         ...prev
//       ]);
      
//     } catch (err) {
//       console.error('Error marking as paid:', err);
//       alert('Failed to update payment status');
//     } finally {
//       setIsMarkingPaid(false);
//     }
//   };

//   // ---------- Quick status update for Customer & Shipping ----------
//   const handleQuickStatusChange = async (e) => {
//     const newStatus = e.target.value;
//     if (!id) return;
//     if (!confirm(`Change order status to "${newStatus}"?`)) return;

//     try {
//       const headers = {
//         'Content-Type': 'application/json',
//         ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
//       };

//       const res = await fetch(`/api/admin/orders/${id}`, {
//         method: 'PUT',
//         headers,
//         body: JSON.stringify({ status: newStatus })
//       });

//       if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
//       const payload = await res.json();
//       const updatedOrder = payload.order || payload;

//       // Update only Customer & Shipping status
//       setOrder(prev => prev ? { ...prev, status: updatedOrder.status ?? newStatus } : prev);

//       // Optional: Add a timeline event just for audit trail
//       try {
//         const evRes = await fetch(`/api/admin/orders/${id}/track`, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify({
//             status: newStatus,
//             note: `Status manually changed to ${newStatus} by admin`,
//             updatedByModel: 'Admin'
//           })
//         });
//         if (evRes.ok) {
//           const ev = await evRes.json();
//           setTimeline(prev => {
//             const arr = [...prev, ev];
//             return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//           });
//         }
//       } catch (e) {
//         console.warn('Failed to add tracking event after status update', e);
//       }

//       alert('Customer & Shipping status updated');
//     } catch (err) {
//       console.error(err);
//       alert(err.message || 'Error updating status');
//     }
//   };

//   // ---------- Render ----------
//   return (
//     <div className="p-6">
//       <div className="mb-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Order #{id}</h1>
//         <Link href="/admin/orders" className="text-indigo-600">Back to orders</Link>
//       </div>

//       {loading && <div className="p-4 bg-white rounded shadow">Loading...</div>}

//       {!loading && error && (
//         <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded mb-4">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {!loading && !order && !error && (
//         <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded mb-4">
//           Order not found or empty response from API.
//         </div>
//       )}

//       {!loading && order && (
//         <>
//           {/* ---------- Customer & Shipping ---------- */}
//           <div className="mb-6 bg-white shadow overflow-hidden sm:rounded-lg">
//             <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
//               <div>
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Order #{order.orderNumber || order._id}
//                 </h3>
//                 <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                   Placed on {formatDate(order.createdAt)}
//                 </p>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   order.isPaid 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {order.isPaid ? 'Paid' : 'Unpaid'}
//                   {order.paymentMethod && (
//                     <span className="ml-1 text-xs">({order.paymentMethod})</span>
//                   )}
//                 </div>
//                 {!order.isPaid && (
//                   <button
//                     onClick={handleMarkAsPaid}
//                     disabled={isMarkingPaid}
//                     className={`px-3 py-1 rounded-md text-sm font-medium ${
//                       isMarkingPaid 
//                         ? 'bg-gray-100 text-gray-500' 
//                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                     }`}
//                   >
//                     {isMarkingPaid ? 'Updating...' : 'Mark as Paid'}
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
//               <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Customer
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     {order.customer?.name ?? order.shippingAddress?.fullName ?? order.shippingInfo?.name ?? 'Guest'}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Phone
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     {order.shippingAddress?.phone ?? order.shippingInfo?.phone ?? '—'}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Address
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     {order.shippingAddress
//                       ? `${order.shippingAddress.street || ''}${order.shippingAddress.city ? ', ' + order.shippingAddress.city : ''}${order.shippingAddress.state ? ', ' + order.shippingAddress.state : ''}${order.shippingAddress.postalCode ? ' - ' + order.shippingAddress.postalCode : ''}`
//                       : (order.shippingInfo?.address || '—')}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Created
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     {formatDate(order.createdAt)}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Total
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     ₹{Number(order.total ?? 0).toFixed(2)}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Status
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass(order.status)}`}>
//                       {prettyStatus(order.status)}
//                     </span>
//                   </dd>
//                 </div>
//               </dl>
//             </div>

//             <div className="px-4 py-5 sm:px-6">
//               <div className="flex justify-between">
//                 <p>
//                   <strong>Status:</strong>{' '}
//                   <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass(order.status)}`}>
//                     {prettyStatus(order.status)}
//                   </span>
//                 </p>

//                 {/* Quick status dropdown */}
//                 <div>
//                   <select
//                     value={order.status ?? 'Pending'}
//                     onChange={handleQuickStatusChange}
//                     className="border rounded p-1 text-sm"
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Processing">Processing</option>
//                     <option value="Paid">Paid</option>
//                     <option value="Cancelled">Cancelled</option>
//                     <option value="Refunded">Refunded</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ---------- Order Items + Timeline ---------- */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 bg-white shadow rounded p-4">
//               <h3 className="font-semibold mb-2">Order Items</h3>
//               {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-3 py-2 text-left text-xs text-gray-500">Product</th>
//                       <th className="px-3 py-2 text-left text-xs text-gray-500">Qty</th>
//                       <th className="px-3 py-2 text-left text-xs text-gray-500">Price</th>
//                       <th className="px-3 py-2 text-left text-xs text-gray-500">Subtotal</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-100">
//                     {order.orderItems.map((it, idx) => {
//                       const qty = Number(it.quantity ?? it.qty ?? 0);
//                       const price = Number(it.price ?? 0);
//                       return (
//                         <tr key={idx}>
//                           <td className="px-3 py-2 text-sm text-gray-700">{it.name || it.product || '—'}</td>
//                           <td className="px-3 py-2 text-sm text-gray-700">{qty}</td>
//                           <td className="px-3 py-2 text-sm text-gray-700">₹{price.toFixed(2)}</td>
//                           <td className="px-3 py-2 text-sm text-gray-700">₹{(price * qty).toFixed(2)}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="text-sm text-gray-500">No items available</div>
//               )}
//             </div>

//             {/* ---------- Order Timeline ---------- */}
//             <div className="bg-white shadow rounded p-4">
//               <h3 className="font-semibold mb-2">Order Timeline</h3>
//               {timeline.length === 0 ? (
//                 <div className="text-sm text-gray-500">No tracking events.</div>
//               ) : (
//                 <ul className="space-y-3 mb-3">
//                   {timeline.map(evt => (
//                     <li key={evt._id ?? evt.createdAt} className="border rounded p-2">
//                       <div className="flex justify-between">
//                         <div>
//                           <div className="font-medium">{prettyStatus(evt.status)}</div>
//                           {evt.note && <div className="text-sm text-gray-600">{evt.note}</div>}
//                           {evt.carrier && (
//                             <div className="text-sm text-gray-600">
//                               Carrier: {evt.carrier} - {evt.trackingNumber}
//                             </div>
//                           )}
//                           {evt.trackingUrl && (
//                             <div className="text-sm">
//                               <a target="_blank" rel="noreferrer" href={evt.trackingUrl} className="text-indigo-600">
//                                 Track shipment
//                               </a>
//                             </div>
//                           )}
//                         </div>
//                         <div className="text-xs text-gray-500">{formatDate(evt.createdAt)}</div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               {/* Add tracking event form */}
//               <div className="border-t pt-3">
//                 <h4 className="font-medium mb-2">Add / Update Tracking Event</h4>
//                 <form onSubmit={handleAddEvent} className="space-y-2">
//                   <div>
//                     <label className="block text-sm">Status</label>
//                     <select
//                       name="status"
//                       value={eventForm.status}
//                       onChange={handleEventChange}
//                       className="w-full border p-2 rounded"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="processing">Processing</option>
//                       <option value="shipped">Shipped</option>
//                       <option value="delivered">Delivered</option>
//                       <option value="cancelled">Cancelled</option>
//                       <option value="refunded">Refunded</option>
//                       <option value="paid">Paid</option>
//                       <option value="failed">Failed</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm">Note</label>
//                     <textarea
//                       name="note"
//                       value={eventForm.note}
//                       onChange={handleEventChange}
//                       className="w-full border p-2 rounded"
//                       rows={3}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm">Carrier</label>
//                     <input name="carrier" value={eventForm.carrier} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                   </div>

//                   <div>
//                     <label className="block text-sm">Tracking Number</label>
//                     <input name="trackingNumber" value={eventForm.trackingNumber} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                   </div>

//                   <div>
//                     <label className="block text-sm">Tracking URL</label>
//                     <input name="trackingUrl" value={eventForm.trackingUrl} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                   </div>

//                   <div>
//                     <label className="block text-sm">ETA</label>
//                     <input type="date" name="eta" value={eventForm.eta} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                   </div>

//                   <div className="flex gap-2">
//                     <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded">Save event</button>
//                     <button
//                       type="button"
//                       onClick={() => setEventForm({ status: 'processing', note: '', carrier: '', trackingNumber: '', trackingUrl: '', eta: '' })}
//                       className="border px-3 py-1 rounded"
//                     >
//                       Reset
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



// // pages/admin/orders/[id].js
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import { format } from 'date-fns';

// export default function AdminOrderDetails() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [order, setOrder] = useState(null);
//   const [timeline, setTimeline] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [eventForm, setEventForm] = useState({
//     status: 'processing',
//     note: '',
//     carrier: '',
//     trackingNumber: '',
//     trackingUrl: '',
//     eta: ''
//   });
  
//   const [isMarkingPaid, setIsMarkingPaid] = useState(false);

//   const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

//   // ---------- Fetch order and timeline ----------
//   useEffect(() => {
//     if (!id) return;
//     let mounted = true;
//     setLoading(true);
//     setError(null);

//     const fetchData = async () => {
//       try {
//         const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};

//         // fetch order
//         const orderRes = await fetch(`/api/admin/orders/${id}`, { headers });
//         if (!orderRes.ok) throw new Error(`Order fetch failed: ${orderRes.status}`);
//         const orderData = await orderRes.json();

//         // compute total if missing
//         let total = 0;
//         if (typeof orderData.total === 'number' && orderData.total > 0) {
//           total = orderData.total;
//         } else if (Array.isArray(orderData.orderItems) && orderData.orderItems.length) {
//           total = orderData.orderItems.reduce((acc, it) => {
//             const price = Number(it.price || 0);
//             const qty = Number(it.quantity ?? it.qty ?? 0);
//             return acc + price * qty;
//           }, 0);
//         }

//         // fetch timeline
//         let timelineData = [];
//         try {
//           const tlRes = await fetch(`/api/admin/orders/${id}/track`, { headers });
//           if (tlRes.ok) timelineData = await tlRes.json();
//         } catch (e) {
//           console.warn('Failed to fetch timeline:', e);
//         }

//         if (mounted) {
//           setOrder({ ...orderData, total });
//           setTimeline(Array.isArray(timelineData) ? timelineData : []);
//         }
//       } catch (err) {
//         console.error(err);
//         if (mounted) setError(err.message || 'Error fetching order');
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchData();
//     return () => { mounted = false; };
//   }, [id, adminToken]);

//   // ---------- Helpers ----------
//   const prettyStatus = (raw) => {
//     if (!raw) return 'Pending';
//     const s = String(raw);
//     return s.charAt(0).toUpperCase() + s.slice(1);
//   };

//   const statusBadgeClass = (raw) => {
//     const s = String(raw || '').toLowerCase();
//     if (s.includes('completed') || s.includes('paid') || s.includes('delivered')) return 'bg-green-100 text-green-800';
//     if (s.includes('processing')) return 'bg-yellow-100 text-yellow-800';
//     if (s.includes('shipped')) return 'bg-indigo-100 text-indigo-800';
//     if (s.includes('cancel') || s.includes('refunded') || s.includes('failed')) return 'bg-red-100 text-red-800';
//     if (s.includes('replace')) return 'bg-orange-100 text-orange-800';
//     return 'bg-gray-100 text-gray-800';
//   };

//   const formatDate = (d) => {
//     try {
//       return format(new Date(d), 'PPP p');
//     } catch {
//       return '—';
//     }
//   };

//   // ---------- Event form handlers ----------
//   const handleEventChange = (e) => {
//     const { name, value } = e.target;
//     setEventForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddEvent = async (e) => {
//     e.preventDefault();
//     if (!id) return alert('Missing order id');
//     try {
//       const headers = {
//         'Content-Type': 'application/json',
//         ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
//       };

//       const body = {
//         status: eventForm.status,
//         note: eventForm.note,
//         carrier: eventForm.carrier,
//         trackingNumber: eventForm.trackingNumber,
//         trackingUrl: eventForm.trackingUrl,
//         eta: eventForm.eta ? new Date(eventForm.eta).toISOString() : undefined,
//         updatedByModel: 'Admin'
//       };

//       const res = await fetch(`/api/admin/orders/${id}/track`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(body)
//       });

//       if (!res.ok) throw new Error(`Failed to add event: ${res.status}`);
//       const newEvent = await res.json();

//       // Only update timeline (DO NOT change order.status)
//       setTimeline(prev => {
//         const arr = [...prev, newEvent];
//         return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//       });

//       // clear form fields (keep status for next event)
//       setEventForm(prev => ({ ...prev, note: '', carrier: '', trackingNumber: '', trackingUrl: '', eta: '' }));

//       alert('Tracking event added successfully');
//     } catch (err) {
//       console.error(err);
//       alert(err.message || 'Error adding event');
//     }
//   };

//   // ---------- Mark as paid ----------
//   const handleMarkAsPaid = async () => {
//     if (!order?._id || !window.confirm('Mark this order as paid?')) return;
    
//     setIsMarkingPaid(true);
//     try {
//       const res = await fetch(`/api/admin/orders/${order._id}/payment`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
//         },
//         body: JSON.stringify({ status: 'paid' })
//       });
      
//       if (!res.ok) throw new Error('Failed to update payment status');
      
//       // Refresh order data
//       const updatedOrder = await res.json();
//       setOrder(prev => ({
//         ...prev,
//         isPaid: true,
//         paymentInfo: {
//           ...prev.paymentInfo,
//           status: 'paid'
//         }
//       }));
      
//       // Add to timeline
//       setTimeline(prev => [
//         {
//           status: 'Payment Status Updated',
//           note: 'Marked as paid by admin',
//           createdAt: new Date().toISOString()
//         },
//         ...prev
//       ]);
      
//     } catch (err) {
//       console.error('Error marking as paid:', err);
//       alert('Failed to update payment status');
//     } finally {
//       setIsMarkingPaid(false);
//     }
//   };

//   // ---------- Quick status update for Customer & Shipping ----------
//   const handleQuickStatusChange = async (e) => {
//     const newStatus = e.target.value;
//     if (!id) return;
//     if (!confirm(`Change order status to "${newStatus}"?`)) return;

//     try {
//       const headers = {
//         'Content-Type': 'application/json',
//         ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
//       };

//       const res = await fetch(`/api/admin/orders/${id}`, {
//         method: 'PUT',
//         headers,
//         body: JSON.stringify({ status: newStatus })
//       });

//       if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
//       const payload = await res.json();
//       const updatedOrder = payload.order || payload;

//       // Update only Customer & Shipping status
//       setOrder(prev => prev ? { ...prev, status: updatedOrder.status ?? newStatus } : prev);

//       // Optional: Add a timeline event just for audit trail
//       try {
//         const evRes = await fetch(`/api/admin/orders/${id}/track`, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify({
//             status: newStatus,
//             note: `Status manually changed to ${newStatus} by admin`,
//             updatedByModel: 'Admin'
//           })
//         });
//         if (evRes.ok) {
//           const ev = await evRes.json();
//           setTimeline(prev => {
//             const arr = [...prev, ev];
//             return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//           });
//         }
//       } catch (e) {
//         console.warn('Failed to add tracking event after status update', e);
//       }

//       alert('Customer & Shipping status updated');
//     } catch (err) {
//       console.error(err);
//       alert(err.message || 'Error updating status');
//     }
//   };

//   // ---------- Render ----------
//   return (
//     <div className="p-6">
//       <div className="mb-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Order #{id}</h1>
//         <Link href="/admin/orders" className="text-indigo-600">Back to orders</Link>
//       </div>

//       {loading && <div className="p-4 bg-white rounded shadow">Loading...</div>}

//       {!loading && error && (
//         <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded mb-4">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {!loading && !order && !error && (
//         <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded mb-4">
//           Order not found or empty response from API.
//         </div>
//       )}

//       {!loading && order && (
//         <>
//           {/* ---------- Customer & Shipping ---------- */}
//           <div className="mb-6 bg-white shadow overflow-hidden sm:rounded-lg">
//             <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
//               <div>
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Order #{order.orderNumber || order._id}
//                 </h3>
//                 <p className="mt-1 max-w-2xl text-sm text-gray-500">
//                   Placed on {formatDate(order.createdAt)}
//                 </p>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   order.isPaid 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {order.isPaid ? 'Paid' : 'Unpaid'}
//                   {order.paymentMethod && (
//                     <span className="ml-1 text-xs">({order.paymentMethod})</span>
//                   )}
//                 </div>
//                 {!order.isPaid && (
//                   <button
//                     onClick={handleMarkAsPaid}
//                     disabled={isMarkingPaid}
//                     className={`px-3 py-1 rounded-md text-sm font-medium ${
//                       isMarkingPaid 
//                         ? 'bg-gray-100 text-gray-500' 
//                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                     }`}
//                   >
//                     {isMarkingPaid ? 'Updating...' : 'Mark as Paid'}
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
//               <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Customer
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     {order.customer?.name ?? order.shippingAddress?.fullName ?? order.shippingInfo?.name ?? 'Guest'}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Phone
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     {order.shippingAddress?.phone ?? order.shippingInfo?.phone ?? '—'}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Address
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     {order.shippingAddress
//                       ? `${order.shippingAddress.street || ''}${order.shippingAddress.city ? ', ' + order.shippingAddress.city : ''}${order.shippingAddress.state ? ', ' + order.shippingAddress.state : ''}${order.shippingAddress.postalCode ? ' - ' + order.shippingAddress.postalCode : ''}`
//                       : (order.shippingInfo?.address || '—')}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Created
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     {formatDate(order.createdAt)}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Total
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     ₹{Number(order.total ?? 0).toFixed(2)}
//                   </dd>
//                 </div>
//                 <div className="sm:col-span-1">
//                   <dt className="text-sm font-medium text-gray-500">
//                     Status
//                   </dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass(order.status)}`}>
//                       {prettyStatus(order.status)}
//                     </span>
//                   </dd>
//                 </div>
//               </dl>
//             </div>

//             <div className="px-4 py-5 sm:px-6">
//               <div className="flex justify-between">
//                 <p>
//                   <strong>Status:</strong>{' '}
//                   <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass(order.status)}`}>
//                     {prettyStatus(order.status)}
//                   </span>
//                 </p>

//                 {/* Quick status dropdown (added replace options) */}
//                 <div>
//                   <select
//                     value={order.status ?? 'Pending'}
//                     onChange={handleQuickStatusChange}
//                     className="border rounded p-1 text-sm"
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Processing">Processing</option>
//                     <option value="Paid">Paid</option>
//                     <option value="Shipped">Shipped</option>
//                     <option value="Delivered">Delivered</option>
//                     <option value="Replace Requested">Replace Requested</option>
//                     <option value="Replace Approved">Replace Approved</option>
//                     <option value="Replace Rejected">Replace Rejected</option>
//                     <option value="Cancelled">Cancelled</option>
//                     <option value="Refunded">Refunded</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ---------- Order Items + Timeline ---------- */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-2 bg-white shadow rounded p-4">
//               <h3 className="font-semibold mb-2">Order Items</h3>
//               {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-3 py-2 text-left text-xs text-gray-500">Product</th>
//                       <th className="px-3 py-2 text-left text-xs text-gray-500">Qty</th>
//                       <th className="px-3 py-2 text-left text-xs text-gray-500">Price</th>
//                       <th className="px-3 py-2 text-left text-xs text-gray-500">Subtotal</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-100">
//                     {order.orderItems.map((it, idx) => {
//                       const qty = Number(it.quantity ?? it.qty ?? 0);
//                       const price = Number(it.price ?? 0);
//                       return (
//                         <tr key={idx}>
//                           <td className="px-3 py-2 text-sm text-gray-700">{it.name || it.product || '—'}</td>
//                           <td className="px-3 py-2 text-sm text-gray-700">{qty}</td>
//                           <td className="px-3 py-2 text-sm text-gray-700">₹{price.toFixed(2)}</td>
//                           <td className="px-3 py-2 text-sm text-gray-700">₹{(price * qty).toFixed(2)}</td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="text-sm text-gray-500">No items available</div>
//               )}
//             </div>

//             {/* ---------- Order Timeline ---------- */}
//             <div className="bg-white shadow rounded p-4">
//               <h3 className="font-semibold mb-2">Order Timeline</h3>
//               {timeline.length === 0 ? (
//                 <div className="text-sm text-gray-500">No tracking events.</div>
//               ) : (
//                 <ul className="space-y-3 mb-3">
//                   {timeline.map(evt => (
//                     <li key={evt._id ?? evt.createdAt} className="border rounded p-2">
//                       <div className="flex justify-between">
//                         <div>
//                           <div className="font-medium">{prettyStatus(evt.status)}</div>
//                           {evt.note && <div className="text-sm text-gray-600">{evt.note}</div>}
//                           {evt.carrier && (
//                             <div className="text-sm text-gray-600">
//                               Carrier: {evt.carrier} - {evt.trackingNumber}
//                             </div>
//                           )}
//                           {evt.trackingUrl && (
//                             <div className="text-sm">
//                               <a target="_blank" rel="noreferrer" href={evt.trackingUrl} className="text-indigo-600">
//                                 Track shipment
//                               </a>
//                             </div>
//                           )}

//                           {/* Show replace/request images if present on the event */}
//                           {Array.isArray(evt.replaceRequestImages) && evt.replaceRequestImages.length > 0 && (
//                             <div className="mt-2 flex gap-2 flex-wrap">
//                               {evt.replaceRequestImages.map((img, idx) => (
//                                 <a key={idx} href={img} target="_blank" rel="noreferrer">
//                                   <img src={img} alt={`evt-img-${idx}`} className="w-20 h-20 object-cover rounded border" />
//                                 </a>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                         <div className="text-xs text-gray-500">{formatDate(evt.createdAt)}</div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               {/* Add tracking event form */}
//               <div className="border-t pt-3">
//                 <h4 className="font-medium mb-2">Add / Update Tracking Event</h4>
//                 <form onSubmit={handleAddEvent} className="space-y-2">
//                   <div>
//                     <label className="block text-sm">Status</label>
//                     <select
//                       name="status"
//                       value={eventForm.status}
//                       onChange={handleEventChange}
//                       className="w-full border p-2 rounded"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="processing">Processing</option>
//                       <option value="paid">Paid</option>
//                       <option value="shipped">Shipped</option>
//                       <option value="delivered">Delivered</option>
//                       <option value="replace requested">Replace Requested</option>
//                       <option value="replace approved">Replace Approved</option>
//                       <option value="replace rejected">Replace Rejected</option>
//                       <option value="cancelled">Cancelled</option>
//                       <option value="refunded">Refunded</option>
//                       <option value="failed">Failed</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm">Note</label>
//                     <textarea
//                       name="note"
//                       value={eventForm.note}
//                       onChange={handleEventChange}
//                       className="w-full border p-2 rounded"
//                       rows={3}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm">Carrier</label>
//                     <input name="carrier" value={eventForm.carrier} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                   </div>

//                   <div>
//                     <label className="block text-sm">Tracking Number</label>
//                     <input name="trackingNumber" value={eventForm.trackingNumber} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                   </div>

//                   <div>
//                     <label className="block text-sm">Tracking URL</label>
//                     <input name="trackingUrl" value={eventForm.trackingUrl} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                   </div>

//                   <div>
//                     <label className="block text-sm">ETA</label>
//                     <input type="date" name="eta" value={eventForm.eta} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                   </div>

//                   <div className="flex gap-2">
//                     <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded">Save event</button>
//                     <button
//                       type="button"
//                       onClick={() => setEventForm({ status: 'processing', note: '', carrier: '', trackingNumber: '', trackingUrl: '', eta: '' })}
//                       className="border px-3 py-1 rounded"
//                     >
//                       Reset
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


// pages/admin/orders/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminOrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [eventForm, setEventForm] = useState({
    status: 'processing',
    note: '',
    carrier: '',
    trackingNumber: '',
    trackingUrl: '',
    eta: ''
  });

  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  // ---------- Fetch order and timeline ----------
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};

        // fetch order
        const orderRes = await fetch(`/api/admin/orders/${id}`, { headers });
        if (!orderRes.ok) throw new Error(`Order fetch failed: ${orderRes.status}`);
        const orderData = await orderRes.json();

        // normalize amounts: amount, discountAmount, finalAmount
        const amount = Number(orderData.amount ?? orderData.total ?? 0) || 0;
        const discountAmount = Number(orderData.discountAmount ?? orderData.appliedCoupon?.discountApplied ?? 0) || 0;
        const finalAmount = typeof orderData.finalAmount !== 'undefined'
          ? Number(orderData.finalAmount)
          : Math.max(0, amount - discountAmount);

        // compute total if missing (older shapes)
        let total = finalAmount;
        if (!total || total === 0) {
          if (Array.isArray(orderData.orderItems) && orderData.orderItems.length) {
            total = orderData.orderItems.reduce((acc, it) => {
              const price = Number(it.price || 0);
              const qty = Number(it.quantity ?? it.qty ?? 0);
              return acc + price * qty;
            }, 0);
            // and apply discount if any
            total = Math.max(0, total - discountAmount);
          }
        }

        // fetch timeline
        let timelineData = [];
        try {
          const tlRes = await fetch(`/api/admin/orders/${id}/track`, { headers });
          if (tlRes.ok) timelineData = await tlRes.json();
        } catch (e) {
          console.warn('Failed to fetch timeline:', e);
        }

        if (mounted) {
          setOrder({
            ...orderData,
            amount,
            discountAmount,
            finalAmount,
            total
          });
          setTimeline(Array.isArray(timelineData) ? timelineData : []);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || 'Error fetching order');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [id, adminToken]);

  // ---------- Helpers ----------
  const prettyStatus = (raw) => {
    if (!raw) return 'Pending';
    const s = String(raw);
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const statusBadgeClass = (raw) => {
    const s = String(raw || '').toLowerCase();
    if (s.includes('completed') || s.includes('paid') || s.includes('delivered')) return 'bg-green-100 text-green-800';
    if (s.includes('processing')) return 'bg-yellow-100 text-yellow-800';
    if (s.includes('shipped')) return 'bg-indigo-100 text-indigo-800';
    if (s.includes('cancel') || s.includes('refunded') || s.includes('failed')) return 'bg-red-100 text-red-800';
    if (s.includes('replace')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (d) => {
    try {
      return format(new Date(d), 'PPP p');
    } catch {
      return '—';
    }
  };

  // ---------- Event form handlers ----------
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!id) return alert('Missing order id');
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      };

      const body = {
        status: eventForm.status,
        note: eventForm.note,
        carrier: eventForm.carrier,
        trackingNumber: eventForm.trackingNumber,
        trackingUrl: eventForm.trackingUrl,
        eta: eventForm.eta ? new Date(eventForm.eta).toISOString() : undefined,
        updatedByModel: 'Admin'
      };

      const res = await fetch(`/api/admin/orders/${id}/track`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error(`Failed to add event: ${res.status}`);
      const newEvent = await res.json();

      // Only update timeline (DO NOT change order.status)
      setTimeline(prev => {
        const arr = [...prev, newEvent];
        return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });

      // clear form fields (keep status for next event)
      setEventForm(prev => ({ ...prev, note: '', carrier: '', trackingNumber: '', trackingUrl: '', eta: '' }));

      alert('Tracking event added successfully');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error adding event');
    }
  };

  // ---------- Mark as paid ----------
  const handleMarkAsPaid = async () => {
    if (!order?._id || !window.confirm('Mark this order as paid?')) return;

    setIsMarkingPaid(true);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify({ status: 'paid' })
      });

      if (!res.ok) {
        const body = await res.text().catch(() => ({}));
        throw new Error(`Failed to update payment status (${res.status}): ${body}`);
      }

      const updated = await res.json();

      // update local order payment fields conservatively
      setOrder(prev => prev ? {
        ...prev,
        isPaid: true,
        paymentInfo: {
          ...(prev.paymentInfo || {}),
          status: 'paid'
        }
      } : prev);

      // Add to timeline
      setTimeline(prev => [
        {
          status: 'Payment Status Updated',
          note: 'Marked as paid by admin',
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);

      alert('Marked as paid');
    } catch (err) {
      console.error('Error marking as paid:', err);
      alert(err.message || 'Failed to update payment status');
    } finally {
      setIsMarkingPaid(false);
    }
  };

  // ---------- Quick status update for Customer & Shipping ----------
  const handleQuickStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!id) return;
    if (!confirm(`Change order status to "${newStatus}"?`)) return;

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
      };

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
      const payload = await res.json();
      const updatedOrder = payload.order || payload;

      // Update only Customer & Shipping status
      setOrder(prev => prev ? { ...prev, status: updatedOrder.status ?? newStatus } : prev);

      // Optional: Add a timeline event just for audit trail
      try {
        const evRes = await fetch(`/api/admin/orders/${id}/track`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            status: newStatus,
            note: `Status manually changed to ${newStatus} by admin`,
            updatedByModel: 'Admin'
          })
        });
        if (evRes.ok) {
          const ev = await evRes.json();
          setTimeline(prev => {
            const arr = [...prev, ev];
            return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          });
        }
      } catch (e) {
        console.warn('Failed to add tracking event after status update', e);
      }

      alert('Customer & Shipping status updated');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error updating status');
    }
  };

  // ---------- Render ----------
  // helper to format INR
  const fmt = (n) => (Number(n || 0)).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{id}</h1>
        <Link href="/admin/orders" className="text-indigo-600">Back to orders</Link>
      </div>

      {loading && <div className="p-4 bg-white rounded shadow">Loading...</div>}

      {!loading && error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !order && !error && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded mb-4">
          Order not found or empty response from API.
        </div>
      )}

      {!loading && order && (
        <>
          {/* ---------- Customer & Shipping ---------- */}
          <div className="mb-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Order #{order.orderNumber || order._id}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                  {order.paymentMethod && (
                    <span className="ml-1 text-xs">({order.paymentMethod})</span>
                  )}
                </div>
                {!order.isPaid && (
                  <button
                    onClick={handleMarkAsPaid}
                    disabled={isMarkingPaid}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${isMarkingPaid ? 'bg-gray-100 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {isMarkingPaid ? 'Updating...' : 'Mark as Paid'}
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Customer</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.customer?.name ?? order.shippingAddress?.fullName ?? order.shippingInfo?.name ?? 'Guest'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.shippingAddress?.phone ?? order.shippingInfo?.phone ?? '—'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.shippingAddress
                      ? `${order.shippingAddress.street || ''}${order.shippingAddress.city ? ', ' + order.shippingAddress.city : ''}${order.shippingAddress.state ? ', ' + order.shippingAddress.state : ''}${order.shippingAddress.postalCode ? ' - ' + order.shippingAddress.postalCode : ''}`
                      : (order.shippingInfo?.address || '—')}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(order.createdAt)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total (Paid)</dt>
                  <dd className="mt-1 text-sm text-gray-900">₹{fmt(order.finalAmount ?? order.total ?? 0)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass(order.status)}`}>{prettyStatus(order.status)}</span>
                  </dd>
                </div>
                {order.discountAmount > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Discount</dt>
                    <dd className="mt-1 text-sm text-gray-900">- ₹{fmt(order.discountAmount)} {order.appliedCoupon?.code ? `(${order.appliedCoupon.code})` : ''}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between">
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass(order.status)}`}>
                    {prettyStatus(order.status)}
                  </span>
                </p>

                {/* Quick status dropdown (added replace options) */}
                <div>
                  <select
                    value={order.status ?? 'Pending'}
                    onChange={handleQuickStatusChange}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Paid">Paid</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Replace Requested">Replace Requested</option>
                    <option value="Replace Approved">Replace Approved</option>
                    <option value="Replace Rejected">Replace Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Order Items + Timeline ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white shadow rounded p-4">
              <h3 className="font-semibold mb-2">Order Items</h3>
              {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-gray-500">Product</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500">Qty</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500">Price</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {order.orderItems.map((it, idx) => {
                      const qty = Number(it.quantity ?? it.qty ?? 0);
                      const price = Number(it.price ?? 0);
                      return (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-sm text-gray-700">{it.name || it.product || '—'}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">{qty}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">₹{price.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">₹{(price * qty).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-sm text-gray-500">No items available</div>
              )}
            </div>

            {/* ---------- Order Timeline ---------- */}
            <div className="bg-white shadow rounded p-4">
              <h3 className="font-semibold mb-2">Order Timeline</h3>
              {timeline.length === 0 ? (
                <div className="text-sm text-gray-500">No tracking events.</div>
              ) : (
                <ul className="space-y-3 mb-3">
                  {timeline.map(evt => (
                    <li key={evt._id ?? evt.createdAt} className="border rounded p-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{prettyStatus(evt.status)}</div>
                          {evt.note && <div className="text-sm text-gray-600">{evt.note}</div>}
                          {evt.carrier && (
                            <div className="text-sm text-gray-600">Carrier: {evt.carrier} - {evt.trackingNumber}</div>
                          )}
                          {evt.trackingUrl && (
                            <div className="text-sm">
                              <a target="_blank" rel="noreferrer" href={evt.trackingUrl} className="text-indigo-600">Track shipment</a>
                            </div>
                          )}

                          {Array.isArray(evt.replaceRequestImages) && evt.replaceRequestImages.length > 0 && (
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {evt.replaceRequestImages.map((img, idx) => (
                                <a key={idx} href={img} target="_blank" rel="noreferrer">
                                  <img src={img} alt={`evt-img-${idx}`} className="w-20 h-20 object-cover rounded border" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(evt.createdAt)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add tracking event form */}
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Add / Update Tracking Event</h4>
                <form onSubmit={handleAddEvent} className="space-y-2">
                  <div>
                    <label className="block text-sm">Status</label>
                    <select name="status" value={eventForm.status} onChange={handleEventChange} className="w-full border p-2 rounded">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="replace requested">Replace Requested</option>
                      <option value="replace approved">Replace Approved</option>
                      <option value="replace rejected">Replace Rejected</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm">Note</label>
                    <textarea name="note" value={eventForm.note} onChange={handleEventChange} className="w-full border p-2 rounded" rows={3} />
                  </div>

                  <div>
                    <label className="block text-sm">Carrier</label>
                    <input name="carrier" value={eventForm.carrier} onChange={handleEventChange} className="w-full border p-2 rounded" />
                  </div>

                  <div>
                    <label className="block text-sm">Tracking Number</label>
                    <input name="trackingNumber" value={eventForm.trackingNumber} onChange={handleEventChange} className="w-full border p-2 rounded" />
                  </div>

                  <div>
                    <label className="block text-sm">Tracking URL</label>
                    <input name="trackingUrl" value={eventForm.trackingUrl} onChange={handleEventChange} className="w-full border p-2 rounded" />
                  </div>

                  <div>
                    <label className="block text-sm">ETA</label>
                    <input type="date" name="eta" value={eventForm.eta} onChange={handleEventChange} className="w-full border p-2 rounded" />
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded">Save event</button>
                    <button type="button" onClick={() => setEventForm({ status: 'processing', note: '', carrier: '', trackingNumber: '', trackingUrl: '', eta: '' })} className="border px-3 py-1 rounded">Reset</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
