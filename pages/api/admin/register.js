import connectDb from '../../../middleware/mongoose';
import Admin from '../../../models/Admin';
import bcrypt from 'bcryptjs';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, password, username, secretKey } = req.body;

    // Verify secret key (only for first-time admin creation)
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ error: 'Invalid secret key' });
    }

    try {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new admin
      const admin = new Admin({
        name,
        email,
        username,
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error creating admin' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default connectDb(handler);