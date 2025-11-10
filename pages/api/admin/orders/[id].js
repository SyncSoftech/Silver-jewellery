// pages/api/admin/orders/[id].js
import connectDb from '../../../../middleware/mongoose';
import Order from '../../../../models/Order';

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

      // compute total if missing
      let total = 0;
      if (typeof order.amount === 'number' && order.amount > 0) total = order.amount;
      else if (typeof order.total === 'number' && order.total > 0) total = order.total;
      else if (Array.isArray(order.orderItems)) {
        total = order.orderItems.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity ?? it.qty) || 0), 0);
      }

      return res.status(200).json({
        ...order,
        total,
        status: normalizeStatus(order.status)
      });
    }

    if (method === 'PUT') {
      const { status, note } = req.body;
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      if (typeof status !== 'undefined') order.status = status;
      if (typeof note !== 'undefined') order.notes = note;
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
