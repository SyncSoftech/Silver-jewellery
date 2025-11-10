// // pages/admin/orders/index.js
// import { useState, useEffect } from 'react';
// // import AdminLayout from '../../../../components/AdminLayout';

// export default function Orders() {
//   const [orders, setOrders] = useState([]); // default array
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
//         const response = await fetch('/api/admin/orders', {
//           headers: token ? { 'Authorization': `Bearer ${token}` } : {}
//         });

//         if (!response.ok) {
//           // try to get text message for debugging
//           const text = await response.text();
//           console.error('Failed to fetch orders:', response.status, text);
//           setOrders([]);
//           setError(`Failed to fetch orders: ${response.status}`);
//           return;
//         }

//         const data = await response.json();
//         // Normalize response into an array
//         const ordersArray = Array.isArray(data)
//           ? data
//           : Array.isArray(data.orders)
//           ? data.orders
//           : [];

//         setOrders(ordersArray);
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setOrders([]);
//         setError('Error fetching orders');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const resp = await fetch(`/api/admin/orders/${orderId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ status })
//       });

//       if (!resp.ok) {
//         const text = await resp.text();
//         console.error('Failed to update order:', resp.status, text);
//         return;
//       }

//       // Option A: re-fetch (safe)
//       const refreshResp = await fetch('/api/admin/orders', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       if (refreshResp.ok) {
//         const refreshed = await refreshResp.json();
//         const ordersArray = Array.isArray(refreshed)
//           ? refreshed
//           : Array.isArray(refreshed.orders)
//           ? refreshed.orders
//           : [];
//         setOrders(ordersArray);
//       } else {
//         // Option B fallback: update local state optimistically
//         setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, status } : o)));
//       }
//     } catch (error) {
//       console.error('Error updating order:', error);
//     }
//   };

//   if (loading) {
//     return <div className="p-6">Loading orders...</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

//       {error && (
//         <div className="mb-4 text-red-600">
//           {error}
//         </div>
//       )}

//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {Array.isArray(orders) && orders.length > 0 ? (
//               orders.map((order) => (
//                 <tr key={order._id || order.id || Math.random()}>
//                   <td className="px-6 py-4 whitespace-nowrap">#{order.orderNumber ?? order._id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{order.customer?.name ?? '—'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{typeof order.total === 'number' ? `$${order.total.toFixed(2)}` : '—'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                       ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
//                         order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
//                         'bg-red-100 text-red-800'}`}>
//                       {order.status ?? '—'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <select
//                       value={order.status ?? ''}
//                       onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                       className="border rounded p-1 text-sm"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="processing">Processing</option>
//                       <option value="shipped">Shipped</option>
//                       <option value="delivered">Delivered</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                   No orders found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


// pages/admin/orders/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';



export default function Orders() {
  const [orders, setOrders] = useState([]); // default array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        const response = await fetch('/api/admin/orders', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Failed to fetch orders:', response.status, text);
          setOrders([]);
          setError(`Failed to fetch orders: ${response.status}`);
          return;
        }

        const data = await response.json();
        const ordersArray = Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
          ? data.orders
          : [];

        setOrders(ordersArray);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]);
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper to choose badge classes by status
  const badgeForStatus = (rawStatus) => {
    const s = (rawStatus || '').toString().toLowerCase();
    if (s.includes('completed') || s.includes('paid') || s.includes('delivered')) {
      return 'bg-green-100 text-green-800';
    }
    if (s.includes('processing')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (s.includes('shipped')) {
      return 'bg-indigo-100 text-indigo-800';
    }
    if (s.includes('cancel') || s.includes('refunded') || s.includes('failed')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const prettyStatus = (rawStatus) => {
    if (!rawStatus) return 'Pending';
    const s = rawStatus.toString();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      {error && (
        <div className="mb-4 text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status (click to view)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => {
                const id = order._id || order.id || Math.random();
                const orderLabel = order.orderNumber ?? (String(id).slice(-6).toUpperCase());
                const customerName = order.customer?.name ?? order.shippingInfo?.fullName ?? '—';
                const dateLabel = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—';
                const total = typeof order.total === 'number' ? `$${order.total.toFixed(2)}` : (order.amount ? `$${Number(order.amount).toFixed(2)}` : '—');
                const status = order.status ?? 'pending';

                return (
                  <tr key={id}>
                    <td className="px-6 py-4 whitespace-nowrap">#{orderLabel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dateLabel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/orders/${order._id || order.id}`} className="inline-block">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeForStatus(status)}`}>
                          {prettyStatus(status)}
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
