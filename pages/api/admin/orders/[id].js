// // pages/api/admin/orders/[id].js
// import connectDb from '../../../../middleware/mongoose';
// import Order from '../../../../models/Order';

// const normalizeStatus = (s) => {
//   if (!s) return 'pending';
//   const lower = String(s).toLowerCase();
//   if (lower.includes('pending')) return 'pending';
//   if (lower.includes('process')) return 'processing';
//   if (lower.includes('paid') || lower.includes('complete') || lower.includes('delivered')) return 'completed';
//   if (lower.includes('shipped')) return 'shipped';
//   if (lower.includes('cancel')) return 'cancelled';
//   if (lower.includes('refund')) return 'refunded';
//   return lower;
// };

// const handler = async (req, res) => {
//   const { method } = req;
//   const { id } = req.query;
//   if (!id) return res.status(400).json({ error: 'Missing order id' });

//   try {
//     if (method === 'GET') {
//       const order = await Order.findById(id).lean();
//       if (!order) return res.status(404).json({ error: 'Order not found' });

//       // compute total if missing
//       let total = 0;
//       if (typeof order.amount === 'number' && order.amount > 0) total = order.amount;
//       else if (typeof order.total === 'number' && order.total > 0) total = order.total;
//       else if (Array.isArray(order.orderItems)) {
//         total = order.orderItems.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity ?? it.qty) || 0), 0);
//       }

//       return res.status(200).json({
//         ...order,
//         total,
//         status: normalizeStatus(order.status)
//       });
//     }

//     if (method === 'PUT') {
//       const { status, note } = req.body;
//       const order = await Order.findById(id);
//       if (!order) return res.status(404).json({ error: 'Order not found' });
//       if (typeof status !== 'undefined') order.status = status;
//       if (typeof note !== 'undefined') order.notes = note;
//       await order.save();
//       return res.status(200).json({ message: 'Order updated', order });
//     }

//     if (method === 'DELETE') {
//       const order = await Order.findById(id);
//       if (!order) return res.status(404).json({ error: 'Order not found' });
//       await order.remove();
//       return res.status(200).json({ message: 'Order deleted' });
//     }

//     res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
//     return res.status(405).end(`Method ${method} Not Allowed`);
//   } catch (err) {
//     console.error('API /api/admin/orders/[id] error:', err);
//     return res.status(500).json({ error: 'Server error' });
//   }
// };

// export default connectDb(handler);


// pages/api/admin/orders/[id].js
import connectDb from '../../../../middleware/mongoose';
import Order from '../../../../models/Order';
import mongoose from 'mongoose';

let User;
try {
  User = require('../../../../models/User').default || require('../../../../models/User');
} catch (e) {
  User = null;
}

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
  const { method } = req;
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing order id' });

  try {
    if (method === 'GET') {
      const order = await Order.findById(id).lean();
      if (!order) return res.status(404).json({ error: 'Order not found' });

      // compute amount/subtotal
      const amount = Number(order.amount ?? order.total ?? 0) || 0;
      const discountAmount = Number(order.discountAmount ?? (order.appliedCoupon?.discountApplied) ?? 0) || 0;
      const finalAmount = typeof order.finalAmount !== 'undefined' ? Number(order.finalAmount) : Math.max(0, amount - discountAmount);

      // lookup user if possible
      let customer = { name: 'Guest', email: '' };
      try {
        if (User && order.userId && mongoose.Types.ObjectId.isValid(String(order.userId))) {
          const u = await User.findById(order.userId).select('name email').lean();
          if (u) customer = { name: u.name || 'User', email: u.email || '' };
        } else if (order.userId && typeof order.userId === 'object' && (order.userId.name || order.userId.email)) {
          customer = { name: order.userId.name || 'User', email: order.userId.email || '' };
        } else if (typeof order.userId === 'string' && order.userId.trim()) {
          customer = { name: order.userId, email: '' };
        }
      } catch (e) {
        console.warn('User lookup failed for order', id, e.message || e);
      }

      return res.status(200).json({
        ...order,
        amount,
        discountAmount,
        finalAmount,
        customer,
        status: normalizeStatus(order.status)
      });
    }

    if (method === 'PUT') {
      const body = req.body || {};
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      // allow updating status and notes, but keep finalAmount/discount untouched
      if (typeof body.status !== 'undefined') order.status = body.status;
      if (typeof body.notes !== 'undefined') order.notes = body.notes;
      if (typeof body.paymentInfo !== 'undefined') order.paymentInfo = { ...order.paymentInfo, ...body.paymentInfo };
      // If admin explicitly updates isPaid flag:
      if (typeof body.isPaid !== 'undefined') order.isPaid = Boolean(body.isPaid);

      await order.save();
      return res.status(200).json({ message: 'Order updated', order });
    }

    if (method === 'DELETE') {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      await order.remove();
      return res.status(200).json({ message: 'Order deleted' });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error('API /api/admin/orders/[id] error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export default connectDb(handler);
