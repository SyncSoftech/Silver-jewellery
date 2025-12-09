import connectDb from "../../../middleware/mongoose";
import Coupon from "@/models/Coupon";
import GiftCard from "@/models/GiftCard";
import sendEmail from "@/utils/sendEmail";

export default async function handler(req, res) {
  await connectDb(); // ⭐ REQUIRED ⭐

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { senderId, receiverName, receiverEmail, purpose, amount, paymentId } = req.body;

    if (!senderId || !receiverName || !receiverEmail || !purpose || !amount || !paymentId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 1️⃣ Generate coupon code
    const prefix = receiverName.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const couponCode = `GIFT-${prefix}-${year}-${Math.floor(Math.random() * 9999)}`;

    // 2️⃣ Create coupon
    const coupon = await Coupon.create({
      code: couponCode,
      description: `Gift card for ${receiverName}`,
      discountType: "fixed",
      value: amount,
      minOrderAmount: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
      applyToAll: true,
      usageLimit: 1,
      maxDiscount: amount,
      perUserLimit: 1,
    });

    // 3️⃣ Create GiftCard
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const giftcard = await GiftCard.create({
      senderId,
      receiverName,
      receiverEmail,
      purpose,
      amount,
      couponCode: coupon.code,
      couponId: coupon._id,
      paymentId,
      expiryDate,
    });

    // 4️⃣ Send email
    await sendEmail(
      receiverEmail,
      "🎁 You received a Gift Card!",
      `
      <h2>Hello ${receiverName},</h2>
      <p>You received a gift card!</p>
      <p><b>Amount:</b> ₹${amount}</p>
      <p><b>Purpose:</b> ${purpose}</p>

      <h3>Your Coupon Code:</h3>
      <h1 style="color: #e11d48;">${couponCode}</h1>

      <p>Valid for 1 year.</p>
      `
    );

    return res.status(200).json({ success: true, data: giftcard });

  } catch (err) {
    console.error("GiftCard creation error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
