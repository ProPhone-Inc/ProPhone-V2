import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cluster from 'cluster';
import os from 'os';
import { auth } from './middleware/auth';
import { generateToken } from './config/jwt';
import { User } from './models/User';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

// Performance optimizations
const POOL_SIZE = process.env.NODE_ENV === 'production' ? 5 : 10;
const SOCKET_TIMEOUT = 30000;
const CONNECT_TIMEOUT = 10000;

// Only fork in production
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  transports: ['websocket']
});
  
// Connect to MongoDB
const connectDB = async () => {
  try {
    // Create MongoDB native client for direct operations
    const client = new MongoClient(process.env.MONGODB_URI!, {
      maxPoolSize: POOL_SIZE,
      minPoolSize: 1,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      compressors: 'zlib',
      connectTimeoutMS: CONNECT_TIMEOUT,
      socketTimeoutMS: SOCKET_TIMEOUT
    });
    
    await client.connect();
    console.log('✨ MongoDB Native Driver connected');
    
    // Connect Mongoose
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: SOCKET_TIMEOUT,
      maxPoolSize: POOL_SIZE,
      minPoolSize: 1,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      compressors: 'zlib',
      autoIndex: false,
      bufferCommands: false,
      family: 4 // Force IPv4
    });
    console.log('✨ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err);
    // Retry connection instead of exiting
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Atlas disconnected! Attempting to reconnect...');
  connectDB();
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB Atlas connection closed');
  process.exit(0);
});

  // Middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"]
      }
    }
  }));
  
  app.use(compression({
    level: 6,
    threshold: 0,
    filter: () => true
  }));
  
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // Cache preflight requests for 24 hours
  }));

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Logging
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('tiny', {
      skip: (req, res) => res.statusCode < 400
    }));
  } else {
    app.use(morgan('dev'));
  }

  // Auth Routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = new User({ email, password, name });
      await user.save();

      const token = generateToken(user._id.toString());
      res.status(201).json({ user, token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user._id.toString());

      // Update last login
      await User.findByIdAndUpdate(user._id, 
        { lastLogin: new Date() },
        { new: true }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({ user: userResponse, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Protected Routes
  app.get('/api/user/profile', auth, async (req: any, res: Response) => {
    try {
      const user = await User.findById(req.user._id).select('-password').lean();
      res.json(user);
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.put('/api/user/profile', auth, async (req: any, res: Response) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['name', 'email', 'password'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).select('-password');

      res.json(user);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Update failed' });
    }
  });

  // Team Routes
  app.get('/api/team/members', auth, async (req: any, res: Response) => {
    try {
      const users = await User.find()
        .select('-password')
        .lean()
        .exec();
      res.json(users);
    } catch (error) {
      console.error('Team members fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  });

  // Graceful shutdown
  const gracefulShutdown = async () => {
    console.log(`🛑 Worker ${process.pid} shutting down...`);
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  // Start server
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`✨ Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    
    // Signal ready to PM2
    if (process.send) {
      process.send('ready');
    }
  });