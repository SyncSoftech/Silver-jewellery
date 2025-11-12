// pages/api/admin/orders/index.js
import connectDb from '../../../../middleware/mongoose';
import Order from '../../../../models/Order';
import mongoose from 'mongoose';

let User;
try {
  User = require('../../../../models/User').default;
} catch (e) {
  User = null;
}

// helper to map DB status to canonical lowercase statuses used in UI
const normalizeStatus = (s) => {
  if (!s) return 'pending';
  const lower = String(s).toLowerCase();
  if (lower.includes('pending')) return 'pending';
  if (lower.includes('process')) return 'processing';
  if (lower.includes('paid') || lower.includes('complete') || lower.includes('delivered')) return 'completed';
  if (lower.includes('shipped')) return 'shipped';
  if (lower.includes('cancel')) return 'cancelled';
  if (lower.includes('refund')) return 'refunded';
  return lower;
};

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });

      const normalized = await Promise.all(
        orders.map(async (o) => {
          let customer = { name: 'Guest', email: '' };

          try {
            if (User && o.userId && mongoose.Types.ObjectId.isValid(o.userId)) {
              const u = await User.findById(o.userId).select('name email').lean();
              if (u) customer = { name: u.name || 'User', email: u.email || '' };
            } else if (typeof o.userId === 'string' && o.userId.trim()) {
              customer = { name: o.userId, email: '' };
            }
          } catch (e) {
            console.error('Error loading user for order', o._id, e);
          }

          return {
            _id: o._id,
            orderNumber: o.orderNumber || String(o._id),
            customer,
            createdAt: o.createdAt,
            // prefer amount, fallback to total
            total: typeof o.amount === 'number' ? o.amount : (o.total || 0),
            // deliver a canonical lowercase status
            status: normalizeStatus(o.status),
            // include payment info
            isPaid: o.isPaid || false,
            paymentMethod: o.paymentMethod || 'Unknown',
            paymentInfo: o.paymentInfo ? {
              status: o.paymentInfo.status || 'unpaid',
              method: o.paymentInfo.method || o.paymentMethod || 'Unknown'
            } : { status: 'unpaid', method: o.paymentMethod || 'Unknown' },
            raw: undefined
          };
        })
      );

      return res.status(200).json(normalized);
    } catch (error) {
      console.error('GET /api/admin/orders error:', error);
      return res.status(500).json({ error: 'Error fetching orders' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);
