// // pages/api/review/addreview.js
// import dbConnect from "@/middleware/mongoose";
// import Review from "@/models/Review";
// import Product from "@/models/Product";

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === "POST") {
//     try {
//       const { productId, userId, rating, comment, images } = req.body;

//       if (!productId || !userId || !rating) {
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//       }

//       // Create the review
//       const newReview = await Review.create({
//         product: productId,
//         user: userId,
//         rating,
//         comment,
//         images, // array of image URLs
//       });

//       // Optional: Update product's average rating
//       const reviews = await Review.find({ product: productId });
//       const avgRating =
//         reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

//       await Product.findByIdAndUpdate(productId, { averageRating: avgRating });

//       res.status(201).json({
//         success: true,
//         message: "Review added successfully",
//         review: newReview,
//       });
//     } catch (error) {
//       console.error("Error adding review:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   } else {
//     res.status(405).json({ success: false, message: "Method not allowed" });
//   }
// }


// pages/api/review/addreview.js
import dbConnect from "@/middleware/mongoose";
import Review from "@/models/Review";
import Product from "@/models/Product";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { productId, userId, rating, comment, images = [] } = req.body;

    if (!productId || !userId || typeof rating === "undefined") {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Optional: you can validate that user and product exist
    const product = await Product.findById(productId).select("_id");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const user = await User.findById(userId).select("_id");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Create the review
    const newReview = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
      images,
    });

    // Recalculate average rating using aggregation (more accurate & efficient)
    const agg = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const avgRating = agg[0]?.avgRating ?? 0;
    const reviewCount = agg[0]?.count ?? 0;

    // Store averageRating / reviewCount on product if you track them
    await Product.findByIdAndUpdate(productId, { averageRating: avgRating, reviewCount }, { new: true });

    // Populate the created review's user info before returning
    const populated = await Review.findById(newReview._id).populate("user", "name email").lean();

    const safeReview = {
      ...populated,
      createdAt: populated.createdAt ? populated.createdAt.toISOString() : null,
      updatedAt: populated.updatedAt ? populated.updatedAt.toISOString() : null,
    };

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: safeReview,
      averageRating: avgRating,
      reviewCount,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
