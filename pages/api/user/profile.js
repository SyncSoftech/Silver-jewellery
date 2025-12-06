import connectDB from '../../../middleware/mongoose';
import User from '../../../models/User';
import { verifyToken } from '../../../utils/jwt';

const handler = async (req, res) => {
  if (!['GET', 'PUT'].includes(req.method)) {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }

  const token = req.headers.authorization?.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized: invalid or expired token' });
  }

  try {
    if (req.method === 'GET') {
      const user = await User.findById(decoded.userId).select('-password -resetToken -resetTokenExpiry');

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }

    if (req.method === 'PUT') {
      const { name, email } = req.body || {};

      if (!name && !email) {
        return res.status(400).json({ success: false, error: 'Nothing to update' });
      }

      const updateFields = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;

      const updatedUser = await User.findByIdAndUpdate(
        decoded.userId,
        { $set: updateFields },
        { new: true, runValidators: true, select: '-password -resetToken -resetTokenExpiry' }
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.status(200).json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      });
    }
  } catch (error) {
    console.error('Error handling user profile request:', error);
    return res.status(500).json({ success: false, error: 'Failed to process user profile request' });
  }
};

export default connectDB(handler);
