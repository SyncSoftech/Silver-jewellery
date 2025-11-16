

// // pages/admin/orders/index.js
// import { useState, useEffect } from 'react';
// import Link from 'next/link';



// export default function Orders() {
//   const [orders, setOrders] = useState([]); // default array
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     paymentStatus: 'all',
//     orderId: '',
//     startDate: '',
//     endDate: ''
//   });

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
//           const text = await response.text();
//           console.error('Failed to fetch orders:', response.status, text);
//           setOrders([]);
//           setError(`Failed to fetch orders: ${response.status}`);
//           return;
//         }

//         const data = await response.json();
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

//   // Helper to choose badge classes by status
//   const badgeForStatus = (rawStatus) => {
//     const s = (rawStatus || '').toString().toLowerCase();
//     if (s.includes('completed') || s.includes('paid') || s.includes('delivered')) {
//       return 'bg-green-100 text-green-800';
//     }
//     if (s.includes('processing')) {
//       return 'bg-yellow-100 text-yellow-800';
//     }
//     if (s.includes('shipped')) {
//       return 'bg-indigo-100 text-indigo-800';
//     }
//     if (s.includes('cancel') || s.includes('refunded') || s.includes('failed')) {
//       return 'bg-red-100 text-red-800';
//     }
//     return 'bg-gray-100 text-gray-800';
//   };

//   const prettyStatus = (rawStatus) => {
//     if (!rawStatus) return 'Pending';
//     const s = rawStatus.toString();
//     return s.charAt(0).toUpperCase() + s.slice(1);
//   };

//   // Filter orders based on filters
//   const filteredOrders = orders.filter(order => {
//     // Payment status filter
//     if (filters.paymentStatus !== 'all') {
//       const isPaid = order.isPaid || (order.paymentInfo?.status === 'paid');
//       if (filters.paymentStatus === 'paid' && !isPaid) return false;
//       if (filters.paymentStatus === 'unpaid' && isPaid) return false;
//     }

//     // Order ID filter
//     if (filters.orderId) {
//       const orderId = String(order._id || '').toLowerCase();
//       const orderNumber = String(order.orderNumber || '').toLowerCase();
//       const searchId = filters.orderId.toLowerCase();
//       if (!orderId.includes(searchId) && !orderNumber.includes(searchId)) {
//         return false;
//       }
//     }

//     // Date range filter
//     if (filters.startDate || filters.endDate) {
//       const orderDate = new Date(order.createdAt);
      
//       if (filters.startDate) {
//         const startDate = new Date(filters.startDate);
//         startDate.setHours(0, 0, 0, 0);
//         if (orderDate < startDate) return false;
//       }
      
//       if (filters.endDate) {
//         const endDate = new Date(filters.endDate);
//         endDate.setHours(23, 59, 59, 999);
//         if (orderDate > endDate) return false;
//       }
//     }

//     return true;
//   });

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const resetFilters = () => {
//     setFilters({
//       paymentStatus: 'all',
//       orderId: '',
//       startDate: '',
//       endDate: ''
//     });
//   };

//   if (loading) {
//     return <div className="p-6">Loading orders...</div>;
//   }

//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold">Orders Management</h1>
//         </div>
        
//         {/* Filters Section */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             {/* Order ID Search */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Order ID/Number</label>
//               <input
//                 type="text"
//                 name="orderId"
//                 value={filters.orderId}
//                 onChange={handleFilterChange}
//                 placeholder="Search by ID or number"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>

//             {/* Payment Status */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
//               <select
//                 name="paymentStatus"
//                 value={filters.paymentStatus}
//                 onChange={handleFilterChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               >
//                 <option value="all">All Orders</option>
//                 <option value="paid">Paid</option>
//                 <option value="unpaid">Unpaid</option>
//               </select>
//             </div>

//             {/* Date Range */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={filters.startDate}
//                 onChange={handleFilterChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={filters.endDate}
//                 onChange={handleFilterChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>

//             {/* Reset Button */}
//             <div className="flex items-end">
//               <button
//                 onClick={resetFilters}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
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
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredOrders.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                   {orders.length === 0 ? 'No orders found' : 'No orders match the selected filter'}
//                 </td>
//               </tr>
//             ) : (
//               filteredOrders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <Link href={`/admin/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
//                       {order.orderNumber || order._id}
//                     </Link>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium text-gray-900">{order.customer?.name || 'Guest'}</div>
//                     <div className="text-sm text-gray-500">{order.customer?.email || 'No email'}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
//                     <div className="text-xs text-gray-500">
//                       {new Date(order.createdAt).toLocaleTimeString()}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     ₹{order.total?.toFixed(2) || '0.00'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {order.isPaid ? 'Paid' : 'Unpaid'}
//                       {order.paymentMethod && (
//                         <span className="ml-1 text-gray-500">({order.paymentMethod})</span>
//                       )}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <Link href={`/admin/orders/${order._id}`}>
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${badgeForStatus(order.status)}`}>
//                         {prettyStatus(order.status)}
//                       </span>
//                     </Link>
//                   </td>
//                 </tr>
//               ))
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
  const [filters, setFilters] = useState({
    paymentStatus: 'all',
    orderId: '',
    startDate: '',
    endDate: ''
  });

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

        // Normalize each order so UI can rely on finalAmount, amount, discountAmount, createdAt, customer
        const normalized = ordersArray.map(o => {
          const amount = Number(o.amount ?? o.total ?? o.subtotal ?? 0);
          const discountAmount = Number(o.discountAmount ?? o.appliedCoupon?.discountApplied ?? o.discount ?? 0);
          const finalAmount = typeof o.finalAmount !== 'undefined'
            ? Number(o.finalAmount)
            : Math.max(0, amount - (discountAmount || 0));

          const createdAt = o.createdAt ? new Date(o.createdAt).toISOString() : (o.createdAtRaw ? new Date(o.createdAtRaw).toISOString() : null);

          // customer info might be nested differently
          const customer = o.customer || (o.user && (typeof o.user === 'object' ? o.user : { name: o.user })) || (o.userId ? { id: o.userId } : null);

          return {
            ...o,
            amount,
            discountAmount,
            finalAmount,
            createdAt,
            customer
          };
        });

        setOrders(normalized);
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

  // Format number to INR
  const fmt = (num) => {
    const n = Number(num) || 0;
    return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  // Filter orders based on filters
  const filteredOrders = orders.filter(order => {
    // Payment status filter
    if (filters.paymentStatus !== 'all') {
      const isPaid = order.isPaid || (order.paymentInfo?.status === 'paid') || (order.status && order.status.toString().toLowerCase().includes('paid'));
      if (filters.paymentStatus === 'paid' && !isPaid) return false;
      if (filters.paymentStatus === 'unpaid' && isPaid) return false;
    }

    // Order ID filter
    if (filters.orderId) {
      const orderId = String(order._id || '').toLowerCase();
      const orderNumber = String(order.orderNumber || '').toLowerCase();
      const searchId = filters.orderId.toLowerCase();
      if (!orderId.includes(searchId) && !orderNumber.includes(searchId)) {
        return false;
      }
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      const orderDate = new Date(order.createdAt || order.createdAtRaw || Date.now());

      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (orderDate < startDate) return false;
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }
    }

    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      paymentStatus: 'all',
      orderId: '',
      startDate: '',
      endDate: ''
    });
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Orders Management</h1>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Order ID Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID/Number</label>
              <input
                type="text"
                name="orderId"
                value={filters.orderId}
                onChange={handleFilterChange}
                placeholder="Search by ID or number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">All Orders</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  {orders.length === 0 ? 'No orders found' : 'No orders match the selected filter'}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                      {order.orderNumber || order._id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.customer?.name || order.customer?.id || 'Guest'}</div>
                    <div className="text-sm text-gray-500">{order.customer?.email || 'No email'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</div>
                    <div className="text-xs text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{fmt(order.finalAmount ?? order.amount ?? 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                      {order.paymentMethod && (
                        <span className="ml-1 text-gray-500">({order.paymentMethod})</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/orders/${order._id}`}>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${badgeForStatus(order.status)}`}>
                        {prettyStatus(order.status)}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
