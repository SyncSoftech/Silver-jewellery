// pages/api/orders/index.js
import connectDB from '../../../middleware/mongoose';
import Order from '../../../models/Order';
import { verifyToken } from '../../../utils/jwt';

const handler = async (req, res) => {
  // Only allow GET here
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Expect Authorization: Bearer <token>
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: missing token' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized: invalid token' });
    }

    // find orders for this user, newest first
    const orders = await Order.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Normalize fields that cannot be serialized directly (ObjectId, Dates)
    const normalized = (orders || []).map(o => ({
      ...o,
      _id: o._id.toString(),
      createdAt: o.createdAt ? o.createdAt.toISOString() : null,
      updatedAt: o.updatedAt ? o.updatedAt.toISOString() : null
    }));

    return res.status(200).json({ success: true, orders: normalized });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

export default connectDB(handler);
