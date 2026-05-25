import { Request, Response } from 'express';
import { expensesService } from './expenses.service';
import { asyncHandler } from '@/middleware/errorHandler';
import { successResponse } from '@/utils/response';
import { getPaginationParams, getPaginationMeta } from '@/utils/pagination';

/**
 * Get all expenses
 */
export const getAllExpenses = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, projectId, category, status } = req.query;
  const pagination = getPaginationParams(page, limit);

  const [expenses, total] = await expensesService.getAllExpenses(
    pagination.skip,
    pagination.limit,
    projectId as string,
    category as string,
    status as string
  );

  const meta = getPaginationMeta(pagination.page, pagination.limit, total);

  res.json(
    successResponse('Expenses fetched successfully', { expenses, meta })
  );
});

/**
 * Get expense by ID
 */
export const getExpenseById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const expense = await expensesService.getExpenseById(id);

  res.json(successResponse('Expense fetched successfully', expense));
});

/**
 * Create expense
 */
export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.user!.id;

  const expense = await expensesService.createExpense(userId, data);

  res.status(201).json(
    successResponse('Expense created successfully', expense, 201)
  );
});

/**
 * Update expense
 */
export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const expense = await expensesService.updateExpense(id, data);

  res.json(successResponse('Expense updated successfully', expense));
});

/**
 * Delete expense
 */
export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await expensesService.deleteExpense(id);

  res.json(successResponse('Expense deleted successfully'));
});

/**
 * Get project expenses summary
 */
export const getProjectSummary = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  const summary = await expensesService.getProjectExpensesSummary(projectId);

  res.json(successResponse('Project expenses summary', summary));
});
