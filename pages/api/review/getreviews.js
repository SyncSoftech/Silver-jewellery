import dbConnect from "@/middleware/mongoose";
import Review from "@/models/Review";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { productId } = req.query;

      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
      }

      const reviews = await Review.find({ product: productId })
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
