import jwt from 'jsonwebtoken';

// Get JWT secret from environment or use a fallback
const JWT_SECRET = process.env.JWT_SECRET || 'AKoF52vMvHyD4+JlhqFtXGRK1hqpTV+Ca4DMdltbik8=';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (userId: string): string => {
  return jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error);
    throw new Error('Invalid or expired token');
  }
};