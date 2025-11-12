// // pages/orders/[id]/tracking.js
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { format } from 'date-fns';
// import Link from 'next/link';

// export default function OrderTrackingPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [timeline, setTimeline] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     (async () => {
//       try {
//         const res = await fetch(`/api/orders/${id}/track`);
//         if (res.ok) {
//           const data = await res.json();
//           setTimeline(data);
//         } else {
//           console.error('Failed to fetch');
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <div className="mb-4">
//         <Link href="/" className="text-indigo-600">Home</Link>
//       </div>
//       <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
//       {loading ? <div>Loading...</div> : (
//         <>
//           <p className="mb-4">Timeline for order <strong>#{id}</strong></p>
//           {timeline.length === 0 ? <p>No tracking events yet.</p> : (
//             <ul className="space-y-4">
//               {timeline.map(evt => (
//                 <li key={evt._id ?? evt.createdAt} className="border rounded p-4">
//                   <div className="flex justify-between">
//                     <div>
//                       <div className="font-medium">{(evt.status || '').charAt(0).toUpperCase() + evt.status.slice(1)}</div>
//                       {evt.note && <div className="text-gray-600">{evt.note}</div>}
//                       {evt.carrier && <div className="text-sm text-gray-600">Carrier: {evt.carrier} — {evt.trackingNumber}</div>}
//                       {evt.trackingUrl && <div className="text-sm"><a target="_blank" rel="noreferrer" href={evt.trackingUrl} className="text-indigo-600">Track shipment</a></div>}
//                     </div>
//                     <div className="text-sm text-gray-500">{format(new Date(evt.createdAt), 'PPP p')}</div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { format } from 'date-fns';
// import Link from 'next/link';
// import jwt from 'jsonwebtoken';
// export default function OrderTrackingPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [timeline, setTimeline] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [reviewData, setReviewData] = useState({
//     rating: 5,
//     comment: '',
//     images: [],
//   });

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     (async () => {
//       try {
//         const res = await fetch(`/api/orders/${id}/track`);
//         if (res.ok) {
//           const data = await res.json();
//           setTimeline(data);

//           // Check if the latest status is Delivered
//           const lastEvent = data[data.length - 1];
//           if (lastEvent && lastEvent.status?.toLowerCase() === 'delivered') {
//             setShowReviewModal(true);
//           }
//         } else {
//           console.error('Failed to fetch');
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const urls = files.map(file => URL.createObjectURL(file));
//     setReviewData({ ...reviewData, images: urls });
//   };

//   const handleSubmitReview = async () => {
//     const userId = localStorage.getItem('token');
//     const decodedToken = jwt.decode(userId);
//     console.log(timeline[0]?.productId);
//     try {
//       const body = {
//         productId: timeline[0]?.productId, // depends on your order structure
//         userId: decodedToken.user, // replace with logged-in user ID
//         rating: reviewData.rating,
//         comment: reviewData.comment,
//         images: reviewData.images,
//       };

//       const res = await fetch('/api/review/addreview', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert('Review added successfully!');
//         setShowReviewModal(false);
//         setReviewData({ rating: 5, comment: '', images: [] });
//       } else {
//         alert('Failed to add review');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Error submitting review');
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <div className="mb-4">
//         <Link href="/" className="text-indigo-600">Home</Link>
//       </div>
//       <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           <p className="mb-4">Timeline for order <strong>#{id}</strong></p>
//           {timeline.length === 0 ? (
//             <p>No tracking events yet.</p>
//           ) : (
//             <ul className="space-y-4">
//               {timeline.map((evt, i) => (
//                 <li key={evt._id ?? evt.createdAt ?? i} className="border rounded p-4">
//                   <div className="flex justify-between">
//                     <div>
//                       <div className="font-medium">
//                         {(evt.status || '').charAt(0).toUpperCase() + evt.status.slice(1)}
//                       </div>
//                       {evt.note && <div className="text-gray-600">{evt.note}</div>}
//                       {evt.carrier && (
//                         <div className="text-sm text-gray-600">
//                           Carrier: {evt.carrier} — {evt.trackingNumber}
//                         </div>
//                       )}
//                       {evt.trackingUrl && (
//                         <div className="text-sm">
//                           <a
//                             target="_blank"
//                             rel="noreferrer"
//                             href={evt.trackingUrl}
//                             className="text-indigo-600"
//                           >
//                             Track shipment
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {format(new Date(evt.createdAt), 'PPP p')}
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}

//       {/* --- Add Review Popup --- */}
//       {showReviewModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-lg font-semibold mb-4">Add Review</h2>

//             <label className="block mb-2 font-medium">Rating:</label>
//             <select
//               value={reviewData.rating}
//               onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
//               className="border rounded w-full mb-4 p-2"
//             >
//               {[5, 4, 3, 2, 1].map((r) => (
//                 <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
//               ))}
//             </select>

//             <label className="block mb-2 font-medium">Comment:</label>
//             <textarea
//               value={reviewData.comment}
//               onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
//               className="border rounded w-full p-2 mb-4"
//               placeholder="Write your review..."
//               rows="3"
//             />

//             <label className="block mb-2 font-medium">Upload Images:</label>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleImageChange}
//               className="mb-4"
//             />
//             <div className="flex gap-2 mb-4 flex-wrap">
//               {reviewData.images.map((img, i) => (
//                 <img key={i} src={img} alt="preview" className="w-16 h-16 object-cover rounded" />
//               ))}
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowReviewModal(false)}
//                 className="px-4 py-2 border rounded text-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitReview}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { format } from 'date-fns';
// import Link from 'next/link';
// import jwt from 'jsonwebtoken';

// export default function OrderTrackingPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [timeline, setTimeline] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [reviewData, setReviewData] = useState({
//     rating: 5,
//     comment: '',
//     images: [],
//   });

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     (async () => {
//       try {
//         const res = await fetch(`/api/orders/${id}/track`);
//         if (res.ok) {
//           const data = await res.json();
//           setTimeline(data);

//           // Check if the latest status is Delivered
//           const lastEvent = data[data.length - 1];
//           if (lastEvent && lastEvent.status?.toLowerCase() === 'delivered') {
//             // Check if user has already submitted review for this order
//             const reviewSubmitted = localStorage.getItem(`review_submitted_${id}`);
//             if (!reviewSubmitted) {
//               setShowReviewModal(true);
//             }
//           }
//         } else {
//           console.error('Failed to fetch');
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const urls = files.map(file => URL.createObjectURL(file));
//     setReviewData({ ...reviewData, images: urls });
//   };

//   const handleSubmitReview = async () => {
//     const userId = localStorage.getItem('token');
//     const decodedToken = jwt.decode(userId);
//     console.log(timeline[0]?.productId);
//     try {
//       const body = {
//         productId: timeline[0]?.productId,
//         userId: decodedToken.user,
//         rating: reviewData.rating,
//         comment: reviewData.comment,
//         images: reviewData.images,
//       };

//       const res = await fetch('/api/review/addreview', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (data.success) {
//         // Mark this order as reviewed
//         localStorage.setItem(`review_submitted_${id}`, 'true');
        
//         alert('Review added successfully!');
//         setShowReviewModal(false);
//         setReviewData({ rating: 5, comment: '', images: [] });
//       } else {
//         alert('Failed to add review');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Error submitting review');
//     }
//   };

//   const handleCancelReview = () => {
//     // Also mark as "declined" so modal doesn't show again
//     localStorage.setItem(`review_submitted_${id}`, 'declined');
//     setShowReviewModal(false);
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <div className="mb-4">
//         <Link href="/" className="text-indigo-600">Home</Link>
//       </div>
//       <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           <p className="mb-4">Timeline for order <strong>#{id}</strong></p>
//           {timeline.length === 0 ? (
//             <p>No tracking events yet.</p>
//           ) : (
//             <ul className="space-y-4">
//               {timeline.map((evt, i) => (
//                 <li key={evt._id ?? evt.createdAt ?? i} className="border rounded p-4">
//                   <div className="flex justify-between">
//                     <div>
//                       <div className="font-medium">
//                         {(evt.status || '').charAt(0).toUpperCase() + evt.status.slice(1)}
//                       </div>
//                       {evt.note && <div className="text-gray-600">{evt.note}</div>}
//                       {evt.carrier && (
//                         <div className="text-sm text-gray-600">
//                           Carrier: {evt.carrier} — {evt.trackingNumber}
//                         </div>
//                       )}
//                       {evt.trackingUrl && (
//                         <div className="text-sm">
//                           <a
//                             target="_blank"
//                             rel="noreferrer"
//                             href={evt.trackingUrl}
//                             className="text-indigo-600"
//                           >
//                             Track shipment
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {format(new Date(evt.createdAt), 'PPP p')}
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}

//       {/* --- Add Review Popup --- */}
//       {showReviewModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-lg font-semibold mb-4">Add Review</h2>

//             <label className="block mb-2 font-medium">Rating:</label>
//             <select
//               value={reviewData.rating}
//               onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
//               className="border rounded w-full mb-4 p-2"
//             >
//               {[5, 4, 3, 2, 1].map((r) => (
//                 <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
//               ))}
//             </select>

//             <label className="block mb-2 font-medium">Comment:</label>
//             <textarea
//               value={reviewData.comment}
//               onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
//               className="border rounded w-full p-2 mb-4"
//               placeholder="Write your review..."
//               rows="3"
//             />

//             <label className="block mb-2 font-medium">Upload Images:</label>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleImageChange}
//               className="mb-4"
//             />
//             <div className="flex gap-2 mb-4 flex-wrap">
//               {reviewData.images.map((img, i) => (
//                 <img key={i} src={img} alt="preview" className="w-16 h-16 object-cover rounded" />
//               ))}
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={handleCancelReview}
//                 className="px-4 py-2 border rounded text-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitReview}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import Link from 'next/link';
import jwt from 'jsonwebtoken';

export default function OrderTrackingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    images: [], // will store uploaded image URLs
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [order, setOrder] = useState(null);

useEffect(() => {
  if (!id) return;
  setLoading(true);
  
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fetch tracking events and order details in parallel
      const [trackingRes, orderRes] = await Promise.all([
        fetch(`/api/orders/${id}/track`, { headers }),
        fetch(`/api/orders/${id}`, { headers }) // Include token in headers
      ]);

      if (trackingRes.ok) {
        const trackingData = await trackingRes.json();
        setTimeline(trackingData);

        // Check if the latest status is Delivered
        const lastEvent = trackingData[trackingData.length - 1];
        if (lastEvent?.status?.toLowerCase() === 'delivered') {
          const reviewSubmitted = localStorage.getItem(`review_submitted_${id}`);
          if (!reviewSubmitted) {
            setShowReviewModal(true);
          }
        }
      }

      // In the fetchData function, update the order data handling:
if (orderRes.ok) {
  const orderData = await orderRes.json();
  console.log('Full order data:', orderData);
  
  // Check if we have data in the order property or if it's the root object
  const order = orderData.order || orderData;
  console.log('Processed order:', order);
  console.log('Order items:', order.orderItems);
  
  if (order && order.orderItems) {
    setOrder(order);
  } else {
    console.error('Invalid order data structure:', order);
  }
} else {
  console.error('Failed to fetch order:', orderRes.status, orderRes.statusText);
}
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

  // Upload multiple files to /api/upload/cloudinary and return uploaded URLs
  const uploadFilesToCloudinary = async (files) => {
    setUploadError('');
    setUploadingImages(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken') || null;

      // Upload all files in parallel
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append('image', file);

        return fetch('/api/upload/cloudinary', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
              const msg = data?.error || data?.message || 'Upload failed';
              throw new Error(msg);
            }
            // support different response shapes
            return data?.secure_url || data?.url || (data.result && data.result.secure_url) || data?.raw?.secure_url;
          });
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (err) {
      console.error('Image upload error:', err);
      setUploadError(err.message || 'Failed to upload images');
      return null;
    } finally {
      setUploadingImages(false);
    }
  };

  // When user selects images: upload them and store returned URLs
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Optional: quick client-side validations
    const invalid = files.find((f) => !f.type.startsWith('image/'));
    if (invalid) {
      setUploadError('One or more files are not images. Please select images only.');
      return;
    }
    const tooLarge = files.find((f) => f.size > 5 * 1024 * 1024);
    if (tooLarge) {
      setUploadError('One or more images exceed 5MB. Please choose smaller files.');
      return;
    }

    // Upload to Cloudinary
    const urls = await uploadFilesToCloudinary(files);
    if (urls && Array.isArray(urls)) {
      setReviewData((prev) => ({ ...prev, images: urls }));
      setUploadError('');
    }
  };

const handleSubmitReview = async () => {
 console.log('Current order state:', order); // Add this line
  
  if (uploadingImages) {
    alert('Please wait for image uploads to finish before submitting your review.');
    return;
  }

  if (!reviewData.comment?.trim()) {
    if (!confirm('Submit review without a comment?')) return;
  }

  try {
    const rawToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
    let userId = null;
    if (rawToken) {
      const decoded = jwt.decode(rawToken);
      userId = decoded?.user || decoded?.id || decoded?.sub || null;
    }

    // Debug the order structure
    console.log('Order in handleSubmitReview:', order);
    console.log('Order items in handleSubmitReview:', order?.orderItems);
    
    // Get the first product ID from the order items
    const productId = order?.orderItems?.[0]?.product;
    
    if (!productId) {
      console.error('Product ID not found. Order structure:', {
        hasOrder: !!order,
        orderKeys: order ? Object.keys(order) : [],
        hasOrderItems: order?.orderItems ? true : false,
        orderItemsType: typeof order?.orderItems,
        firstItem: order?.orderItems?.[0]
      });
      throw new Error('Could not find product information for this order. Please contact support.');
    }

    const body = {
      productId,  // This is the product ID as a string
      userId,
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
      images: reviewData.images,
    };

    console.log('Submitting review with data:', body);

    const res = await fetch('/api/review/addreview', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(rawToken && { 'Authorization': `Bearer ${rawToken}` }) // Include auth token
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem(`review_submitted_${id}`, 'true');
      alert('Review added successfully!');
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '', images: [] });
    } else {
      throw new Error(data?.message || 'Failed to add review');
    }
  } catch (err) {
    console.error('Review submission error:', err);
    alert(err.message || 'Error submitting review');
  }
};
  const handleCancelReview = () => {
    // Also mark as "declined" so modal doesn't show again
    localStorage.setItem(`review_submitted_${id}`, 'declined');
    setShowReviewModal(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/" className="text-indigo-600">Home</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <p className="mb-4">Timeline for order <strong>#{id}</strong></p>
          {timeline.length === 0 ? (
            <p>No tracking events yet.</p>
          ) : (
            <ul className="space-y-4">
              {timeline.map((evt, i) => (
                <li key={evt._id ?? evt.createdAt ?? i} className="border rounded p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">
                        {(evt.status || '').charAt(0).toUpperCase() + evt.status.slice(1)}
                      </div>
                      {evt.note && <div className="text-gray-600">{evt.note}</div>}
                      {evt.carrier && (
                        <div className="text-sm text-gray-600">
                          Carrier: {evt.carrier} — {evt.trackingNumber}
                        </div>
                      )}
                      {evt.trackingUrl && (
                        <div className="text-sm">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={evt.trackingUrl}
                            className="text-indigo-600"
                          >
                            Track shipment
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(evt.createdAt), 'PPP p')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* --- Add Review Popup --- */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Review</h2>

            <label className="block mb-2 font-medium">Rating:</label>
            <select
              value={reviewData.rating}
              onChange={(e) => setReviewData({ ...reviewData, rating: Number(e.target.value) })}
              className="border rounded w-full mb-4 p-2"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
              ))}
            </select>

            <label className="block mb-2 font-medium">Comment:</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              className="border rounded w-full p-2 mb-4"
              placeholder="Write your review..."
              rows="3"
            />

            <label className="block mb-2 font-medium">Upload Images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4"
              disabled={uploadingImages}
            />
            {uploadError && (
              <div className="text-sm text-red-600 mb-2">{uploadError}</div>
            )}

            <div className="flex gap-2 mb-4 flex-wrap">
              {reviewData.images.map((img, i) => (
                <img key={i} src={img} alt={`preview-${i}`} className="w-16 h-16 object-cover rounded" />
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelReview}
                className="px-4 py-2 border rounded text-gray-600"
                disabled={uploadingImages}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                disabled={uploadingImages}
              >
                {uploadingImages ? 'Uploading images...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
