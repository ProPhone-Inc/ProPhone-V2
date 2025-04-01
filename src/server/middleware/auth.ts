import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { User } from '../models/User';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    let token = req.header('Authorization');
    
    // Check if token exists and has the Bearer prefix
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    } else {
      throw new Error('Invalid token format');
    }

    if (!token) {
      throw new Error();
    }

    const decoded = verifyToken(token);
    
    // Check if decoded contains the expected user ID
    if (!(decoded as any)._id) {
      throw new Error('Invalid token payload');
    }
    
    // Find user by ID
    const user = await User.findOne({ _id: (decoded as any)._id });

    if (!user) {
      throw new Error();
    }

    // Check if user is suspended or banned
    if (user.status === 'suspended' || user.status === 'banned') {
      throw new Error('Account is suspended or banned');
    }

    // For sub_users, verify parent user still exists and is active
    if (user.role === 'sub_user' && user.parentUser) {
      const parentUser = await User.findById(user.parentUser);
      if (!parentUser || parentUser.status !== 'active') {
        throw new Error('Parent account is inactive');
      }
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Please authenticate' });
  }
};