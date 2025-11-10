// pages/api/admin/users/index.js
import connectDb from '../../../../middleware/mongoose';
import User from '../../../../models/User';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const users = await User.find({}).select('-password');
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);