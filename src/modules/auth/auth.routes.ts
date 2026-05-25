import { Router } from 'express';
import * as authController from './auth.controller';
import { authMiddleware } from '@/middleware/auth';
import { validators, handleValidationErrors } from '@/utils/validators';

const router = Router();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', validators.register, handleValidationErrors, authController.register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', validators.login, handleValidationErrors, authController.login);

/**
 * GET /api/auth/me
 * Get current user (protected route)
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authMiddleware, authController.logout);

export const authRoutes = router;
