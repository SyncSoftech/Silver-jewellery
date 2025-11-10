// pages/api/admin/analytics/sales.js
import connectDb from '../../../../middleware/mongoose';
import Order from '../../../../models/Order';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const result = await Order.aggregate([
        {
          // case-insensitive match for completed-like statuses
          $match: {
            status: { $regex: '^completed$', $options: 'i' }
          }
        },
        {
          // sum the 'amount' field (your schema uses 'amount')
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      res.status(200).json({
        total: result[0]?.total || 0
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
      res.status(500).json({ error: 'Error fetching sales data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);
