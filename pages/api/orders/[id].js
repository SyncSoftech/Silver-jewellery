// pages/api/orders/[id].js
import connectDB from '../../../middleware/mongoose';
import Order from '../../../models/Order';
import { verifyToken } from '../../../utils/jwt';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Unauthorized: missing token' });

    const decoded = verifyToken(token);
    if (!decoded?.userId) return res.status(401).json({ success: false, error: 'Unauthorized: invalid token' });

    const { id } = req.query;
    if (!id) return res.status(400).json({ success: false, error: 'Missing order id' });

    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    if (order.userId?.toString() !== decoded.userId?.toString()) {
      return res.status(403).json({ success: false, error: 'Forbidden: you do not own this order' });
    }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error('GET /api/orders/[id] error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

export default connectDB(handler);
