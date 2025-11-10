// In pages/api/admin/login.js
import connectDb from '../../../middleware/mongoose';
import Admin from '../../../models/Admin';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    try {
      // Find admin by email
      const admin = await Admin.findOne({ email });
      
      if (!admin) {
        console.log('Admin not found for email:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, admin.password);
      console.log('Password match:', isMatch);
      
      if (!isMatch) {
        console.log('Invalid password for admin:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign(
        { adminId: admin._id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      console.log('Login successful for admin:', email);
      res.status(200).json({ 
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);