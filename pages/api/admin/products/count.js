// pages/api/products/count.js
import connectDb from '../../../../middleware/mongoose';
import Product from '../../../../models/Product';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const count = await Product.countDocuments();
      return res.status(200).json({ count });
    } catch (error) {
      console.error('Error fetching product count:', error);
      return res.status(500).json({ error: 'Error fetching product count' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);
