import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db';
let isConnected = false;

const startServer = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
        console.log('Connected to MongoDB');
        isConnected = true;
    } catch (err) {
        console.error('MongoDB connection error (Starting in OFFLINE mode):', err.message);
        console.log('💡 TIP: Make sure MongoDB is running or set MONGODB_URI in .env');
        isConnected = false;
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Mode: ${isConnected ? 'ONLINE (MongoDB)' : 'OFFLINE (Mock Data)'}`);
    });
};

startServer();

export { isConnected };
