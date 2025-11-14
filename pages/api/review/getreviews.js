// // pages/api/reviews/getreviews.js
// import dbConnect from "@/middleware/mongoose";
// import Review from "@/models/Review";
// import User from "@/models/User"; // <--- add this


// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === "GET") {
//     try {
//       const { productId } = req.query;

//       if (!productId) {
//         return res.status(400).json({ success: false, message: "Product ID is required" });
//       }

//       const reviews = await Review.find({ product: productId })
//         .populate("user", "name email")
//         .sort({ createdAt: -1 });

//       return res.status(200).json({
//         success: true,
//         count: reviews.length,
//         reviews,
//       });
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//       return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   } else {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).json({ success: false, message: "Method not allowed" });
//   }
// }

import dbConnect from "@/middleware/mongoose";
import Review from "@/models/Review";
import Product from "@/models/Product";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // normalize query params
    let { productId, page = 1, limit = 6 } = req.query;
    if (Array.isArray(productId)) productId = productId[0];

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    // validate productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    const perPage = Math.max(1, parseInt(limit, 10) || 6);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);

    // Ensure product exists
    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const total = await Review.countDocuments({ product: productId });

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .lean();

    const safeReviews = reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt ? r.createdAt.toISOString() : null,
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
    }));

    return res.status(200).json({
      success: true,
      reviews: safeReviews,
      page: pageNum,
      perPage,
      total,
      hasMore: pageNum * perPage < total,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
