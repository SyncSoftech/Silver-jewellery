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
    images: [],
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/orders/${id}/track`);
        if (res.ok) {
          const data = await res.json();
          setTimeline(data);

          // Check if the latest status is Delivered
          const lastEvent = data[data.length - 1];
          if (lastEvent && lastEvent.status?.toLowerCase() === 'delivered') {
            setShowReviewModal(true);
          }
        } else {
          console.error('Failed to fetch');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setReviewData({ ...reviewData, images: urls });
  };

  const handleSubmitReview = async () => {
    const userId = localStorage.getItem('token');
    const decodedToken = jwt.decode(userId);
    console.log(timeline[0]?.productId);
    try {
      const body = {
        productId: timeline[0]?.productId, // depends on your order structure
        userId: decodedToken.user, // replace with logged-in user ID
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images,
      };

      const res = await fetch('/api/review/addreview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        alert('Review added successfully!');
        setShowReviewModal(false);
        setReviewData({ rating: 5, comment: '', images: [] });
      } else {
        alert('Failed to add review');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting review');
    }
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
              onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
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
            />
            <div className="flex gap-2 mb-4 flex-wrap">
              {reviewData.images.map((img, i) => (
                <img key={i} src={img} alt="preview" className="w-16 h-16 object-cover rounded" />
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
