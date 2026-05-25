import { Router } from 'express';
import * as expensesController from './expenses.controller';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All expenses routes require authentication
router.use(authMiddleware);

/**
 * GET /api/expenses
 * Get all expenses with filtering and pagination
 */
router.get('/', expensesController.getAllExpenses);

/**
 * POST /api/expenses
 * Create new expense
 */
router.post('/', expensesController.createExpense);

/**
 * GET /api/expenses/:id
 * Get expense by ID
 */
router.get('/:id', expensesController.getExpenseById);

/**
 * PUT /api/expenses/:id
 * Update expense
 */
router.put('/:id', expensesController.updateExpense);

/**
 * DELETE /api/expenses/:id
 * Delete expense
 */
router.delete('/:id', expensesController.deleteExpense);

/**
 * GET /api/expenses/project/:projectId/summary
 * Get project expenses summary
 */
router.get('/project/:projectId/summary', expensesController.getProjectSummary);

export const expensesRoutes = router;
