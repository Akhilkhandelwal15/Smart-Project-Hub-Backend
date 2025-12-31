import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 3000;

dotenv.config();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(cookieParser());

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(()=> console.log("MongoDB connected"))
  .catch((error)=>console.log(error));

// routes
app.use('/api/auth', authRoutes);
app.get('/', (req, res)=>{
  res.send('Server is running.');
});

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});