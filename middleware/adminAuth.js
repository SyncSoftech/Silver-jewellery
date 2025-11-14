import { verifyToken } from '../utils/jwt';

export default function adminAuth(handler) {
  return async (req, res) => {
    try {
      // Check for token in Authorization header
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ success: false, error: 'No authentication token provided' });
      }

      // Verify the token
      const decoded = verifyToken(token);
      
      // Check if user is admin
      if (!decoded || !decoded.role || decoded.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
      }

      // Token is valid and user is admin, proceed to the next handler
      return handler(req, res);
    } catch (error) {
      console.error('Admin auth error:', error);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired token',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
}
