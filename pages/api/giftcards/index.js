import connectDb from "@/middleware/mongoose";
import GiftCard from "@/models/GiftCard";

export default async function handler(req, res) {
  await connectDb();

  const { method } = req;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ success: false, message: "UserId is required" });
  }

  if (method === "GET") {
    try {
      const giftcards = await GiftCard.find({ senderId: userId })
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        data: giftcards,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: `Method ${method} not allowed` });
}
