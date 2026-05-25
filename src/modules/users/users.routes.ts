import { Router } from 'express';
import * as usersController from './users.controller';
import { authMiddleware, adminMiddleware } from '@/middleware/auth';
import { validators, handleValidationErrors } from '@/utils/validators';

const router = Router();

// All users routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

/**
 * GET /api/users
 * Get all users (admin only)
 */
router.get('/', usersController.getAllUsers);

/**
 * POST /api/users
 * Create new user (admin only)
 */
router.post('/', validators.createUser, handleValidationErrors, usersController.createUser);

/**
 * GET /api/users/:id
 * Get user by ID (admin only)
 */
router.get('/:id', usersController.getUserById);

/**
 * PUT /api/users/:id
 * Update user (admin only)
 */
router.put('/:id', usersController.updateUser);

/**
 * DELETE /api/users/:id
 * Delete user (admin only)
 */
router.delete('/:id', usersController.deleteUser);

export const usersRoutes = router;
