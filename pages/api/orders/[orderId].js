import dbConnect from '../../../middleware/mongoose';
import Order from '../../../models/Order';
import { verifyToken } from '../../../utils/jwt';

// In [orderId].js
export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  
    try {
      // Verify authentication
      const token = req.headers.authorization?.split(' ')[1];
      console.log('Authorization header:', req.headers.authorization); // Debug log
      console.log('Token:', token); // Debug log
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }
  
      const decoded = verifyToken(token);
      console.log('Decoded token:', decoded); // Debug log
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const { orderId } = req.query;
      console.log('Requested orderId:', orderId); // Debug log
  
      if (!orderId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Order ID is required',
          query: req.query // Debug information
        });
      }
  
      // Connect to database
      await dbConnect();
  
      // Find the order
      const order = await Order.findOne({ 
        orderId: orderId,
        userId: decoded.userId 
      }).populate('items.product');
  
      console.log('Found order:', order); // Debug log
  
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found',
          query: orderId // Debug information
        });
      }
  
      res.status(200).json({ 
        success: true, 
        order 
      });
  
    } catch (error) {
      console.error('Error in order API:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching order details',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }