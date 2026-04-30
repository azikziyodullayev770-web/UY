const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
if (process.env.MONGO_URI) {
  connectDB();
}

const app = express();

// Security Headers
app.use(helmet());

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20, // 20 requests per IP
  message: { success: false, error: 'Too many auth requests from this IP, please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // 100 requests per IP for general endpoints
});

// Body parser with size limit to prevent DOS
app.use(express.json({ limit: '10kb' }));

// Strict CORS Setup
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CORS_ORIGIN] 
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');

// Mount routers
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/listings', apiLimiter, listingRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('API is running');
});

// Error Handler Middleware
const errorHandler = require('./middleware/error');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
