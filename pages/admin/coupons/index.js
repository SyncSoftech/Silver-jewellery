// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function CouponsPage() {
//   const router = useRouter();
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     code: '',
//     description: '',
//     discountType: 'percentage',
//     value: 10,
//     minOrderAmount: 0,
//     maxDiscount: null,
//     startDate: new Date().toISOString().split('T')[0],
//     endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//     usageLimit: 100,
//     perUserLimit: 1,
//     isActive: true,
//     applicableProducts: [],
//     applicableCategories: []
//   });



//   const fetchCoupons = async () => {
//     try {
//       const res = await fetch('/api/coupons');
//       const data = await res.json();
//       if (data.success) {
//         setCoupons(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching coupons:', error);
//       toast.error('Failed to load coupons');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('/api/coupons', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
      
//       if (data.success) {
//         toast.success('Coupon created successfully');
//         setShowForm(false);
//         fetchCoupons();
//         // Reset form
//         setFormData({
//           code: '',
//           description: '',
//           discountType: 'percentage',
//           value: 10,
//           minOrderAmount: 0,
//           maxDiscount: null,
//           startDate: new Date().toISOString().split('T')[0],
//           endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//           usageLimit: 100,
//           perUserLimit: 1,
//           isActive: true,
//           applicableProducts: [],
//           applicableCategories: []
//         });
//       } else {
//         toast.error(data.message || 'Failed to create coupon');
//       }
//     } catch (error) {
//       console.error('Error creating coupon:', error);
//       toast.error('Failed to create coupon');
//     }
//   };

//   const toggleStatus = async (id, currentStatus) => {
//     try {
//       const res = await fetch(`/api/coupons/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ isActive: !currentStatus }),
//       });

//       const data = await res.json();
      
//       if (data.success) {
//         toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
//         fetchCoupons();
//       } else {
//         toast.error(data.message || 'Failed to update coupon status');
//       }
//     } catch (error) {
//       console.error('Error updating coupon status:', error);
//       toast.error('Failed to update coupon status');
//     }
//   };


//   return (
//           <div className="container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
//           <button
//             onClick={() => setShowForm(!showForm)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//           >
//             {showForm ? 'Cancel' : 'Create New Coupon'}
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h2 className="text-xl font-semibold mb-4">Create New Coupon</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
//                   <input
//                     type="text"
//                     name="code"
//                     value={formData.code}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <input
//                     type="text"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
//                   <select
//                     name="discountType"
//                     value={formData.discountType}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     required
//                   >
//                     <option value="percentage">Percentage</option>
//                     <option value="fixed">Fixed Amount</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {formData.discountType === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
//                   </label>
//                   <div className="relative">
//                     {formData.discountType === 'percentage' ? (
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <span className="text-gray-500">%</span>
//                       </div>
//                     ) : (
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <span className="text-gray-500">₹</span>
//                       </div>
//                     )}
//                     <input
//                       type="number"
//                       name="value"
//                       min="0"
//                       step={formData.discountType === 'percentage' ? '0.01' : '1'}
//                       value={formData.value}
//                       onChange={handleInputChange}
//                       className="w-full pl-8 p-2 border border-gray-300 rounded-md"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {formData.discountType === 'percentage' && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Maximum Discount (₹)
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <span className="text-gray-500">₹</span>
//                       </div>
//                       <input
//                         type="number"
//                         name="maxDiscount"
//                         min="0"
//                         step="1"
//                         value={formData.maxDiscount || ''}
//                         onChange={handleInputChange}
//                         className="w-full pl-8 p-2 border border-gray-300 rounded-md"
//                         placeholder="No limit"
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Minimum Order Amount (₹) *
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <span className="text-gray-500">₹</span>
//                     </div>
//                     <input
//                       type="number"
//                       name="minOrderAmount"
//                       min="0"
//                       step="1"
//                       value={formData.minOrderAmount}
//                       onChange={handleInputChange}
//                       className="w-full pl-8 p-2 border border-gray-300 rounded-md"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={formData.endDate}
//                     min={formData.startDate}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
//                   <input
//                     type="number"
//                     name="usageLimit"
//                     min="1"
//                     value={formData.usageLimit}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                     placeholder="Unlimited if empty"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Uses Per Customer</label>
//                   <input
//                     type="number"
//                     name="perUserLimit"
//                     min="1"
//                     value={formData.perUserLimit}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   />
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="isActive"
//                     name="isActive"
//                     checked={formData.isActive}
//                     onChange={handleInputChange}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
//                     Active
//                   </label>
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Create Coupon
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//           <div className="px-4 py-5 sm:px-6">
//             <h3 className="text-lg leading-6 font-medium text-gray-900">All Coupons</h3>
//             <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your store's promotional coupons</p>
//           </div>
          
//           {loading ? (
//             <div className="px-4 py-5 sm:px-6 text-center">
//               <p>Loading coupons...</p>
//             </div>
//           ) : coupons.length === 0 ? (
//             <div className="px-4 py-5 sm:px-6 text-center">
//               <p className="text-gray-500">No coupons found. Create your first coupon!</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Code
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Description
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Discount
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Min. Order
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Validity
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Usage
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {coupons.map((coupon) => (
//                     <tr key={coupon._id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{coupon.description || '-'}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {coupon.discountType === 'percentage' 
//                             ? `${coupon.value}%` 
//                             : `₹${coupon.value.toFixed(2)}`}
//                           {coupon.maxDiscount && coupon.discountType === 'percentage' && (
//                             <span className="text-xs text-gray-500 ml-1">(max ₹{coupon.maxDiscount})</span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : 'No minimum'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
//                           <span className="text-xs text-gray-500"> (max {coupon.perUserLimit}/user)</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                           {coupon.isActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button
//                           onClick={() => toggleStatus(coupon._id, coupon.isActive)}
//                           className={`mr-3 ${coupon.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
//                         >
//                           {coupon.isActive ? 'Deactivate' : 'Activate'}
//                         </button>
//                         <button className="text-blue-600 hover:text-blue-900">Edit</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
   
//   );
// }

// // This ensures the page is only accessible to admin users
// CouponsPage.auth = {
//   role: 'admin',
//   loading: <div>Loading...</div>,
//   unauthorized: '/admin/login',
// };


import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    value: 10,
    minOrderAmount: 0,
    maxDiscount: null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    perUserLimit: 1,
    isActive: true,
    applicableProducts: [],
    applicableCategories: []
  });

  // Fetch coupons (made idempotent)
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/coupons');
      if (!res.ok) {
        const body = await res.text().catch(() => ({}));
        throw new Error(`Failed to fetch coupons: ${res.status} ${body}`);
      }
      const data = await res.json();
      if (data.success) {
        setCoupons(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || 'Failed to load coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // call on mount
  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success('Coupon created successfully');
        setShowForm(false);
        fetchCoupons();
        // Reset form
        setFormData({
          code: '',
          description: '',
          discountType: 'percentage',
          value: 10,
          minOrderAmount: 0,
          maxDiscount: null,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          usageLimit: 100,
          perUserLimit: 1,
          isActive: true,
          applicableProducts: [],
          applicableCategories: []
        });
      } else {
        toast.error(data.message || 'Failed to create coupon');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error('Failed to create coupon');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success(`Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchCoupons();
      } else {
        toast.error(data.message || 'Failed to update coupon status');
      }
    } catch (error) {
      console.error('Error updating coupon status:', error);
      toast.error('Failed to update coupon status');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Create New Coupon'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Coupon</h2>
          <form onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                   <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.discountType === 'percentage' ? 'Discount Percentage *' : 'Discount Amount *'}
                  </label>
                  <div className="relative">
                    {formData.discountType === 'percentage' ? (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">%</span>
                      </div>
                    ) : (
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                    )}
                    <input
                      type="number"
                      name="value"
                      min="0"
                      step={formData.discountType === 'percentage' ? '0.01' : '1'}
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Discount (₹)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        name="maxDiscount"
                        min="0"
                        step="1"
                        value={formData.maxDiscount || ''}
                        onChange={handleInputChange}
                        className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount (₹) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      type="number"
                      name="minOrderAmount"
                      min="0"
                      step="1"
                      value={formData.minOrderAmount}
                      onChange={handleInputChange}
                      className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    min={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    min="1"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Unlimited if empty"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Uses Per Customer</label>
                  <input
                    type="number"
                    name="perUserLimit"
                    min="1"
                    value={formData.perUserLimit}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Coupon
                </button>
              </div>
            </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">All Coupons</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your store's promotional coupons</p>
        </div>
        
        {loading ? (
          <div className="px-4 py-5 sm:px-6 text-center">
            <p>Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="px-4 py-5 sm:px-6 text-center">
            <p className="text-gray-500">No coupons found. Create your first coupon!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min. Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{coupon.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.value}%` 
                          : `₹${(coupon.value ?? 0).toFixed(2)}`}
                        {coupon.maxDiscount && coupon.discountType === 'percentage' && (
                          <span className="text-xs text-gray-500 ml-1">(max ₹{coupon.maxDiscount})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : 'No minimum'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                        <span className="text-xs text-gray-500"> (max {coupon.perUserLimit}/user)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleStatus(coupon._id, coupon.isActive)}
                        className={`mr-3 ${coupon.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// admin auth wrapper
CouponsPage.auth = {
  role: 'admin',
  loading: <div>Loading...</div>,
  unauthorized: '/admin/login',
};
