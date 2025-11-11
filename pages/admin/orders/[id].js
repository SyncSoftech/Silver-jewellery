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
//   const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

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
//         if (!orderRes.ok) {
//           const txt = await orderRes.text().catch(() => '');
//           throw new Error(`Order fetch failed: ${orderRes.status} ${txt}`);
//         }
//         const orderData = await orderRes.json();

//         // compute total if missing
//         let total = 0;
//         if (typeof orderData.total === 'number' && orderData.total > 0) {
//           total = orderData.total;
//         } else if (typeof orderData.amount === 'number' && orderData.amount > 0) {
//           total = orderData.amount;
//         } else if (Array.isArray(orderData.orderItems) && orderData.orderItems.length) {
//           total = orderData.orderItems.reduce((acc, it) => {
//             const price = Number(it.price || 0);
//             const qty = Number(it.quantity ?? it.qty ?? 0);
//             return acc + price * qty;
//           }, 0);
//         }

//         // try fetch timeline (optional)
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

//   // ------- Event form handlers -------
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

//       if (!res.ok) {
//         const txt = await res.text().catch(() => '');
//         throw new Error(`Failed to add event: ${res.status} ${txt}`);
//       }

//       const newEvent = await res.json();

//       // Append and sort timeline by createdAt
//       setTimeline(prev => {
//         const arr = [...prev, newEvent];
//         return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//       });

//       // update order status locally if API updated it
//       setOrder(prev => prev ? { ...prev, status: newEvent.status || eventForm.status } : prev);

//       // clear form fields (keep status for next event)
//       setEventForm(prev => ({ ...prev, note: '', carrier: '', trackingNumber: '', trackingUrl: '', eta: '' }));

//       alert('Event added');
//     } catch (err) {
//       console.error(err);
//       alert(err.message || 'Error adding event');
//     }
//   };

//   // ------- Quick status update (PUT) -------
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

//       if (!res.ok) {
//         const txt = await res.text().catch(() => '');
//         throw new Error(`Failed to update status: ${res.status} ${txt}`);
//       }

//       const payload = await res.json();

//       // If API returns updated order, use it; else update locally
//       const updatedOrder = payload.order || payload;
//       setOrder(prev => prev ? { ...prev, status: updatedOrder.status ?? newStatus } : prev);

//       // Also create a tracking event for the status change (nice audit trail)
//       try {
//         const evRes = await fetch(`/api/admin/orders/${id}/track`, {
//           method: 'POST',
//           headers,
//           body: JSON.stringify({
//             status: newStatus,
//             note: `Status changed to ${newStatus} by admin`,
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

//       alert('Status updated');
//     } catch (err) {
//       console.error(err);
//       alert(err.message || 'Error updating status');
//     }
//   };

//   return (
//     <>
//       <div className="p-6">
//         <div className="mb-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Order #{id}</h1>
//           <Link href="/admin/orders" className="text-indigo-600">Back to orders</Link>
//         </div>

//         {loading && <div className="p-4 bg-white rounded shadow">Loading...</div>}

//         {!loading && error && (
//           <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded mb-4">
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         {!loading && !order && !error && (
//           <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded mb-4">
//             Order not found or empty response from API.
//           </div>
//         )}

//         {!loading && order && (
//           <>
//             <div className="mb-6 bg-white shadow p-4 rounded">
//               <h2 className="font-semibold mb-2">Customer & Shipping</h2>
//               <p className="text-sm text-gray-700">
//                 <strong>Name:</strong>{' '}
//                 {order.customer?.name ?? order.shippingAddress?.fullName ?? order.shippingInfo?.name ?? 'Guest'}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <strong>Phone:</strong>{' '}
//                 {order.shippingAddress?.phone ?? order.shippingInfo?.phone ?? '—'}
//               </p>
//               <p className="text-sm text-gray-700">
//                 <strong>Address:</strong>{' '}
//                 {order.shippingAddress
//                   ? `${order.shippingAddress.street || ''}${order.shippingAddress.city ? ', ' + order.shippingAddress.city : ''}${order.shippingAddress.state ? ', ' + order.shippingAddress.state : ''}${order.shippingAddress.postalCode ? ' - ' + order.shippingAddress.postalCode : ''}`
//                   : (order.shippingInfo?.address || '—')}
//               </p>
//               <p className="mt-2 text-sm text-gray-700"><strong>Created:</strong> {order.createdAt ? formatDate(order.createdAt) : '—'}</p>
//               <p className="mt-2 text-sm text-gray-700"><strong>Total:</strong> ₹{Number(order.total ?? 0).toFixed(2)}</p>
//               <div className="mt-2 flex items-center gap-4">
//                 <p><strong>Status:</strong>{' '}
//                   <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass(order.status)}`}>
//                     {prettyStatus(order.status)}
//                   </span>
//                 </p>

//                 {/* quick status select */}
//                 <div>
//                   <select value={order.status ?? 'pending'} onChange={handleQuickStatusChange} className="border rounded p-1 text-sm">
//                     <option value="pending">Pending</option>
//                     <option value="processing">Processing</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                     <option value="refunded">Refunded</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="md:col-span-2 bg-white shadow rounded p-4">
//                 <h3 className="font-semibold mb-2">Order Items</h3>
//                 {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-3 py-2 text-left text-xs text-gray-500">Product</th>
//                         <th className="px-3 py-2 text-left text-xs text-gray-500">Qty</th>
//                         <th className="px-3 py-2 text-left text-xs text-gray-500">Price</th>
//                         <th className="px-3 py-2 text-left text-xs text-gray-500">Subtotal</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-100">
//                       {order.orderItems.map((it, idx) => {
//                         const qty = Number(it.quantity ?? it.qty ?? 0);
//                         const price = Number(it.price ?? 0);
//                         return (
//                           <tr key={idx}>
//                             <td className="px-3 py-2 text-sm text-gray-700">{it.name || it.product || '—'}</td>
//                             <td className="px-3 py-2 text-sm text-gray-700">{qty}</td>
//                             <td className="px-3 py-2 text-sm text-gray-700">₹{price.toFixed(2)}</td>
//                             <td className="px-3 py-2 text-sm text-gray-700">₹{(price * qty).toFixed(2)}</td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-sm text-gray-500">No items available</div>
//                 )}
//               </div>

//               <div className="bg-white shadow rounded p-4">
//                 <h3 className="font-semibold mb-2">Order Timeline</h3>
//                 {timeline.length === 0 ? (
//                   <div className="text-sm text-gray-500">No tracking events.</div>
//                 ) : (
//                   <ul className="space-y-3 mb-3">
//                     {timeline.map(evt => (
//                       <li key={evt._id ?? evt.createdAt} className="border rounded p-2">
//                         <div className="flex justify-between">
//                           <div>
//                             <div className="font-medium">{(evt.status || '').charAt(0).toUpperCase() + (evt.status || '').slice(1)}</div>
//                             {evt.note && <div className="text-sm text-gray-600">{evt.note}</div>}
//                             {evt.carrier && <div className="text-sm text-gray-600">Carrier: {evt.carrier} - {evt.trackingNumber}</div>}
//                             {evt.trackingUrl && <div className="text-sm"><a target="_blank" rel="noreferrer" href={evt.trackingUrl} className="text-indigo-600">Track shipment</a></div>}
//                           </div>
//                           <div className="text-xs text-gray-500">{formatDate(evt.createdAt)}</div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 {/* Add tracking event form */}
//                 <div className="border-t pt-3">
//                   <h4 className="font-medium mb-2">Add / Update Tracking Event</h4>
//                   <form onSubmit={handleAddEvent} className="space-y-2">
//                     <div>
//                       <label className="block text-sm">Status</label>
//                       <select name="status" value={eventForm.status} onChange={handleEventChange} className="w-full border p-2 rounded">
//                         <option value="pending">Pending</option>
//                         <option value="processing">Processing</option>
//                         <option value="shipped">Shipped</option>
//                         <option value="completed">Completed</option>
//                         <option value="cancelled">Cancelled</option>
//                         <option value="refunded">Refunded</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm">Note</label>
//                       <textarea name="note" value={eventForm.note} onChange={handleEventChange} className="w-full border p-2 rounded" rows={3} />
//                     </div>

//                     <div>
//                       <label className="block text-sm">Carrier</label>
//                       <input name="carrier" value={eventForm.carrier} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                     </div>

//                     <div>
//                       <label className="block text-sm">Tracking Number</label>
//                       <input name="trackingNumber" value={eventForm.trackingNumber} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                     </div>

//                     <div>
//                       <label className="block text-sm">Tracking URL</label>
//                       <input name="trackingUrl" value={eventForm.trackingUrl} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                     </div>

//                     <div>
//                       <label className="block text-sm">ETA</label>
//                       <input type="date" name="eta" value={eventForm.eta} onChange={handleEventChange} className="w-full border p-2 rounded" />
//                     </div>

//                     <div className="flex gap-2">
//                       <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded">Save event</button>
//                       <button type="button" onClick={() => setEventForm({ status: 'processing', note: '', carrier: '', trackingNumber: '', trackingUrl: '', eta: '' })} className="border px-3 py-1 rounded">Reset</button>
//                     </div>
//                   </form>
//                 </div>

//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
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

        // compute total if missing
        let total = 0;
        if (typeof orderData.total === 'number' && orderData.total > 0) {
          total = orderData.total;
        } else if (Array.isArray(orderData.orderItems) && orderData.orderItems.length) {
          total = orderData.orderItems.reduce((acc, it) => {
            const price = Number(it.price || 0);
            const qty = Number(it.quantity ?? it.qty ?? 0);
            return acc + price * qty;
          }, 0);
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
          setOrder({ ...orderData, total });
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

      // ✅ Only update timeline (DO NOT change order.status)
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

      // ✅ Update only Customer & Shipping status
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
          <div className="mb-6 bg-white shadow p-4 rounded">
            <h2 className="font-semibold mb-2">Customer & Shipping</h2>
            <p className="text-sm text-gray-700">
              <strong>Name:</strong>{' '}
              {order.customer?.name ?? order.shippingAddress?.fullName ?? order.shippingInfo?.name ?? 'Guest'}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Phone:</strong>{' '}
              {order.shippingAddress?.phone ?? order.shippingInfo?.phone ?? '—'}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Address:</strong>{' '}
              {order.shippingAddress
                ? `${order.shippingAddress.street || ''}${order.shippingAddress.city ? ', ' + order.shippingAddress.city : ''}${order.shippingAddress.state ? ', ' + order.shippingAddress.state : ''}${order.shippingAddress.postalCode ? ' - ' + order.shippingAddress.postalCode : ''}`
                : (order.shippingInfo?.address || '—')}
            </p>
            <p className="mt-2 text-sm text-gray-700"><strong>Created:</strong> {order.createdAt ? formatDate(order.createdAt) : '—'}</p>
            <p className="mt-2 text-sm text-gray-700"><strong>Total:</strong> ₹{Number(order.total ?? 0).toFixed(2)}</p>

            <div className="mt-2 flex items-center gap-4">
              <p>
                <strong>Status:</strong>{' '}
                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass(order.status)}`}>
                  {prettyStatus(order.status)}
                </span>
              </p>

              {/* Quick status dropdown */}
              <div>
                <select
                  value={order.status ?? 'Pending'}
                  onChange={handleQuickStatusChange}
                  className="border rounded p-1 text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Paid">Paid</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
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
                            <div className="text-sm text-gray-600">
                              Carrier: {evt.carrier} - {evt.trackingNumber}
                            </div>
                          )}
                          {evt.trackingUrl && (
                            <div className="text-sm">
                              <a target="_blank" rel="noreferrer" href={evt.trackingUrl} className="text-indigo-600">
                                Track shipment
                              </a>
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
                    <select
                      name="status"
                      value={eventForm.status}
                      onChange={handleEventChange}
                      className="w-full border p-2 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm">Note</label>
                    <textarea
                      name="note"
                      value={eventForm.note}
                      onChange={handleEventChange}
                      className="w-full border p-2 rounded"
                      rows={3}
                    />
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
                    <button
                      type="button"
                      onClick={() => setEventForm({ status: 'processing', note: '', carrier: '', trackingNumber: '', trackingUrl: '', eta: '' })}
                      className="border px-3 py-1 rounded"
                    >
                      Reset
                    </button>
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
