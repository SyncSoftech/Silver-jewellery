import mongoose from "mongoose";

const GiftCardSchema = new mongoose.Schema({
  receiverName: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  purpose: { type: String, required: true },

  amount: { type: Number, required: true },

  // Generated automatically after payment
  couponCode: { type: String, required: true },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },

  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  expiryDate: { type: Date, required: true },

  paymentId: { type: String, required: true },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.GiftCard || mongoose.model("GiftCard", GiftCardSchema);
