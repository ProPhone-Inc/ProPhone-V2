import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { auth } from './middleware/auth';
import { User } from './models/User';

dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP & WebSocket Server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN || true : true,
    credentials: true
  },
  transports: ['websocket']
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// MongoDB Connection
const mongooseOptions: ConnectOptions = {
  serverSelectionTimeoutMS: 60000,
  connectTimeoutMS: 60000,
  socketTimeoutMS: 60000,
  maxPoolSize: 50,
  retryWrites: true,
  retryReads: true,
  authSource: 'admin',
  w: 'majority' as any
};

mongoose
  .connect(process.env.MONGODB_URI as string, mongooseOptions)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// API Routes
const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newUser = new User({ email, name, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};
app.post('/api/auth/register', registerHandler);

const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};
app.post('/api/auth/login', loginHandler);

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('✅ New WebSocket Connection:', socket.id);
  socket.on('disconnect', () => console.log('❌ WebSocket Disconnected:', socket.id));
});

// Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
