import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    // Allow any origin in development
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://job-finder-lyart.vercel.app',
      // Add your production frontend URL here if different
    ];
    
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Origin rejected by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request/response logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - Authorization: ${req.headers.authorization ? 'Provided' : 'None'}`);
  
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`Response for ${req.method} ${req.originalUrl}: ${res.statusCode}`);
    return originalSend.call(this, data);
  };
  next();
});

// Set up static file serving for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
}

// Use MONGODB_URI from env if available, otherwise use mongoURI
const mongoURI = process.env.MONGODB_URI || process.env.mongoURI;
if (!mongoURI) {
  throw new Error("MongoDB connection URI is not defined");
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Job Portal API' });
});

// Add diagnostic route for debugging
app.get('/api/check-auth', (req, res) => {
  const authHeader = req.headers.authorization;
  res.json({
    authHeader: authHeader ? 'Provided' : 'Missing',
    format: authHeader?.startsWith('Bearer ') ? 'Valid' : 'Invalid',
    token: authHeader?.split(' ')[1]?.substring(0, 10) + '...' || 'None'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for: http://localhost:5173, http://localhost:3000, https://job-finder-lyart.vercel.app`);
});

