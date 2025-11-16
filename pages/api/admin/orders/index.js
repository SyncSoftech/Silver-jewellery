// // pages/api/admin/orders/index.js
// import connectDb from '../../../../middleware/mongoose';
// import Order from '../../../../models/Order';
// import mongoose from 'mongoose';

// let User;
// try {
//   User = require('../../../../models/User').default;
// } catch (e) {
//   User = null;
// }

// // helper to map DB status to canonical lowercase statuses used in UI
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
//   if (req.method === 'GET') {
//     try {
//       const orders = await Order.find().sort({ createdAt: -1 });

//       const normalized = await Promise.all(
//         orders.map(async (o) => {
//           let customer = { name: 'Guest', email: '' };

//           try {
//             if (User && o.userId && mongoose.Types.ObjectId.isValid(o.userId)) {
//               const u = await User.findById(o.userId).select('name email').lean();
//               if (u) customer = { name: u.name || 'User', email: u.email || '' };
//             } else if (typeof o.userId === 'string' && o.userId.trim()) {
//               customer = { name: o.userId, email: '' };
//             }
//           } catch (e) {
//             console.error('Error loading user for order', o._id, e);
//           }

//           return {
//             _id: o._id,
//             orderNumber: o.orderNumber || String(o._id),
//             customer,
//             createdAt: o.createdAt,
//             // prefer amount, fallback to total
//             total: typeof o.amount === 'number' ? o.amount : (o.total || 0),
//             // deliver a canonical lowercase status
//             status: normalizeStatus(o.status),
//             // include payment info
//             isPaid: o.isPaid || false,
//             paymentMethod: o.paymentMethod || 'Unknown',
//             paymentInfo: o.paymentInfo ? {
//               status: o.paymentInfo.status || 'unpaid',
//               method: o.paymentInfo.method || o.paymentMethod || 'Unknown'
//             } : { status: 'unpaid', method: o.paymentMethod || 'Unknown' },
//             raw: undefined
//           };
//         })
//       );

//       return res.status(200).json(normalized);
//     } catch (error) {
//       console.error('GET /api/admin/orders error:', error);
//       return res.status(500).json({ error: 'Error fetching orders' });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// };

// export default connectDb(handler);

// pages/api/admin/orders/index.js
import connectDb from '../../../../middleware/mongoose';
import Order from '../../../../models/Order';
import mongoose from 'mongoose';

let User;
try {
  // prefer default export when available (works with both CJS and ESM shaped exports)
  User = require('../../../../models/User').default || require('../../../../models/User');
} catch (e) {
  User = null;
  // non-fatal — many setups don't expose User from admin context
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
          // default guest customer
          let customer = { name: 'Guest', email: '' };

          try {
            if (User && o.userId && mongoose.Types.ObjectId.isValid(String(o.userId))) {
              const u = await User.findById(o.userId).select('name email').lean();
              if (u) customer = { name: u.name || 'User', email: u.email || '' };
            } else if (o.userId && typeof o.userId === 'object' && (o.userId.name || o.userId.email)) {
              // sometimes the order might embed user info
              customer = { name: o.userId.name || 'User', email: o.userId.email || '' };
            } else if (typeof o.userId === 'string' && o.userId.trim()) {
              customer = { name: o.userId, email: '' };
            }
          } catch (e) {
            console.error('Error loading user for order', o._id, e);
          }

          // normalize numeric fields defensively
          const amount = Number(o.amount ?? o.total ?? 0) || 0;
          const discountAmount = Number(o.discountAmount ?? (o.appliedCoupon?.discountApplied) ?? 0) || 0;
          const finalAmount = typeof o.finalAmount !== 'undefined' ? Number(o.finalAmount) : Math.max(0, amount - discountAmount);

          // payment info normalized
          const paymentInfo = {
            status: (o.paymentInfo?.status || (o.isPaid ? 'paid' : 'unpaid') || 'unpaid').toString(),
            method: (o.paymentInfo?.method || o.paymentMethod || 'Unknown').toString(),
            razorpayOrderId: o.paymentInfo?.razorpayOrderId || o.paymentInfo?.orderId || null
          };

          return {
            _id: o._id,
            orderNumber: o.orderNumber || String(o._id),
            customer,
            createdAt: o.createdAt,
            // prefer finalAmount (amount actually charged), fall back to amount
            total: finalAmount,
            amount, // show subtotal for reference
            discountAmount,
            appliedCoupon: o.appliedCoupon || null,
            // deliver a canonical lowercase status for UI logic
            status: normalizeStatus(o.status),
            // include payment info and flags
            isPaid: Boolean(o.isPaid) || paymentInfo.status.toLowerCase() === 'paid',
            paymentMethod: paymentInfo.method,
            paymentInfo,
            // raw order for debugging (only include minimal fields)
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

