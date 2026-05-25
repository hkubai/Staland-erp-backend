import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from './response';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errorResponse('Validation failed', JSON.stringify(errors.array()), 400)
    );
  }
  next();
};

/**
 * Validation rules
 */
export const validators = {
  // Auth validators
  login: [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register: [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ],

  // User validators
  createUser: [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').isIn(['ADMIN', 'STAFF']).withMessage('Invalid role'),
  ],

  // Client validators
  createClient: [
    body('name').notEmpty().withMessage('Client name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').notEmpty().withMessage('Phone number is required'),
  ],
  updateClient: [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('phone').optional().notEmpty(),
  ],

  // Project validators
  createProject: [
    body('name').notEmpty().withMessage('Project name is required'),
    body('clientId').notEmpty().withMessage('Client ID is required'),
    body('location').notEmpty().withMessage('Location is required'),
  ],
};
