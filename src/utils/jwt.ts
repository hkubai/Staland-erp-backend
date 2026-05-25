import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

export interface JWTPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
}

/**
 * Generate JWT token
 * @param payload - Token payload
 * @param expiresIn - Token expiration time
 * @returns JWT token
 */
export const generateToken = (payload: JWTPayload, expiresIn?: string): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: expiresIn || config.jwt.expire,
  });
};

/**
 * Verify JWT token
 * @param token - JWT token
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode JWT token without verification
 * @param token - JWT token
 * @returns Decoded token payload
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};
