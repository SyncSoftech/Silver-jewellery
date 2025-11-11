import dbConnect from "@/middleware/mongoose";
import Review from "@/models/Review";
import Product from "@/models/Product";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { productId, userId, rating, comment, images } = req.body;

      if (!productId || !userId || !rating) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      // Create the review
      const newReview = await Review.create({
        product: productId,
        user: userId,
        rating,
        comment,
        images, // array of image URLs
      });

      // Optional: Update product's average rating
      const reviews = await Review.find({ product: productId });
      const avgRating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);

      await Product.findByIdAndUpdate(productId, { averageRating: avgRating });

      res.status(201).json({
        success: true,
        message: "Review added successfully",
        review: newReview,
      });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
