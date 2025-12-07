// // pages/product/[slug]/reviews.js
// import Link from "next/link";
// import mongoose from "mongoose";
// import dbConnect from "@/middleware/mongoose";
// import Product from "@/models/Product";
// import Review from "@/models/Review";
// import { PiArrowLeftLight } from "react-icons/pi";

// const Star = ({ filled, size = 5 }) => (
//   <svg
//     className={`inline-block ${filled ? "text-yellow-400" : "text-gray-300"}`}
//     width={size}
//     height={size}
//     viewBox="0 0 20 20"
//     fill="currentColor"
//     aria-hidden
//   >
//     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.49 2.381c-.784.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.523 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
//   </svg>
// );

// export default function ReviewsPage({ product, reviews, averageRating }) {
//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold mb-2">Product not found</h2>
//           <Link href="/">
//             <span className="text-indigo-600 underline">Go home</span>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-4xl mx-auto px-4">
//         <Link href={`/product/${product.slug}`}>
//           <span className="inline-flex items-center text-gray-700 hover:text-indigo-600 mb-6">
//             <PiArrowLeftLight className="mr-2" />
//             Back to product
//           </span>
//         </Link>

//         <header className="bg-white p-6 rounded-lg shadow-sm mb-6">
//           <div className="flex items-center space-x-4">
//             <img
//               src={product.img}
//               alt={product.title}
//               className="w-24 h-24 object-cover rounded-md border"
//             />
//             <div>
//               <h1 className="text-2xl font-semibold">{product.title}</h1>
//               <div className="mt-2 flex items-center">
//                 <div className="mr-3">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Star key={i} filled={i < Math.round(averageRating)} />
//                   ))}
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   {averageRating ? averageRating.toFixed(1) : "0.0"} • {reviews.length} review{reviews.length !== 1 ? "s" : ""}
//                 </div>
//               </div>
//               <div className="text-sm text-gray-500 mt-1">Price: ₹{product.price}</div>
//             </div>
//           </div>
//         </header>

//         <main>
//           {reviews.length === 0 ? (
//             <div className="bg-white p-6 rounded shadow-sm text-center">
//               <p className="text-gray-700">No reviews yet — be the first to review this product.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {reviews.map((r) => (
//                 <article key={r._id} className="bg-white p-4 rounded shadow-sm">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <div className="font-semibold text-gray-800">{r.user?.name || "Anonymous"}</div>
//                       <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <div className="flex">
//                         {Array.from({ length: 5 }).map((_, i) => (
//                           <Star key={i} filled={i < (r.rating || 0)} size={14} />
//                         ))}
//                       </div>
//                       <div className="text-sm text-gray-600">{r.rating ? r.rating : "-"}/5</div>
//                     </div>
//                   </div>

//                   {r.comment && <p className="mt-3 text-gray-700">{r.comment}</p>}

//                   {r.images && r.images.length > 0 && (
//                     <div className="mt-3 flex space-x-3 overflow-x-auto">
//                       {r.images.map((imgUrl, idx) => (
//                         <Link
//                           key={idx}
//                           href={imgUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-block"
//                           title={`Open image ${idx + 1}`}
//                         >
//                           <img
//                             src={imgUrl}
//                             alt={`Review image ${idx + 1} by ${r.user?.name || "user"}`}
//                             className="w-28 h-28 object-cover rounded-md border"
//                           />
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </article>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// export async function getServerSideProps(context) {
//   const { slug } = context.params || {};
//   await dbConnect();

//   // fetch product by slug
//   const product = await Product.findOne({ slug }).lean();

//   if (!product) {
//     return { props: { product: null, reviews: [], averageRating: 0 } };
//   }

//   // load reviews for the product and populate the user (name, email)
//   const reviews = await Review.find({ product: product._id })
//     .populate("user", "name email")
//     .sort({ createdAt: -1 })
//     .lean();

//   const avg =
//     reviews.length > 0 ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length : 0;

//   // convert dates/objects to JSON-safe values
//   const safeReviews = reviews.map((r) => ({
//     ...r,
//     createdAt: r.createdAt ? r.createdAt.toISOString() : null,
//     updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
//   }));

//   return {
//     props: {
//       product: JSON.parse(JSON.stringify(product)),
//       reviews: JSON.parse(JSON.stringify(safeReviews)),
//       averageRating: Number(avg),
//     },
//   };
// }

// pages/product/[slug]/reviews.js
import Link from "next/link";
import mongoose from "mongoose";
import dbConnect from "@/middleware/mongoose";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { PiArrowLeftLight } from "react-icons/pi";
import { useEffect, useRef, useState, useCallback } from "react";

const Star = ({ filled, size = 5 }) => (
  <svg
    className={`inline-block ${filled ? "text-yellow-400" : "text-gray-300"}`}
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.49 2.381c-.784.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.523 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
  </svg>
);

export default function ReviewsPage({ product, initialReviews = [], initialAverageRating = 0, initialTotal = 0, initialPerPage = 6 }) {
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Product not found</h2>
          <Link href="/">
            <span className="text-indigo-600 underline">Go home</span>
          </Link>
        </div>
      </div>
    );
  }

  // client-side state for lazy loading
  const [reviews, setReviews] = useState(initialReviews);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialReviews.length < initialTotal);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialTotal);
  const perPage = initialPerPage;

  const observerRef = useRef();

  const fetchReviews = useCallback(
    async (nextPage) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/reviews?slug=${encodeURIComponent(product.slug)}&page=${nextPage}&limit=${perPage}`);
        if (!res.ok) throw new Error("Failed to load reviews");
        const data = await res.json();
        // append
        setReviews((prev) => [...prev, ...(data.reviews || [])]);
        setHasMore(Boolean(data.hasMore));
        setTotal(data.total || total);
      } catch (err) {
        console.error("fetchReviews error:", err);
      } finally {
        setLoading(false);
      }
    },
    [product.slug, perPage, total]
  );

  // IntersectionObserver to auto-load next page when sentinel is visible
  useEffect(() => {
    if (!hasMore) return;

    const node = observerRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading) {
            setPage((p) => p + 1);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [hasMore, loading]);

  // when page increments (and page > 1) fetch that page
  useEffect(() => {
    if (page === 1) return;
    fetchReviews(page);
  }, [page, fetchReviews]);

  // compute average rating display from initialAverageRating (server-provided)
  const averageRating = initialAverageRating;

  return (
    <div className="min-h-screen pt-32 bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href={`/product/${product.slug}`}>
          <span className="inline-flex items-center text-gray-700 hover:text-indigo-600 mb-6">
            <PiArrowLeftLight className="mr-2" />
            Back to product
          </span>
        </Link>

        <header className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={product.img}
              alt={product.title}
              className="w-24 h-24 object-cover rounded-md border"
            />
            <div>
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              <div className="mt-2 flex items-center">
                <div className="mr-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < Math.round(averageRating)} />
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  {averageRating ? averageRating.toFixed(1) : "0.0"} • {total} review{total !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">Price: ₹{product.price}</div>
            </div>
          </div>
        </header>

        <main>
          {reviews.length === 0 ? (
            <div className="bg-white p-6 rounded shadow-sm text-center">
              <p className="text-gray-700">No reviews yet — be the first to review this product.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <article key={r._id} className="bg-white p-4 rounded shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">{r.user?.name || "Anonymous"}</div>
                      <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} filled={i < (r.rating || 0)} size={14} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{r.rating ? r.rating : "-"}/5</div>
                    </div>
                  </div>

                  {r.comment && <p className="mt-3 text-gray-700">{r.comment}</p>}

                  {r.images && r.images.length > 0 && (
                    <div className="mt-3 flex space-x-3 overflow-x-auto">
                      {r.images.map((imgUrl, idx) => (
                        <Link
                          key={idx}
                          href={imgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                          title={`Open image ${idx + 1}`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Review image ${idx + 1} by ${r.user?.name || "user"}`}
                            className="w-28 h-28 object-cover rounded-md border"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              ))}

              {/* sentinel for intersection observer */}
              <div ref={observerRef} />

              {/* loading / load more controls */}
              <div className="text-center mt-4">
                {loading && <div className="text-sm text-gray-600">Loading more reviews...</div>}

                {!loading && hasMore && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Load more
                  </button>
                )}

                {!hasMore && <div className="text-sm text-gray-500">No more reviews.</div>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Server-side: only fetch product + first page of reviews to minimize initial payload.
 * Keeps original dbConnect and logic but limited to page=1 & small limit.
 */
export async function getServerSideProps(context) {
  const { slug } = context.params || {};
  await dbConnect();

  // fetch product by slug
  const product = await Product.findOne({ slug }).lean();

  if (!product) {
    return { props: { product: null, initialReviews: [], initialAverageRating: 0, initialTotal: 0 } };
  }

  const perPage = 6; // initial page size
  const reviews = await Review.find({ product: product._id })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(perPage)
    .lean();

  // use the correct product._id for count
  const total = await Review.countDocuments({ product: product._id });

  // Robustly get an ObjectId instance for aggregation:
  // if product._id is already an ObjectId, use it; if it's a string, wrap with new.
  let prodObjectId;
  try {
    // If it's already an ObjectId, this will just use it.
    // If it's a string, create a new ObjectId instance.
    prodObjectId =
      typeof product._id === "string"
        ? new mongoose.Types.ObjectId(product._id)
        : product._id;
  } catch (err) {
    // fallback: convert to string and create new ObjectId
    prodObjectId = new mongoose.Types.ObjectId(String(product._id));
  }

  // compute average using aggregation safely
  const agg = await Review.aggregate([
    { $match: { product: prodObjectId } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" } } },
  ]);

  const avg = agg[0]?.avgRating ? Number(agg[0].avgRating) : 0;

  const safeReviews = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt ? r.createdAt.toISOString() : null,
    updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
  }));

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      initialReviews: JSON.parse(JSON.stringify(safeReviews)),
      initialAverageRating: Number(avg),
      initialTotal: Number(total),
      initialPerPage: perPage,
    },
  };
}
