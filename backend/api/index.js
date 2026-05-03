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

// Debug endpoint
app.get('/debug', (req, res) => {
  res.status(200).json({ 
    env: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI ? 'Set' : 'Not set',
    jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set'
  });
});

// Test endpoint without database
app.get('/test', (req, res) => {
  res.status(200).json({ 
    message: 'Serverless function is working',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
});

// Test login endpoint without database
app.post('/test-login', (req, res) => {
  console.log('Test login request body:', req.body);
  res.status(200).json({ 
    message: 'Test login endpoint working',
    received: req.body,
    timestamp: new Date().toISOString()
  });
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
module.exports = async (req, res) => {
  console.log('Request received:', req.method, req.url);
  
  try {
    // Ensure database is connected before handling request
    await connectDB();
    app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    
    // Handle specific database timeout errors
    if (error.message.includes('timeout') || error.message.includes('timed out')) {
      res.status(503).json({ 
        success: false, 
        message: 'Database connection timeout. Please try again.' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Server error: ' + error.message 
      });
    }
  }
};
