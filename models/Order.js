// // getting-started.js
// const mongoose = require('mongoose');

// const OrderItemSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   image: {
//     type: String,
//     required: true
//   }
// });

// const AddressSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true
//   },
//   phone: {
//     type: String,
//     required: true
//   },
//   street: {
//     type: String,
//     required: true
//   },
//   city: {
//     type: String,
//     required: true
//   },
//   state: {
//     type: String,
//     required: true
//   },
//   country: {
//     type: String,
//     required: true
//   },
//   postalCode: {
//     type: String,
//     required: true
//   },
//   landmark: {
//     type: String
//   }
// }, { _id: false });

// const OrderSchema = new mongoose.Schema({
//   userId: {type :String , required:true },
//   orderItems: [OrderItemSchema],
//   shippingAddress: {
//     type: AddressSchema,
//     required: true
//   },
//   billingAddress: {
//     type: AddressSchema,
//     required: true
//   },
//   amount: {type: Number, required: true},
//   status: {type: String, default:'Pending', required: true},
// },{
//   timestamps:true
// });

// // Add indexes for better query performance
// OrderSchema.index({ userId: 1, status: 1 });
// OrderSchema.index({ createdAt: -1 });

// // Export the model
// export default mongoose.models.Order || mongoose.model("Order",OrderSchema);

// getting-started.js (updated Order schema)
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  }
});

// Embedded address schema (no separate _id)
const AddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'India'
  },
  postalCode: {
    type: String,
    required: true
  },
  landmark: {
    type: String
  }
}, { _id: false });

// Payment info subdocument (keeps Razorpay specifics and generic fields)
const PaymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['Razorpay', 'COD', 'Wallet', 'Other'],
    default: 'Razorpay'
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'refunded'],
    default: 'created'
  },
  // store any gateway-specific raw response (optional)
  raw: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  // user who placed the order
  userId: {
    type: String,
    required: true,
    index: true
  },

  // human-friendly order number / receipt (optional but useful)
  orderNumber: {
    type: String,
    unique: true,
    sparse: true // allows multiple nulls
  },

  // items
  orderItems: {
    type: [OrderItemSchema],
    required: true,
    validate: [arr => arr.length > 0, 'Order must contain at least one item']
  },

  // addresses
  shippingAddress: {
    type: AddressSchema,
    required: true
  },
  billingAddress: {
    type: AddressSchema,
    required: true
  },

  // pricing
  amount: {               // total amount charged / to charge (in rupees)
    type: Number,
    required: true,
    min: 0
  },
  shippingAmount: {       // optional shipping component
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  // payment and order status
  paymentMethod: {
    type: String,
    enum: ['Online Payment (Razorpay)', 'COD', 'Wallet', 'Other'],
    default: 'Online Payment (Razorpay)'
  },
  paymentInfo: {
    type: PaymentInfoSchema,
    default: () => ({})
  },

  // logical status of order for fulfilment (not payment)
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending',
    required: true
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  notes: { type: String }
}, {
  timestamps: true
});

// Indexes for common queries
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });

// Before saving, ensure isPaid matches paymentInfo.status if possible
OrderSchema.pre('save', function (next) {
  if (this.paymentInfo && this.paymentInfo.status) {
    const paidStates = ['paid'];
    this.isPaid = paidStates.includes(String(this.paymentInfo.status).toLowerCase());
    if (this.paymentInfo.status === 'paid') {
      // If order was 'Pending', move to Paid (but keep business logic flexible)
      if (this.status === 'Pending') this.status = 'Paid';
    }
  }
  next();
});

// Export the model (keeps your original export style)
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
