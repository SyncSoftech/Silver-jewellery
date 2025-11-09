import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Map the token fields to the expected format
    return {
      userId: decoded.user, // Map 'user' to 'userId' for consistency
      ...decoded
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
