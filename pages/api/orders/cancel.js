// // pages/api/orders/cancel.js
// import connectDB from '../../../middleware/mongoose';
// import Order from '../../../models/Order';
// import { verifyToken } from '../../../utils/jwt';
// import { revertStockDecrease } from '../../../utils/inventory';

// const handler = async (req, res) => {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, error: 'Method not allowed' });
//   }

//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     const decoded = verifyToken(token);
//     if (!decoded?.userId) {
//       return res.status(401).json({ success: false, error: 'Unauthorized' });
//     }

//     const { orderId } = req.body;
//     if (!orderId) {
//       return res.status(400).json({ success: false, error: 'orderId required' });
//     }

//     // Find order
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }

//     // Check ownership
//     if (order.userId?.toString() !== decoded.userId?.toString()) {
//       return res.status(403).json({ success: false, error: 'Forbidden: you do not own this order' });
//     }

//     // Only allow cancellation of pending or processing orders
//     if (!['Pending', 'Processing'].includes(order.status)) {
//       return res.status(400).json({
//         success: false,
//         error: `Cannot cancel order with status: ${order.status}. Only Pending or Processing orders can be cancelled.`
//       });
//     }

//     // Revert stock for all order items
//     const cartItems = order.orderItems.map(item => ({
//       productId: item.product,
//       qty: item.quantity
//     }));

//     const revertResult = await revertStockDecrease(cartItems);
    
//     if (!revertResult.success) {
//       console.error('Stock revert failed:', revertResult.failed);
//       return res.status(500).json({
//         success: false,
//         error: 'Failed to revert stock',
//         stockErrors: revertResult.failed
//       });
//     }

//     // Update order status to cancelled
//     order.status = 'Cancelled';
//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: 'Order cancelled successfully',
//       order,
//       revertedStock: revertResult.reverted
//     });
//   } catch (error) {
//     console.error('Error cancelling order:', error);
//     return res.status(500).json({ success: false, error: error.message || 'Server error' });
//   }
// };

// export default connectDB(handler);



// // pages/api/orders/cancel.js
// import connectDB from '../../../middleware/mongoose';
// import Order from '../../../models/Order';
// import { verifyToken } from '../../../utils/jwt';
// import { revertStockDecrease } from '../../../utils/inventory';

// const handler = async (req, res) => {
//   try {
//     if (req.method === 'GET') {
//       // GET /api/orders/cancel?orderId=...
//       const { orderId } = req.query;
//       if (!orderId) {
//         return res.status(400).json({ success: false, error: 'orderId required' });
//       }

//       const order = await Order.findById(orderId);
//       if (!order) {
//         return res.status(404).json({ success: false, error: 'Order not found' });
//       }

//       // Return order (do not change any state)
//       return res.status(200).json({ success: true, order });
//     }

//     if (req.method !== 'POST') {
//       return res.status(405).json({ success: false, error: 'Method not allowed' });
//     }

//     // POST -> perform cancellation
//     const token = req.headers.authorization?.split(' ')[1];
//     const decoded = verifyToken(token);
//     if (!decoded?.userId) {
//       return res.status(401).json({ success: false, error: 'Unauthorized' });
//     }

//     const { orderId } = req.body;
//     if (!orderId) {
//       return res.status(400).json({ success: false, error: 'orderId required' });
//     }

//     // Find order
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }

//     // Check ownership
//     if (order.userId?.toString() !== decoded.userId?.toString()) {
//       return res.status(403).json({ success: false, error: 'Forbidden: you do not own this order' });
//     }

//     // Only allow cancellation of pending or processing orders
//     if (!['Pending', 'Processing','paid'].includes(order.status)) {
//       return res.status(400).json({
//         success: false,
//         error: `Cannot cancel order with status: ${order.status}. Only Pending or Processing or paid orders can be cancelled.`
//       });
//     }

//     // Revert stock for all order items
//     const cartItems = order.orderItems.map(item => ({
//       productId: item.product,
//       qty: item.quantity
//     }));

//     const revertResult = await revertStockDecrease(cartItems);

//     if (!revertResult.success) {
//       console.error('Stock revert failed:', revertResult.failed);
//       return res.status(500).json({
//         success: false,
//         error: 'Failed to revert stock',
//         stockErrors: revertResult.failed
//       });
//     }

//     // Update order status to Cancelled
//     order.status = 'Cancelled';
//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: 'Order cancelled successfully',
//       order,
//       revertedStock: revertResult.reverted
//     });
//   } catch (error) {
//     console.error('Error cancelling order:', error);
//     return res.status(500).json({ success: false, error: error.message || 'Server error' });
//   }
// };

// export default connectDB(handler);


// pages/api/orders/cancel.js
import connectDB from '../../../middleware/mongoose';
import Order from '../../../models/Order';
import { verifyToken } from '../../../utils/jwt';
import { revertStockDecrease } from '../../../utils/inventory';

const handler = async (req, res) => {
  try {
    // GET: check order status without changing it
    if (req.method === 'GET') {
      const { orderId } = req.query;
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'orderId required' });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      return res.status(200).json({ success: true, order });
    }

    // Only POST allowed for cancel action
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // POST -> perform cancellation
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'orderId required' });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Check ownership
    if (order.userId?.toString() !== decoded.userId?.toString()) {
      return res.status(403).json({ success: false, error: 'Forbidden: you do not own this order' });
    }

    // Allow cancellation for Pending, Processing, or Paid orders
    if (!['Pending', 'Processing', 'Paid'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel order with status: ${order.status}. Only Pending, Processing, or Paid orders can be cancelled.`
      });
    }

    // Build revert stock list: map orderItems -> { productId, qty }
    const cartItems = (order.orderItems || []).map(item => ({
      productId: item.product,
      qty: item.quantity
    }));

    // Revert stock
    const revertResult = await revertStockDecrease(cartItems);

    if (!revertResult.success) {
      console.error('Stock revert failed:', revertResult.failed);
      return res.status(500).json({
        success: false,
        error: 'Failed to revert stock',
        stockErrors: revertResult.failed
      });
    }

    // Update order status to Cancelled
    order.status = 'Cancelled';
    // Optionally you can add refund info here if paid: order.refundStatus = 'Pending';
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
      revertedStock: revertResult.reverted
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export default connectDB(handler);
