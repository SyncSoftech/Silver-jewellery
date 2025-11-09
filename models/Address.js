const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  label: { 
    type: String,
    required: true,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home'
  },
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
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  addressType: {
    type: String,
    enum: ['billing', 'shipping'],
    required: true
  }
}, { timestamps: true });

// Ensure a user can have only one default address of each type
AddressSchema.index(
  { user: 1, addressType: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);

// Check if model exists
const Address = mongoose.models.Address || mongoose.model('Address', AddressSchema);

module.exports = Address;
