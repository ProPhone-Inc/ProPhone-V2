import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { User } from '../models/User';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = verifyToken(token);
    const user = await User.findOne({ _id: (decoded as any)._id })
      .populate('parentUser', 'name email role');

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
    res.status(401).send({ error: 'Please authenticate' });
  }
};