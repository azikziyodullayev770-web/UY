const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
if (process.env.MONGO_URI) {
  connectDB();
}

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
