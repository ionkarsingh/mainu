const express = require('express')
const cors = require('cors')
const connectDB = require('../utils/conn')

const app = express()

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/student', require('../routes/studentRoutes'));
app.use('/api/admin', require('../routes/adminRoutes'));
app.use('/api/complaint', require('../routes/complaintRoutes'));
app.use('/api/invoice', require('../routes/invoiceRoutes'));
app.use('/api/messoff', require('../routes/messoffRoutes'));
app.use('/api/request', require('../routes/requestRoutes'));
app.use('/api/attendance', require('../routes/attendanceRoutes'));
app.use('/api/suggestion', require('../routes/suggestionRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack 
  });
});

// Export for Vercel serverless function
module.exports = (req, res) => {
  console.log('Request received:', req.method, req.url);
  app(req, res);
};
