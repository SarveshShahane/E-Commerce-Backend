import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: "24h" } 
  );
};

process.env.JWT_SECRET = 'test-secret-key';

describe('Auth Token Tests', () => {
  describe('generateToken', () => {
    test('should generate a valid JWT token', () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'buyer'
      };

      const token = generateToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(user._id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe(user.role);
    });

    test('should generate different tokens for different users', () => {
      const user1 = {
        _id: '507f1f77bcf86cd799439011',
        email: 'user1@example.com',
        role: 'buyer'
      };

      const user2 = {
        _id: '507f1f77bcf86cd799439012',
        email: 'user2@example.com',
        role: 'seller'
      };

      const token1 = generateToken(user1);
      const token2 = generateToken(user2);

      expect(token1).not.toBe(token2);
    });
  });
});
