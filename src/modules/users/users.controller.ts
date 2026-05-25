import { Request, Response } from 'express';
import { usersService } from './users.service';
import { asyncHandler } from '@/middleware/errorHandler';
import { successResponse, errorResponse } from '@/utils/response';
import { getPaginationParams, getPaginationMeta } from '@/utils/pagination';

/**
 * Get all users (admin only)
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const pagination = getPaginationParams(page, limit);

  const [users, total] = await usersService.getAllUsers(pagination.skip, pagination.limit);

  const meta = getPaginationMeta(pagination.page, pagination.limit, total);

  res.json(
    successResponse('Users fetched successfully', { users, meta })
  );
});

/**
 * Get user by ID (admin only)
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await usersService.getUserById(id);

  res.json(successResponse('User fetched successfully', user));
});

/**
 * Create user (admin only)
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;

  const user = await usersService.createUser(data);

  res.status(201).json(
    successResponse('User created successfully', user, 201)
  );
});

/**
 * Update user (admin only)
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const user = await usersService.updateUser(id, data);

  res.json(successResponse('User updated successfully', user));
});

/**
 * Delete user (admin only)
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await usersService.deleteUser(id);

  res.json(successResponse('User deleted successfully'));
});
