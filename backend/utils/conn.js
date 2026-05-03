const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        // Close existing connection if it's in a bad state
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 3000, // Faster timeout for serverless
            socketTimeoutMS: 30000, // Shorter socket timeout
            bufferMaxEntries: 0, // Disable mongoose buffering completely
            bufferCommands: false, // Disable mongoose buffering
            maxPoolSize: 5, // Smaller pool for serverless
            minPoolSize: 0, // Allow pool to shrink to 0
            maxIdleTimeMS: 30000, // Close idle connections after 30s
            waitQueueTimeoutMS: 5000, // Timeout for waiting operations
        });
        
        isConnected = true;
        console.log('MongoDB connection SUCCESS');
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            isConnected = false;
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });
        
    } catch (error) {
        console.error('MongoDB connection FAIL:', error.message);
        isConnected = false;
        throw error;
    }
};

module.exports = connectDB;