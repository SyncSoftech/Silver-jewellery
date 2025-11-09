import connectDB from '../../../middleware/mongoose';
import Address from '../../../models/Address';
import { verifyToken } from '../../../utils/jwt';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    // Get all addresses for the authenticated user
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const addresses = await Address.find({ user: decoded.userId });
      res.status(200).json({ success: true, addresses });
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch addresses' });
    }
  } else if (req.method === 'POST') {
    // Create a new address
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { 
        fullName, 
        phone, 
        street, 
        city, 
        state, 
        country, 
        postalCode, 
        landmark, 
        addressType, 
        isDefault 
      } = req.body;

      // Validate required fields
      if (!fullName || !phone || !street || !city || !state || !postalCode) {
        return res.status(400).json({ 
          success: false, 
          error: 'Please provide all required fields' 
        });
      }

      // If setting as default, unset default for other addresses
      if (isDefault) {
        await Address.updateMany(
          { user: decoded.userId, isDefault: true },
          { $set: { isDefault: false } }
        );
      }

      const address = new Address({
        user: decoded.userId,
        fullName,
        phone,
        street,
        city,
        state,
        country,
        postalCode,
        landmark,
        addressType: addressType || 'shipping',
        isDefault: isDefault || false
      });

      await address.save();
      res.status(201).json({ success: true, address });
    } catch (error) {
      console.error('Error saving address:', error);
      res.status(500).json({ success: false, error: 'Failed to save address' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
};

export default connectDB(handler);
