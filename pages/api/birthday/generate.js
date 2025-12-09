// pages/api/birthday/generate.js
import connectDb from "@/middleware/mongoose";
import Birthday from "@/models/Birthday";
import Coupon from "@/models/Coupon";
import User from "@/models/User";
import sendEmail from "@/utils/sendEmail"; // ⭐ Using your existing email sender

export default async function handler(req, res) {
  await connectDb();

  const today = new Date();
  const currentYear = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  try {
    // 1️⃣ Find users whose birthday is today + not issued this year
    const birthdayUsers = await Birthday.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$birthday" }, month] },
          { $eq: [{ $dayOfMonth: "$birthday" }, day] }
        ]
      },
      $or: [
        { lastIssuedYear: null },
        { lastIssuedYear: { $lt: currentYear } }
      ]
    }).lean();

    if (!birthdayUsers.length) {
      return res.status(200).json({
        success: true,
        message: "No birthdays today"
      });
    }

    const results = [];

    for (const entry of birthdayUsers) {
      const user = await User.findById(entry.userId).lean();
      if (!user) continue;

      // 2️⃣ Generate a unique coupon code
      const couponCode = `BDAY-${user.name.substring(0, 3).toUpperCase()}-${currentYear}`;

      // 3️⃣ Create coupon
      const coupon = await Coupon.create({
        code: couponCode,
        description: `Birthday Special Discount for ${user.name}`,
        discountType: "percentage",
        value: 20, // 🎁 20% Birthday Discount
        maxDiscount: 500,
        minOrderAmount: 999,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
        applyToAll: true,
        createdBy: "system"
      });

      // 4️⃣ Update lastIssuedYear to prevent duplicate coupons this year
      await Birthday.updateOne(
        { _id: entry._id },
        { lastIssuedYear: currentYear }
      );

      // 5️⃣ Send email using your existing function
      const emailHTML = `
        <h2>🎉 Happy Birthday, ${user.name}!</h2>
        <p>We have a special birthday gift just for you ✨</p>
        <p>Use the exclusive coupon code below:</p>

        <h1 style="color:#e63946;text-align:center;margin-top:20px;">
          <strong>${couponCode}</strong>
        </h1>

        <p style="font-size:16px;margin-top:20px;">
          🎁 <strong>Get 20% OFF</strong> on your next purchase!<br>
          🔒 Maximum discount: ₹500<br>
          🛍 Minimum order: ₹999<br>
          ⏰ Valid for 7 days only
        </p>

        <p>Enjoy your special day! 💖<br>— Elegant Silver Jewellery</p>
      `;

      await sendEmail(user.email, "🎁 Your Birthday Discount Coupon!", emailHTML);

      results.push({
        email: user.email,
        coupon: couponCode
      });
    }

    return res.status(200).json({
      success: true,
      results
    });

  } catch (error) {
    console.error("Birthday coupon generation error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
