// models/Order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true }
});

const AddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  postalCode: { type: String, required: true },
  landmark: { type: String }
}, { _id: false });

const PaymentInfoSchema = new mongoose.Schema({
  method: { type: String, enum: ['Razorpay', 'COD', 'Wallet', 'Other'], default: 'Razorpay' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
  raw: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  orderNumber: { type: String, sparse: true },
  orderItems: {
    type: [OrderItemSchema],
    required: true,
    validate: [arr => arr.length > 0, 'Order must contain at least one item']
  },
  shippingAddress: { type: AddressSchema, required: true },
  billingAddress: { type: AddressSchema, required: true },
  amount: { type: Number, required: true, min: 0 },
  shippingAmount: { type: Number, default: 0, min: 0 },
  taxAmount: { type: Number, default: 0, min: 0 },
  paymentMethod: {
    type: String,
    enum: ['Online Payment (Razorpay)', 'COD', 'Wallet', 'Other'],
    default: 'Online Payment (Razorpay)'
  },
  paymentInfo: { type: PaymentInfoSchema, default: () => ({}) },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Paid', 'Shipped', 'Completed', 'Cancelled', 'Refunded'],
    default: 'Pending',
    required: true
  },
  isPaid: { type: Boolean, default: false },
  notes: { type: String }
}, {
  timestamps: true
});

// Indexes (wrapped in try/catch to avoid runtime crash on HMR or mismatched Mongoose)
try {
  // Primary useful indexes
  OrderSchema.index({ userId: 1, status: 1 });
  OrderSchema.index({ createdAt: -1 });
  // orderNumber index removed - using sparse field instead to avoid duplicate index warning
} catch (err) {
  // If index creation fails during module load, don't crash the app — log for debugging
  // In production you'll want to surface/fix this, but in dev HMR can cause repeated index registration
  // which sometimes leads to process-level issues.
  // eslint-disable-next-line no-console
  console.warn('OrderSchema.index() failed during model definition:', err && err.message ? err.message : err);
}

// pre-save hook
OrderSchema.pre('save', function (next) {
  try {
    if (this.paymentInfo && this.paymentInfo.status) {
      const paidStates = ['paid'];
      this.isPaid = paidStates.includes(String(this.paymentInfo.status).toLowerCase());
      if (this.paymentInfo.status === 'paid') {
        if (this.status === 'Pending') this.status = 'Paid';
      }
    }
  } catch (e) {
    // don't block save because of hook error; log and continue
    // eslint-disable-next-line no-console
    console.error('OrderSchema.pre("save") error:', e);
  }
  next();
});

// Export model without redefining on HMR (Next dev)
module.exports = mongoose.models && mongoose.models.Order
  ? mongoose.models.Order
  : mongoose.model('Order', OrderSchema);
