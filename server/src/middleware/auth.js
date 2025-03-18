import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log(`Token received in request: ${token.substring(0, 10)}...`);
    }

    // Check if token exists
    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Token verified for user ID: ${decoded.id}`);

      // Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        console.log(`User ID ${decoded.id} from token not found in database`);
        return res.status(401).json({
          status: 'fail',
          message: 'The user belonging to this token no longer exists.'
        });
      }

      // Grant access to protected route
      req.user = currentUser;
      console.log(`Access granted to ${currentUser.name} (${currentUser.role})`);
      next();
    } catch (verifyError) {
      console.error('Token verification error:', verifyError.message);
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(401).json({
      status: 'fail',
      message: 'Authentication failed'
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(`Access denied for user ${req.user.name} with role ${req.user.role}. Required roles: ${roles.join(', ')}`);
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    
    console.log(`Role-based access granted to ${req.user.name} (${req.user.role})`);
    next();
  };
};
