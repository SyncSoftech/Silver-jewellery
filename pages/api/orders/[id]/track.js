// pages/api/orders/[id]/track.js
import connectDb from '../../../../middleware/mongoose';
import OrderTracking from '../../../../models/OrderTracking';

const handler = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Order id required' });

  if (req.method === 'GET') {
    try {
      const timeline = await OrderTracking.getTimeline(id);
      return res.status(200).json(timeline);
    } catch (error) {
      console.error('GET order tracking error', error);
      return res.status(500).json({ error: 'Error fetching timeline' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default connectDb(handler);
