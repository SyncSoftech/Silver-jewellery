// // pages/api/posttransaction.js
// import crypto from 'crypto';
// import connectDB from '../../middleware/mongoose';
// import Order from '../../models/Order';
// import { verifyToken } from '../../utils/jwt';
// import { decreaseStock, revertStockDecrease } from '../../utils/inventory';

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

//     const {
//       razorpayPaymentId,
//       razorpayOrderId,
//       razorpaySignature,
//       dbOrderId
//     } = req.body;

//     if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !dbOrderId) {
//       return res.status(400).json({ success: false, error: 'Missing required fields' });
//     }

//     // verify signature
//     const expected = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//       .digest('hex');

//     if (expected !== razorpaySignature) {
//       console.warn('Invalid signature', { expected, received: razorpaySignature });
//       return res.status(400).json({ success: false, error: 'Invalid signature' });
//     }

//     // find db order
//     const order = await Order.findById(dbOrderId);
//     if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

//     // check ownership
//     if (order.userId?.toString() !== decoded.userId?.toString()) {
//       return res.status(403).json({ success: false, error: 'Forbidden: you do not own this order' });
//     }

//     // Atomically decrease stock for all order items
//     const cartItems = order.orderItems.map(item => ({
//       productId: item.product,
//       qty: item.quantity
//     }));

//     const stockDecreaseResult = await decreaseStock(cartItems);
    
//     if (!stockDecreaseResult.success) {
//       console.error('Stock decrease failed:', stockDecreaseResult.failed);
//       return res.status(409).json({
//         success: false,
//         error: 'Failed to reserve stock for order',
//         stockErrors: stockDecreaseResult.failed
//       });
//     }

//     // update order as paid
//     order.status = 'Paid';
//     order.paymentInfo = {
//       razorpayOrderId,
//       razorpayPaymentId,
//       razorpaySignature,
//       status: 'paid'
//     };
//     await order.save();

//     // Emit real-time inventory update via Socket.io
//     try {
//       // This will be handled by the server-side socket handler
//       // For now, we'll log the update
//       console.log('Stock decreased for order:', dbOrderId, 'Updated items:', stockDecreaseResult.updated);
//     } catch (socketErr) {
//       console.warn('Socket.io notification failed (non-critical):', socketErr.message);
//     }

//     return res.status(200).json({
//       success: true,
//       order,
//       stockUpdates: stockDecreaseResult.updated
//     });
//   } catch (err) {
//     console.error('posttransaction error:', err);
//     return res.status(500).json({ success: false, error: 'Server error' });
//   }
// };

// export default connectDB(handler);


// pages/api/posttransaction.js
import crypto from 'crypto';
import connectDB from '../../middleware/mongoose';
import Order from '../../models/Order';
import Coupon from '../../models/Coupon';
import { verifyToken } from '../../utils/jwt';
import { decreaseStock, revertStockDecrease } from '../../utils/inventory';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      dbOrderId
    } = req.body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !dbOrderId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // verify signature
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expected !== razorpaySignature) {
      console.warn('Invalid signature', { expected, received: razorpaySignature });
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    // find db order
    const order = await Order.findById(dbOrderId);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    // check ownership
    if (order.userId?.toString() !== decoded.userId?.toString()) {
      return res.status(403).json({ success: false, error: 'Forbidden: you do not own this order' });
    }

    // Atomically decrease stock for all order items
    const cartItems = order.orderItems.map(item => ({
      productId: item.product,
      qty: item.quantity
    }));

    const stockDecreaseResult = await decreaseStock(cartItems);
    
    if (!stockDecreaseResult.success) {
      console.error('Stock decrease failed:', stockDecreaseResult.failed);
      return res.status(409).json({
        success: false,
        error: 'Failed to reserve stock for order',
        stockErrors: stockDecreaseResult.failed
      });
    }

    // If there's an applied coupon, validate per-user and increment usedCount atomically
    if (order.appliedCoupon && order.appliedCoupon.code) {
      try {
        const code = String(order.appliedCoupon.code).trim().toUpperCase();
        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
          // coupon missing — rollback stock and inform
          await revertStockDecrease(cartItems);
          return res.status(400).json({ success: false, error: 'Applied coupon not found' });
        }

        // Check per-user limit (exclude current order)
        if (coupon.perUserLimit && coupon.perUserLimit > 0) {
          const usedByUser = await Order.countDocuments({
            userId: decoded.userId.toString(),
            'appliedCoupon.code': coupon.code,
            _id: { $ne: order._id } // exclude current order if it was previously saved with coupon
          });

          if (usedByUser >= coupon.perUserLimit) {
            // reached per-user limit -> rollback stock and inform
            await revertStockDecrease(cartItems);
            return res.status(400).json({
              success: false,
              error: `You have already used this coupon ${coupon.perUserLimit} time(s).`
            });
          }
        }

        // Atomic increment that respects usageLimit (if set)
        const updateQuery = { _id: coupon._id };
        if (typeof coupon.usageLimit === 'number' && coupon.usageLimit >= 0) {
          // ensure usedCount < usageLimit
          updateQuery.usedCount = { $lt: coupon.usageLimit };
        }

        const updatedCoupon = await Coupon.findOneAndUpdate(
          updateQuery,
          { $inc: { usedCount: 1 } },
          { new: true }
        );

        if (!updatedCoupon) {
          // increment failed (likely usage limit reached) -> rollback stock and inform
          await revertStockDecrease(cartItems);
          return res.status(409).json({
            success: false,
            error: 'Coupon usage limit reached or coupon not available'
          });
        }

        // all good - coupon usedCount incremented
        // Optionally attach latest coupon snapshot to order.paymentInfo or order.appliedCouponUpdatedAt
        order.appliedCoupon = {
          ...order.appliedCoupon,
          discountApplied: order.appliedCoupon.discountApplied ?? order.discountAmount ?? order.discountAmount,
          // you may add other fields from updatedCoupon if desired
        };
      } catch (couponErr) {
        console.error('Coupon processing error:', couponErr);
        // rollback stock decrease
        await revertStockDecrease(cartItems);
        return res.status(500).json({ success: false, error: 'Coupon processing failed' });
      }
    }

    // update order as paid (only after stock reserved and coupon incremented)
    order.status = 'Paid';
    order.paymentInfo = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'paid'
    };
    await order.save();

    // Emit real-time inventory update via Socket.io
    try {
      // This will be handled by the server-side socket handler
      // For now, we'll log the update
      console.log('Stock decreased for order:', dbOrderId, 'Updated items:', stockDecreaseResult.updated);
    } catch (socketErr) {
      console.warn('Socket.io notification failed (non-critical):', socketErr.message);
    }

    return res.status(200).json({
      success: true,
      order,
      stockUpdates: stockDecreaseResult.updated
    });
  } catch (err) {
    console.error('posttransaction error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

export default connectDB(handler);
