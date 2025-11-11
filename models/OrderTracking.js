// models/OrderTracking.js
/**
 * OrderTracking model
 * - Stores a timeline of tracking/status events for orders
 * - Includes optional shipment/carrier info for 'shipped' events
 *
 * Helper statics:
 *   - addEvent(orderId, eventObj) => creates a tracking event
 *   - getTimeline(orderId) => returns events sorted by createdAt asc
 */

const mongoose = require('mongoose');

const TrackingEventSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },

  // Canonical lowercase status (e.g. 'pending', 'processing', 'shipped', 'completed', 'cancelled', 'refunded')
  status: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'paid', 'failed', 'other'],
    default: 'pending'
  },

  // Short human note (admin or system)
  note: { type: String, trim: true },

  // Optional textual location e.g. "Mumbai, MH"
  location: { type: String, trim: true },

  // Who performed the update. refPath allows referencing Admin or User (or System)
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'updatedByModel'
  },
  updatedByModel: {
    type: String,
    enum: ['Admin', 'User', 'System'],
    default: 'Admin'
  },

  // Shipment specific fields (used when status === 'shipped' typically)
  carrier: { type: String, trim: true },          // e.g. "Delhivery", "DHL"
  trackingNumber: { type: String, trim: true, index: true },
  trackingUrl: { type: String, trim: true },
  eta: { type: Date },

  // Timestamp when the event was created
  createdAt: { type: Date, default: Date.now, index: true }
}, {
  // We manage createdAt manually (above) and don't need updatedAt for events
  versionKey: false
});

// Compound index for fast lookups sorted by time
TrackingEventSchema.index({ orderId: 1, createdAt: -1 });

// ----------------------
// Instance / Static helpers
// ----------------------

// Add a tracking event (static)
// Usage: await OrderTracking.addEvent(orderId, { status: 'shipped', note: 'Sent', carrier: 'DHL', trackingNumber: 'XYZ' , updatedBy, updatedByModel })
TrackingEventSchema.statics.addEvent = async function (orderId, event = {}) {
  if (!orderId) throw new Error('orderId is required to add tracking event');
  const doc = new this({
    orderId,
    status: (event.status || 'other').toString().toLowerCase(),
    note: event.note,
    location: event.location,
    updatedBy: event.updatedBy,
    updatedByModel: event.updatedByModel || (event.updatedBy ? 'Admin' : 'System'),
    carrier: event.carrier,
    trackingNumber: event.trackingNumber,
    trackingUrl: event.trackingUrl,
    eta: event.eta,
    createdAt: event.createdAt || Date.now()
  });
  return doc.save();
};

// Get full timeline for an order (sorted ascending)
TrackingEventSchema.statics.getTimeline = async function (orderId) {
  if (!orderId) throw new Error('orderId is required to get timeline');
  return this.find({ orderId }).sort({ createdAt: 1 }).lean();
};

// Get latest event for an order
TrackingEventSchema.statics.getLatest = async function (orderId) {
  if (!orderId) throw new Error('orderId is required to get latest event');
  return this.findOne({ orderId }).sort({ createdAt: -1 }).lean();
};

// Optional virtual for pretty label
TrackingEventSchema.virtual('prettyStatus').get(function () {
  return (this.status || '').charAt(0).toUpperCase() + (this.status || '').slice(1);
});

// Export model
module.exports = mongoose.models.OrderTracking || mongoose.model('OrderTracking', TrackingEventSchema);
