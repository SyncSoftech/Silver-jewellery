// pages/api/coupons/index.js (or your existing path)
// GET / POST for coupons (admin style) - no session dependency


import Coupon from '../../../models/Coupon';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { method } = req;

 
  if (method === 'GET') {
     if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI) 
      console.log('Connected to MongoDB');
    }
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;

      const query = {};
      if (search) {
        query.$or = [
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const [coupons, total] = await Promise.all([
        Coupon.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Coupon.countDocuments(query)
      ]);

      return res.status(200).json({
        success: true,
        data: coupons,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

if (method === 'POST') {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  }
  try {
    const payload = { ...req.body };

    // Force code to uppercase (and trim)
    if (!payload.code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }
    payload.code = String(payload.code).trim().toUpperCase();

    // applyToAll: default true if missing
    payload.applyToAll = typeof payload.applyToAll === 'boolean' ? payload.applyToAll : true;

    // allow createdBy passed in body for now, else null
    payload.createdBy = payload.createdBy || null;

    // Convert empty strings to null for optional numeric fields
    if (payload.maxDiscount === '') payload.maxDiscount = null;
    if (payload.usageLimit === '') payload.usageLimit = null;

    // normalize applicableProducts/applicableCategories if provided (accept CSV or array)
    const normalizeIds = (v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v.map(String).filter(Boolean);
      if (typeof v === 'string') {
        // allow comma separated list
        return v.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    };

    if (payload.applyToAll) {
      payload.applicableProducts = [];
      payload.applicableCategories = [];
    } else {
      payload.applicableProducts = normalizeIds(payload.applicableProducts);
      payload.applicableCategories = normalizeIds(payload.applicableCategories);
    }

    const coupon = await Coupon.create(payload);

    return res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists',
        field: 'code'
      });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
}


  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, message: `Method ${method} not allowed` });
}
