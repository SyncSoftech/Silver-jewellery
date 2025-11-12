// // pages/admin/products/index.js
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import AdminLayout from '../../../components/AdminLayout';
// import { FiEdit, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     category: '',
//     countInStock: '',
//     image: ''
//   });
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const token = localStorage.getItem('adminToken');
//         const response = await fetch('/api/admin/products', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         const data = await response.json();
//         setProducts(data);
//         setFilteredProducts(data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//   const term = (searchTerm || '').toLowerCase();
//   const filtered = products.filter(product => {
//     const name = (product.name || product.title || '').toString().toLowerCase();
//     const desc = (product.description || product.desc || '').toString().toLowerCase();
//     const cat = (product.category || '').toString().toLowerCase();
//     return name.includes(term) || desc.includes(term) || cat.includes(term);
//   });
//   setFilteredProducts(filtered);
// }, [searchTerm, products]);


//   const handleEdit = (product) => {
//     setCurrentProduct(product);
//     setFormData({
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       category: product.category,
//       countInStock: product.countInStock,
//       image: product.image
//     });
//     setShowAddModal(true);
//   };

//   const handleDelete = async (productId) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         const token = localStorage.getItem('adminToken');
//         await fetch(`/api/admin/products/${productId}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         setProducts(products.filter(p => p._id !== productId));
//       } catch (error) {
//         console.error('Error deleting product:', error);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('adminToken');
//       const url = currentProduct 
//         ? `/api/admin/products/${currentProduct._id}`
//         : '/api/admin/products';
      
//       const method = currentProduct ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();
      
//       if (response.ok) {
//         if (currentProduct) {
//           setProducts(products.map(p => p._id === currentProduct._id ? data : p));
//         } else {
//           setProducts([...products, data]);
//         }
//         setShowAddModal(false);
//         setFormData({
//           name: '',
//           description: '',
//           price: '',
//           category: '',
//           countInStock: '',
//           image: ''
//         });
//         setCurrentProduct(null);
//       }
//     } catch (error) {
//       console.error('Error saving product:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   if (loading) {
//     return <div>Loading products...</div>;
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Products</h1>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
//         >
//           <FiPlus className="mr-2" /> Add Product
//         </button>
//       </div>

//       <div className="mb-6">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FiSearch className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredProducts.map((product) => (
//               <tr key={product._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0 h-10 w-10">
//                       <img className="h-10 w-10 rounded-md" src={product.image} alt={product.name} />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                       <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{product.category}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">${product.price}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button
//                     onClick={() => handleEdit(product)}
//                     className="text-indigo-600 hover:text-indigo-900 mr-3"
//                   >
//                     <FiEdit className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product._id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     <FiTrash2 className="h-5 w-5" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Product Modal */}
//       {showAddModal && (
//         <div className="fixed z-10 inset-0 overflow-y-auto">
//           <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
//                   {currentProduct ? 'Edit Product' : 'Add New Product'}
//                 </h3>
//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                       Product Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
//                       Description
//                     </label>
//                     <textarea
//                       id="description"
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows="3"
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     ></textarea>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
//                         Price
//                       </label>
//                       <input
//                         type="number"
//                         id="price"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleInputChange}
//                         step="0.01"
//                         min="0"
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="countInStock">
//                         In Stock
//                       </label>
//                       <input
//                         type="number"
//                         id="countInStock"
//                         name="countInStock"
//                         value={formData.countInStock}
//                         onChange={handleInputChange}
//                         min="0"
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       id="category"
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
//                       Image URL
//                     </label>
//                     <input
//                       type="url"
//                       id="image"
//                       name="image"
//                       value={formData.image}
//                       onChange={handleInputChange}
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       required
//                     />
//                   </div>
//                   <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                     <button
//                       type="submit"
//                       className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
//                     >
//                       {currentProduct ? 'Update' : 'Add'} Product
//                     </button>
//                     <button
//                       type="button"
//                       className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                       onClick={() => {
//                         setShowAddModal(false);
//                         setCurrentProduct(null);
//                         setFormData({
//                           name: '',
//                           description: '',
//                           price: '',
//                           category: '',
//                           countInStock: '',
//                           image: ''
//                         });
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// pages/admin/products/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiUpload, FiX } from 'react-icons/fi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    desc: '',
    img: '',
    category: '',
    size: '',
    color: '',
    price: '',
    availableQty: ''
  });
  const router = useRouter();

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = 'dums728yt';
  const CLOUDINARY_API_KEY = '815922381785373';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const term = (searchTerm || '').toLowerCase();
    const filtered = products.filter(product => {
      const title = (product.title || product.name || '').toString().toLowerCase();
      const desc = (product.desc || product.description || '').toString().toLowerCase();
      const cat = (product.category || '').toString().toLowerCase();
      return title.includes(term) || desc.includes(term) || cat.includes(term);
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle image upload to Cloudinary using API key and signature
  // --- inside pages/admin/products/index.js ---

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ✅ Validate file type
  if (!file.type.startsWith("image/")) {
    setUploadError("Please upload a valid image file");
    return;
  }

  // ✅ Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setUploadError("Image size should be less than 5MB");
    return;
  }

  setUploading(true);
  setUploadError("");

  try {
    // ✅ Create FormData object and append file (field name = 'image')
    const formData = new FormData();
    formData.append("image", file);

    // ✅ Include your admin token if you use authentication
    const token = localStorage.getItem("adminToken");

    // ✅ POST to your Next.js API route (server handles Cloudinary upload)
    const res = await fetch("/api/upload/cloudinary", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData, // ⚠️ DO NOT manually set Content-Type
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to upload image");
    }

    // ✅ On success: update formData with Cloudinary URL
    if (data.secure_url || data.url) {
      setFormData((prev) => ({
        ...prev,
        img: data.secure_url || data.url,
      }));
      setUploadError("");
    } else {
      throw new Error("No URL returned from server");
    }
  } catch (err) {
    console.error("Error uploading image:", err);
    setUploadError(err.message || "Failed to upload image");
  } finally {
    setUploading(false);
  }
};


  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      title: product.title || product.name || '',
      slug: product.slug || '',
      desc: product.desc || product.description || '',
      img: product.img || product.image || '',
      category: product.category || '',
      size: product.size || '',
      color: product.color || '',
      price: product.price || '',
      availableQty: product.availableQty || product.countInStock || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  // basic client side validation
  if (!formData.title.trim()) { alert('Please enter product title'); return; }
  if (!formData.desc.trim()) { alert('Please enter product description'); return; }
  if (!formData.img.trim()) { alert('Please upload or paste an image URL'); return; }
  // ... price/qty checks
  try {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/products', {
      method: currentProduct ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        img: formData.img.trim(),
        category: formData.category.trim(),
        size: formData.size.trim(),
        color: formData.color.trim(),
        price: Number(formData.price),
        availableQty: parseInt(formData.availableQty, 10)
      })
    });

    const data = await res.json();
    if (!res.ok) {
      // If server returned validation errors object, show it
      if (data.errors) {
        const firstErr = Object.values(data.errors)[0];
        alert(firstErr || 'Validation error');
      } else {
        alert(data.message || 'Failed to save product');
      }
      return;
    }
alert('Product saved successfully!');
    // success handling...
  } catch (err) {
    console.error('Error saving product:', err);
    alert('Failed to save product. See console for details.');
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug when title changes (only for new products)
    if (name === 'title' && !currentProduct) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      desc: '',
      img: '',
      category: '',
      size: '',
      color: '',
      price: '',
      availableQty: ''
    });
    setCurrentProduct(null);
    setUploadError('');
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
        >
          <FiPlus className="mr-2" /> Add Product
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={product.img || product.image || '/placeholder.png'} 
                          alt={product.title || product.name}
                          onError={(e) => { e.target.src = '/placeholder.png'; }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title || product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.desc || product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                    {product.size && <div className="text-xs text-gray-500">Size: {product.size}</div>}
                    {product.color && <div className="text-xs text-gray-500">Color: {product.color}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (product.availableQty || product.countInStock || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {(product.availableQty || product.countInStock || 0) > 0 ? `${product.availableQty || product.countInStock}` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="Edit"
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  {/* Product Image Upload */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Product Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-start space-x-4">
                      {formData.img && (
                        <div className="relative">
                          <img 
                            src={formData.img} 
                            alt="Preview" 
                            className="h-24 w-24 object-cover rounded-md border"
                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, img: '' }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 bg-gray-50">
                          <FiUpload className="mr-2" />
                          <span className="text-sm text-gray-600">
                            {uploading ? 'Uploading...' : 'Click to Upload Image'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        {uploadError && (
                          <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Supported: JPG, PNG, GIF (Max 5MB)
                        </p>
                      </div>
                    </div>
                    {/* Manual URL input */}
                    <div className="mt-2">
                      <input
                        type="url"
                        name="img"
                        value={formData.img}
                        onChange={handleInputChange}
                        placeholder="Or paste image URL here"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter product title"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">
                      Slug (URL-friendly name)
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="auto-generated-from-title"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from title</p>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="desc"
                      name="desc"
                      value={formData.desc}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter product description"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    ></textarea>
                  </div>

                  {/* Category, Size, Color */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g. Electronics"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="size">
                        Size
                      </label>
                      <input
                        type="text"
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        placeholder="S, M, L, XL"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
                        Color
                      </label>
                      <input
                        type="text"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="Red, Blue, etc."
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availableQty">
                        Available Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="availableQty"
                        name="availableQty"
                        value={formData.availableQty}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse -mx-4 -mb-4 mt-6">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'Uploading...' : (currentProduct ? 'Update Product' : 'Add Product')}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}