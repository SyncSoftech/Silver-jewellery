const mongoose = require('mongoose');


const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
}, {
  timestamps: true
});

// Index for faster lookups
CouponSchema.index({ code: 1, isActive: 1 });
CouponSchema.index({ startDate: 1, endDate: 1 });

// Check if coupon is valid
CouponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    this.startDate <= now &&
    this.endDate >= now &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Apply coupon to cart
CouponSchema.methods.calculateDiscount = function(cartTotal) {
  if (cartTotal < this.minOrderAmount) {
    throw new Error(`Minimum order amount of ₹${this.minOrderAmount} required`);
  }

  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (this.value / 100) * cartTotal;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = Math.min(this.value, cartTotal);
  }

  return {
    discount: Math.round(discount * 100) / 100, // Round to 2 decimal places
    finalAmount: Math.max(0, cartTotal - discount)
  };
};

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
