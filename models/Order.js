// getting-started.js
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
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  landmark: {
    type: String
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: {type :String , required:true },
  orderItems: [OrderItemSchema],
  shippingAddress: {
    type: AddressSchema,
    required: true
  },
  billingAddress: {
    type: AddressSchema,
    required: true
  },
  amount: {type: Number, required: true},
  status: {type: String, default:'Pending', required: true},
},{
  timestamps:true
});

// Add indexes for better query performance
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });

// Export the model
export default mongoose.models.Order || mongoose.model("Order",OrderSchema);