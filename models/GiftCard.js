const mongoose = require("mongoose");

const GiftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    uppercase: true
  },
  initialValue: {
    type: Number,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  expiryDate: {
    type: Date,
    required: true
  },
  transactions: [
    {
      amount: Number,
      date: Date,
      orderId: String
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.models.GiftCard || mongoose.model("GiftCard", GiftCardSchema);
