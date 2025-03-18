import express from 'express';
import { login, register, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// TEMPORARY ROUTE: Create admin account - REMOVE AFTER CREATING ADMIN
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Import User model
    const User = (await import('../models/User.js')).default;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email'
      });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'  // Set role as admin
    });

    // Generate token (reuse the function from auth controller)
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

export default router;
