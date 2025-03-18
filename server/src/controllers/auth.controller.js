import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, secret_admin_key } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email'
      });
    }

    // Create user data object
    const userData = {
      name,
      email,
      password
    };
    
    // Check if secret admin key is provided and correct (REMOVE THIS IN PRODUCTION)
    // This is a temporary solution - use a strong secret key
    if (secret_admin_key === 'your_secure_secret_key_123!') {
      userData.role = 'admin';
      console.log('Admin account creation attempted');
    }

    // Create new user
    const user = await User.create(userData);

    // Generate token
    const token = signToken(user._id);

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
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Generate token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    console.log(`User logged in: ${user.name}, role: ${user.role}, id: ${user._id}`);

    res.status(200).json({
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
};

export const getMe = async (req, res) => {
  try {
    console.log(`getMe called for user ID: ${req.user._id}`);
    
    // Get fresh user data from database
    const user = await User.findById(req.user._id);

    if (!user) {
      console.log(`User ID ${req.user._id} not found in database`);
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    console.log(`User data retrieved: ${user.name}, role: ${user.role}`);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
