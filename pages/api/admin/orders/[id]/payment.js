// pages/api/admin/orders/[id]/payment.js
import connectDb from '../../../../../middleware/mongoose';
import Order from '../../../../../models/Order';

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { status } = req.body;

  if (!['paid', 'unpaid', 'refunded', 'failed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid payment status' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update payment status
    order.paymentInfo = order.paymentInfo || {};
    order.paymentInfo.status = status;
    order.isPaid = status === 'paid';
    
    // If marking as paid and order was pending, update status to paid
    if (status === 'paid' && order.status === 'Pending') {
      order.status = 'Paid';
    }

    await order.save();

    // Add to order timeline
    await fetch(`${process.env.NEXTAUTH_URL}/api/admin/orders/${id}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { 'Authorization': req.headers.authorization } : {})
      },
      body: JSON.stringify({
        status: 'Payment Status Updated',
        note: `Payment status changed to ${status} by admin`,
        updatedByModel: 'Admin'
      })
    }).catch(e => console.error('Failed to add to timeline:', e));

    return res.status(200).json({
      ...order.toObject(),
      isPaid: status === 'paid',
      paymentInfo: {
        ...order.paymentInfo.toObject(),
        status
      }
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({ error: 'Error updating payment status' });
  }
};

export default connectDb(handler);
