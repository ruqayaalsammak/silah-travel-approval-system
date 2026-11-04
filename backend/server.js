import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import travelRoutes from './routes/travelRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/travel', travelRoutes);

// Database Connection & Server Listener
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/silah_travel_db')
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));