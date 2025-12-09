// pages/api/coupons/[id].js
import connectDb from '../../../middleware/mongoose';
import Coupon from '../../../models/Coupon';
import mongoose from 'mongoose';

const handler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  // basic id validation
  if (!id || !mongoose.Types.ObjectId.isValid(String(id))) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  try {
    // GET /api/coupons/:id
    if (method === 'GET') {
      const coupon = await Coupon.findById(id).lean();
      if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
      return res.status(200).json({ success: true, data: coupon });
    }

    // PUT /api/coupons/:id  (partial update)
    if (method === 'PUT') {
   
const updates = { ...req.body };

// If code is provided, normalize it
if (typeof updates.code !== 'undefined') {
  updates.code = String(updates.code).trim().toUpperCase();
}

// Coerce empty strings for numeric fields to null
if (updates.maxDiscount === '') updates.maxDiscount = null;
if (updates.usageLimit === '') updates.usageLimit = null;

// Normalize applyToAll (if present)
if (typeof updates.applyToAll !== 'undefined') {
  updates.applyToAll = Boolean(updates.applyToAll);
}

// helper to normalize product/category arrays (accept CSV or array)
const normalizeIds = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === 'string') {
    return v.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

if (typeof updates.applyToAll !== 'undefined' && updates.applyToAll) {
  // when applyToAll true, ignore any passed product/category lists
  updates.applicableProducts = [];
  updates.applicableCategories = [];
} else {
  if (typeof updates.applicableProducts !== 'undefined') {
    updates.applicableProducts = normalizeIds(updates.applicableProducts);
  }
  if (typeof updates.applicableCategories !== 'undefined') {
    updates.applicableCategories = normalizeIds(updates.applicableCategories);
  }
}

// Prevent updating createdAt/_id
delete updates._id;
delete updates.createdAt;
delete updates.__v;

try {
  const coupon = await Coupon.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  return res.status(200).json({ success: true, data: coupon });
} catch (err) {
  // duplicate key
  if (err && err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Coupon code already exists', field: 'code' });
  }
  return res.status(400).json({ success: false, message: err.message || 'Failed to update coupon' });
}

    }

    // DELETE /api/coupons/:id
    if (method === 'DELETE') {
      const coupon = await Coupon.findById(id);
      if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
      await coupon.remove();
      return res.status(200).json({ success: true, message: 'Coupon deleted' });
    }

    // method not allowed
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
  } catch (error) {
    console.error('API /api/coupons/[id] error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export default connectDb(handler);
