// pages/api/users/count.js
import connectDb from '../../../../middleware/mongoose';
import User from '../../../../models/User';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const count = await User.countDocuments();
      return res.status(200).json({ count });
    } catch (error) {
      console.error('Error fetching user count:', error);
      return res.status(500).json({ error: 'Error fetching user count' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);
