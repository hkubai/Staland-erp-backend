import { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '@/middleware/errorHandler';
import { successResponse, errorResponse } from '@/utils/response';
import { validators, handleValidationErrors } from '@/utils/validators';

/**
 * Register new user
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;

  const result = await authService.register({
    email,
    password,
    name,
    role: role || 'STAFF',
  });

  res.status(201).json(
    successResponse('Registration successful', result, 201)
  );
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  res.json(successResponse('Login successful', result, 200));
});

/**
 * Get current user
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json(errorResponse('Unauthorized', undefined, 401));
  }

  const user = await authService.getUserById(req.user.id);

  if (!user) {
    return res.status(404).json(errorResponse('User not found', undefined, 404));
  }

  res.json(successResponse('User fetched successfully', user));
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // In a real application, you might invalidate tokens here
  res.json(successResponse('Logout successful'));
});
