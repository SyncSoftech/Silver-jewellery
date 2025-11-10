// pages/api/admin/analytics/orders.js
import connectDb from '../../../../middleware/mongoose';
import Order from '../../../../models/Order';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      // case-insensitive counts
      const [totalOrders, pendingOrders, processingOrders, completedOrders] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: { $regex: '^pending$', $options: 'i' } }),
        Order.countDocuments({ status: { $regex: '^processing$', $options: 'i' } }),
        Order.countDocuments({ status: { $regex: '^completed$', $options: 'i' } })
      ]);

      // Get monthly orders for the current year (defensive: ensure createdAt exists)
      const currentYear = new Date().getFullYear();
      const monthlyOrdersAgg = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
              $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      // Convert aggregation to an array of 12 months (1..12) with defaults
      const monthly = Array.from({ length: 12 }, (_, i) => {
        const found = monthlyOrdersAgg.find(m => m._id === i + 1);
        return { month: i + 1, count: found ? found.count : 0 };
      });

      res.status(200).json({
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
        monthly
      });
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      res.status(500).json({ error: 'Error fetching order analytics' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);
