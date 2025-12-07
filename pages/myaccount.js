// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import {
//   MdAccountCircle,
//   MdLocationOn,
//   MdShoppingBag,
//   MdEdit,
//   MdDelete,
//   MdAdd,
//   MdLogout,
//   MdOrder,
//   MdHistory,
// } from "react-icons/md";

// const MyAccount = () => {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [user, setUser] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [editingAddress, setEditingAddress] = useState(null);
//   const [editingProfile, setEditingProfile] = useState(false);
//   const [profileForm, setProfileForm] = useState({ name: "", email: "" });
//   const [savingProfile, setSavingProfile] = useState(false);

//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       router.push("/login?redirect=/myaccount");
//       return;
//     }
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       // Fetch user profile
//       const userRes = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST}/api/user/profile`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (userRes.ok) {
//         const userData = await userRes.json();
//         console.log(userData);
//         setUser(userData);
//         if (userData && userData.user) {
//           setProfileForm({
//             name: userData.user.name || "",
//             email: userData.user.email || "",
//           });
//         }
//       }

//       // Fetch orders
//       const ordersRes = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST}/api/orders`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (ordersRes.ok) {
//         const ordersData = await ordersRes.json();
//         setOrders(ordersData.orders || []);
//       }

//       // Fetch addresses
//       const addressRes = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST}/api/address`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (addressRes.ok) {
//         const addressData = await addressRes.json();
//         setAddresses(addressData.addresses || []);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       toast.error("Failed to load user data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleProfileSave = async () => {
//     try {
//       setSavingProfile(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST}/api/user/profile`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             name: profileForm.name,
//             email: profileForm.email,
//           }),
//         }
//       );

//       if (res.ok) {
//         const updated = await res.json();
//         setUser(updated);
//         if (updated && updated.user) {
//           setProfileForm({
//             name: updated.user.name || "",
//             email: updated.user.email || "",
//           });
//         }
//         toast.success("Profile updated successfully");
//         setEditingProfile(false);
//       } else {
//         toast.error("Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Failed to update profile");
//     } finally {
//       setSavingProfile(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     toast.success("Logged out successfully");
//     router.push("/");
//   };

//   const handleDeleteAddress = async (addressId) => {
//     if (!confirm("Are you sure you want to delete this address?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_HOST}/api/address/${addressId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.ok) {
//         toast.success("Address deleted successfully");
//         setAddresses(addresses.filter((addr) => addr._id !== addressId));
//       } else {
//         toast.error("Failed to delete address");
//       }
//     } catch (error) {
//       console.error("Error deleting address:", error);
//       toast.error("Failed to delete address");
//     }
//   };

//   const handleAddressSubmit = async (formData) => {
//     try {
//       const token = localStorage.getItem("token");
//       const url = editingAddress
//         ? `${process.env.NEXT_PUBLIC_HOST}/api/address/${editingAddress._id}`
//         : `${process.env.NEXT_PUBLIC_HOST}/api/address`;

//       const method = editingAddress ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         toast.success(
//           editingAddress
//             ? "Address updated successfully"
//             : "Address added successfully"
//         );
//         setShowAddressForm(false);
//         setEditingAddress(null);
//         fetchUserData(); // Refresh addresses
//       } else {
//         toast.error("Failed to save address");
//       }
//     } catch (error) {
//       console.error("Error saving address:", error);
//       toast.error("Failed to save address");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white shadow rounded-lg">
//           {/* Header */}
//           <div className="border-b border-gray-200 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
//               >
//                 <MdLogout className="mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>

//           <div className="flex">
//             {/* Sidebar */}
//             <div className="w-64 bg-gray-50 p-6 border-r border-gray-200">
//               <nav className="space-y-2">
//                 <button
//                   onClick={() => setActiveTab("profile")}
//                   className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                     activeTab === "profile"
//                       ? "bg-blue-100 text-blue-700"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   <MdAccountCircle className="mr-3" />
//                   Profile Information
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("orders")}
//                   className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                     activeTab === "orders"
//                       ? "bg-blue-100 text-blue-700"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   <MdShoppingBag className="mr-3" />
//                   Order History
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("addresses")}
//                   className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//                     activeTab === "addresses"
//                       ? "bg-blue-100 text-blue-700"
//                       : "text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   <MdLocationOn className="mr-3" />
//                   Addresses
//                 </button>
//               </nav>
//             </div>

//             {/* Content */}
//             <div className="flex-1 p-6">
//               {/* Profile Tab */}
//               {activeTab === "profile" && user && (
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                     Profile Information
//                   </h2>
//                   <div className="flex items-center justify-between mb-4">
//                     <p className="text-sm text-gray-500">
//                       View and update your account details.
//                     </p>
//                     {!editingProfile ? (
//                       <button
//                         onClick={() => setEditingProfile(true)}
//                         className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
//                       >
//                         <MdEdit className="mr-1" />
//                         Edit
//                       </button>
//                     ) : (
//                       <div className="space-x-2">
//                         <button
//                           onClick={() => {
//                             if (user && user.user) {
//                               setProfileForm({
//                                 name: user.user.name || "",
//                                 email: user.user.email || "",
//                               });
//                             }
//                             setEditingProfile(false);
//                           }}
//                           className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={handleProfileSave}
//                           disabled={savingProfile}
//                           className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 transition-colors"
//                         >
//                           {savingProfile ? "Saving..." : "Save"}
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">
//                         Name
//                       </label>
//                       {editingProfile ? (
//                         <input
//                           type="text"
//                           name="name"
//                           value={profileForm.name}
//                           onChange={handleProfileChange}
//                           className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       ) : (
//                         <p className="mt-1 text-sm text-gray-900">{user.user.name}</p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">
//                         Email
//                       </label>
//                       {editingProfile ? (
//                         <input
//                           type="email"
//                           name="email"
//                           value={profileForm.email}
//                           onChange={handleProfileChange}
//                           className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       ) : (
//                         <p className="mt-1 text-sm text-gray-900">{user.user.email}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Orders Tab */}
//               {activeTab === "orders" && (
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-6">
//                     Order History
//                   </h2>
//                   {orders.length === 0 ? (
//                     <div className="text-center py-12">
//                       <MdShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
//                       <h3 className="mt-2 text-sm font-medium text-gray-900">
//                         No orders
//                       </h3>
//                       <p className="mt-1 text-sm text-gray-500">
//                         You haven't placed any orders yet.
//                       </p>
//                       <Link href="/bracelets">
//                         <span className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
//                           Start Shopping
//                         </span>
//                       </Link>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {orders.map((order) => (
//                         <div
//                           key={order._id}
//                           className="border border-gray-200 rounded-lg p-4"
//                         >
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <p className="text-sm font-medium text-gray-900">
//                                 Order #{order.orderNumber || order._id}
//                               </p>
//                               <p className="text-sm text-gray-500">
//                                 {new Date(order.createdAt).toLocaleDateString()}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-sm font-medium text-gray-900">
//                                 ₹{order.finalAmount}
//                               </p>
//                               <span
//                                 className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                                   order.status === "Completed"
//                                     ? "bg-green-100 text-green-800"
//                                     : order.status === "Processing"
//                                     ? "bg-yellow-100 text-yellow-800"
//                                     : order.status === "Cancelled"
//                                     ? "bg-red-100 text-red-800"
//                                     : "bg-gray-100 text-gray-800"
//                                 }`}
//                               >
//                                 {order.status}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="mt-4">
//                             <Link href={`/order?orderId=${order._id}`}>
//                               <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
//                                 View Details →
//                               </span>
//                             </Link>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Addresses Tab */}
//               {activeTab === "addresses" && (
//                 <div>
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl font-semibold text-gray-900">
//                       Saved Addresses
//                     </h2>
//                     <button
//                       onClick={() => {
//                         setEditingAddress(null);
//                         setShowAddressForm(true);
//                       }}
//                       className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
//                     >
//                       <MdAdd className="mr-2" />
//                       Add Address
//                     </button>
//                   </div>

//                   {showAddressForm && (
//                     <AddressForm
//                       initialData={editingAddress}
//                       onSubmit={handleAddressSubmit}
//                       onCancel={() => {
//                         setShowAddressForm(false);
//                         setEditingAddress(null);
//                       }}
//                     />
//                   )}

//                   {addresses.length === 0 && !showAddressForm ? (
//                     <div className="text-center py-12">
//                       <MdLocationOn className="mx-auto h-12 w-12 text-gray-400" />
//                       <h3 className="mt-2 text-sm font-medium text-gray-900">
//                         No saved addresses
//                       </h3>
//                       <p className="mt-1 text-sm text-gray-500">
//                         Add your first address for faster checkout.
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {addresses.map((address) => (
//                         <div
//                           key={address._id}
//                           className="border border-gray-200 rounded-lg p-4"
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <div className="flex items-center">
//                                 <h3 className="text-sm font-medium text-gray-900">
//                                   {address.label}
//                                 </h3>
//                                 {address.isDefault && (
//                                   <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//                                     Default
//                                   </span>
//                                 )}
//                               </div>
//                               <p className="mt-1 text-sm text-gray-600">
//                                 {address.fullName}
//                               </p>
//                               <p className="text-sm text-gray-600">
//                                 {address.phone}
//                               </p>
//                               <p className="text-sm text-gray-600">
//                                 {address.street}, {address.city},{" "}
//                                 {address.state} {address.postalCode}
//                               </p>
//                               {address.landmark && (
//                                 <p className="text-sm text-gray-600">
//                                   Landmark: {address.landmark}
//                                 </p>
//                               )}
//                             </div>
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => {
//                                   setEditingAddress(address);
//                                   setShowAddressForm(true);
//                                 }}
//                                 className="p-2 text-blue-600 hover:text-blue-800"
//                               >
//                                 <MdEdit className="h-4 w-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteAddress(address._id)}
//                                 className="p-2 text-red-600 hover:text-red-800"
//                               >
//                                 <MdDelete className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Address Form Component
// const AddressForm = ({ initialData, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     label: initialData?.label || "Home",
//     fullName: initialData?.fullName || "",
//     phone: initialData?.phone || "",
//     street: initialData?.street || "",
//     city: initialData?.city || "",
//     state: initialData?.state || "",
//     postalCode: initialData?.postalCode || "",
//     landmark: initialData?.landmark || "",
//     addressType: initialData?.addressType || "shipping",
//     isDefault: initialData?.isDefault || false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <div className="bg-gray-50 rounded-lg p-6 mb-6">
//       <h3 className="text-lg font-medium text-gray-900 mb-4">
//         {initialData ? "Edit Address" : "Add New Address"}
//       </h3>
//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Label
//           </label>
//           <select
//             name="label"
//             value={formData.label}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="Home">Home</option>
//             <option value="Work">Work</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Full Name
//           </label>
//           <input
//             type="text"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Phone
//           </label>
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Postal Code
//           </label>
//           <input
//             type="text"
//             name="postalCode"
//             value={formData.postalCode}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700">
//             Street Address
//           </label>
//           <input
//             type="text"
//             name="street"
//             value={formData.street}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             City
//           </label>
//           <input
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             State
//           </label>
//           <input
//             type="text"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Landmark (Optional)
//           </label>
//           <input
//             type="text"
//             name="landmark"
//             value={formData.landmark}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Address Type
//           </label>
//           <select
//             name="addressType"
//             value={formData.addressType}
//             onChange={handleChange}
//             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="shipping">Shipping</option>
//             <option value="billing">Billing</option>
//           </select>
//         </div>
//         <div className="md:col-span-2">
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               name="isDefault"
//               checked={formData.isDefault}
//               onChange={handleChange}
//               className="mr-2 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <span className="text-sm text-gray-700">
//               Set as default address
//             </span>
//           </label>
//         </div>
//         <div className="md:col-span-2 flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
//           >
//             {initialData ? "Update Address" : "Add Address"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MyAccount;


import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  MdAccountCircle,
  MdLocationOn,
  MdShoppingBag,
  MdEdit,
  MdDelete,
  MdAdd,
  MdLogout,
  MdOrder,
  MdHistory,
  MdMenu,
  MdClose,
} from "react-icons/md";

const MyAccount = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);


 const [pinStatus, setPinStatus] = useState({
  loading: false,
  valid: null,
  message: ""
});

const checkPincodeRealtime = async (postalCode) => {
  if (postalCode.length !== 6) {
    setPinStatus({ loading: false, valid: null, message: "" });
    return;
  }

  setPinStatus({ loading: true, valid: null, message: "Checking..." });

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
        message: "Delivery available!"
      });
    } else {
      setPinStatus({
        loading: false,
        valid: false,
        message: "Not serviceable at this location."
      });
    }
  } catch (error) {
    console.error("Pin check error:", error);
    setPinStatus({
      loading: false,
      valid: false,
      message: "Error checking pincode"
    });
  }
}

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login?redirect=/myaccount");
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch user profile
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userRes.ok) {
        const userData = await userRes.json();
        console.log(userData);
        setUser(userData);
        if (userData && userData.user) {
          setProfileForm({
            name: userData.user.name || "",
            email: userData.user.email || "",
          });
        }
      }

      // Fetch orders
      const ordersRes = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);
      }

      // Fetch addresses
      const addressRes = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/address`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (addressRes.ok) {
        const addressData = await addressRes.json();
        setAddresses(addressData.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    try {
      setSavingProfile(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profileForm.name,
            email: profileForm.email,
          }),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        if (updated && updated.user) {
          setProfileForm({
            name: updated.user.name || "",
            email: updated.user.email || "",
          });
        }
        toast.success("Profile updated successfully");
        setEditingProfile(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        toast.success("Address deleted successfully");
        setAddresses(addresses.filter((addr) => addr._id !== addressId));
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleAddressSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const url = editingAddress
        ? `${process.env.NEXT_PUBLIC_HOST}/api/address/${editingAddress._id}`
        : `${process.env.NEXT_PUBLIC_HOST}/api/address`;

      const method = editingAddress ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          editingAddress
            ? "Address updated successfully"
            : "Address added successfully"
        );
        setShowAddressForm(false);
        setEditingAddress(null);
        fetchUserData();
      } else {
        toast.error("Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" pb-10 pt-36  lg:py-8"style={{ background: 'radial-gradient(circle, #FFF2Ef,#DBC4BF)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2  hover:bg-blue-500 rounded-md transition-colors"
                >
                  {sidebarOpen ? (
                    <MdClose className="h-6 w-6" />
                  ) : (
                    <MdMenu className="h-6 w-6" />
                  )}
                </button>
                <h1 className="text-xl sm:text-2xl font-bold">
                  My Account
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-md"
              >
                <MdLogout className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className=" sm:inline">Logout</span>
                {/* <span className="">Exit</span> */}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Sidebar - Mobile Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50  lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div
              className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-0 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:transform-none ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0`}
            >
              <nav className="p-4 sm:p-6 space-y-2">
                <button
                  onClick={() => handleTabChange("profile")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    activeTab === "profile"
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MdAccountCircle className="mr-3 h-5 w-5" />
                  Profile Information
                </button>
                <button
                  onClick={() => handleTabChange("orders")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    activeTab === "orders"
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MdShoppingBag className="mr-3 h-5 w-5" />
                  Order History
                </button>
                <button
                  onClick={() => handleTabChange("addresses")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    activeTab === "addresses"
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <MdLocationOn className="mr-3 h-5 w-5" />
                  Addresses
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && user && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Profile Information
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <p className="text-sm text-gray-500">
                      View and update your account details.
                    </p>
                    {!editingProfile ? (
                      <button
                        onClick={() => setEditingProfile(true)}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <MdEdit className="mr-1" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (user && user.user) {
                              setProfileForm({
                                name: user.user.name || "",
                                email: user.user.email || "",
                              });
                            }
                            setEditingProfile(false);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProfileSave}
                          disabled={savingProfile}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                          {savingProfile ? "Saving..." : "Save"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      {editingProfile ? (
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                          {user.user.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      {editingProfile ? (
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                          {user.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                    Order History
                  </h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <MdShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No orders
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You haven't placed any orders yet.
                      </p>
                      <Link href="/bracelets">
                        <span className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors">
                          Start Shopping
                        </span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Order #{order.orderNumber || order._id.substring(0, 8)}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-2">
                              <p className="text-sm font-medium text-gray-900">
                                ₹{order.finalAmount}
                              </p>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === "Cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <Link href={`/order?orderId=${order._id}`}>
                              <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                                View Details →
                              </span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressForm(true);
                      }}
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors shadow-sm"
                    style={{ background: 'radial-gradient(circle, #FFF2Ef,#DBC4BF)' }}>
                      <MdAdd className="mr-2 h-5 w-5" />
                      Add Address
                    </button>
                  </div>

                 {showAddressForm && (
  <AddressForm
    initialData={editingAddress}
    onSubmit={handleAddressSubmit}
    onCancel={() => {
      setShowAddressForm(false);
      setEditingAddress(null);
    }}
    pinStatus={pinStatus}
    checkPincodeRealtime={checkPincodeRealtime}
  />
)}

                  {addresses.length === 0 && !showAddressForm ? (
                    <div className="text-center py-12">
                      <MdLocationOn className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No saved addresses
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add your first address for faster checkout.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-sm font-medium text-gray-900">
                                  {address.label}
                                </h3>
                                {address.isDefault && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {address.fullName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.phone}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {address.street}, {address.city},{" "}
                                {address.state} {address.postalCode}
                              </p>
                              {address.landmark && (
                                <p className="text-sm text-gray-600">
                                  Landmark: {address.landmark}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2 sm:ml-4">
                              <button
                                onClick={() => {
                                  setEditingAddress(address);
                                  setShowAddressForm(true);
                                }}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                              >
                                <MdEdit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address._id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <MdDelete className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Address Form Component
const AddressForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  pinStatus,
  checkPincodeRealtime 
}) => {
  const [formData, setFormData] = useState({
  label: initialData?.label || "Home",
  fullName: initialData?.fullName || "",
  phone: initialData?.phone || "",
  street: initialData?.street || "",
  city: initialData?.city || "",
  state: initialData?.state || "",
  postalCode: initialData?.postalCode || "",
  country: initialData?.country || "India",
  landmark: initialData?.landmark || "",
  addressType: initialData?.addressType || "shipping",
  isDefault: initialData?.isDefault || false,
});

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  if (name === "postalCode") {
    const numeric = value.replace(/\D/g, "").slice(0, 6);

    setFormData(prev => ({
      ...prev,
      postalCode: numeric
    }));

    if (numeric.length === 6) {
      checkPincodeRealtime(numeric);
    }

    return;
  }

  setFormData(prev => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-4 sm:p-6 mb-6 shadow-sm">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
        {initialData ? "Edit Address" : "Add New Address"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <select
            name="label"
            value={formData.label}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {pinStatus.loading && (
  <p className="text-xs mt-1 text-gray-500">Checking...</p>
)}

{pinStatus.valid === true && (
  <p className="text-xs mt-1 text-green-600">✓ {pinStatus.message}</p>
)}

{pinStatus.valid === false && (
  <p className="text-xs mt-1 text-red-600">✗ {pinStatus.message}</p>
)}

        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    State
  </label>
  <input
    type="text"
    name="state"
    value={formData.state}
    onChange={handleChange}
    required
    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Country
  </label>
  <input
    type="text"
    name="country"
    value={formData.country}
    onChange={handleChange}
    required
    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Landmark (Optional)
          </label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Type
          </label>
          <select
            name="addressType"
            value={formData.addressType}
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="shipping">Shipping</option>
            <option value="billing">Billing</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              Set as default address
            </span>
          </label>
        </div>
        <div className="sm:col-span-2 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {/* <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {initialData ? "Update Address" : "Add Address"}
          </button> */}
          <button
  type="submit"
  disabled={pinStatus.valid !== true}
  className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm 
    ${pinStatus.valid !== true ? "opacity-50 cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
>
  {initialData ? "Update Address" : "Add Address"}
</button>

        </div>
      </form>
    </div>
  );
};

export default MyAccount;