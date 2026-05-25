import { prisma } from '@/config/database';
import { NotFoundError } from '@/utils/errors';
import {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ExpenseResponse,
} from './expenses.types';

class ExpensesService {
  /**
   * Get all expenses
   */
  async getAllExpenses(
    skip: number,
    take: number,
    projectId?: string,
    category?: string,
    status?: string
  ): Promise<[ExpenseResponse[], number]> {
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (category) where.category = category;
    if (status) where.status = status;

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take,
        select: this.getExpenseSelect(),
        orderBy: { date: 'desc' },
      }),
      prisma.expense.count({ where }),
    ]);

    return [expenses as ExpenseResponse[], total];
  }

  /**
   * Get expense by ID
   */
  async getExpenseById(expenseId: string): Promise<ExpenseResponse> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: this.getExpenseSelect(),
    });

    if (!expense) {
      throw new NotFoundError('Expense not found');
    }

    return expense as ExpenseResponse;
  }

  /**
   * Create expense
   */
  async createExpense(
    userId: string,
    data: CreateExpenseRequest
  ): Promise<ExpenseResponse> {
    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const expense = await prisma.expense.create({
      data: {
        projectId: data.projectId,
        userId,
        category: data.category,
        description: data.description,
        amount: data.amount,
        vendor: data.vendor,
        date: data.date,
        receiptUrl: data.receiptUrl,
        notes: data.notes,
      },
      select: this.getExpenseSelect(),
    });

    return expense as ExpenseResponse;
  }

  /**
   * Update expense
   */
  async updateExpense(
    expenseId: string,
    data: UpdateExpenseRequest
  ): Promise<ExpenseResponse> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      throw new NotFoundError('Expense not found');
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data,
      select: this.getExpenseSelect(),
    });

    return updatedExpense as ExpenseResponse;
  }

  /**
   * Delete expense
   */
  async deleteExpense(expenseId: string): Promise<void> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      throw new NotFoundError('Expense not found');
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });
  }

  /**
   * Get project expenses summary
   */
  async getProjectExpensesSummary(projectId: string): Promise<any> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const expenses = await prisma.expense.groupBy({
      by: ['category'],
      where: { projectId },
      _sum: { amount: true },
      _count: true,
    });

    const totalExpenses = await prisma.expense.aggregate({
      where: { projectId },
      _sum: { amount: true },
    });

    const byCategory: Record<string, any> = {};
    expenses.forEach((exp) => {
      byCategory[exp.category] = {
        total: exp._sum.amount || 0,
        count: exp._count,
      };
    });

    return {
      projectId,
      projectName: project.name,
      totalBudget: project.budget || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      remainingBudget: (project.budget || 0) - (totalExpenses._sum.amount || 0),
      byCategory,
    };
  }

  /**
   * Get expense select fields
   */
  private getExpenseSelect() {
    return {
      id: true,
      projectId: true,
      userId: true,
      category: true,
      description: true,
      amount: true,
      vendor: true,
      date: true,
      receiptUrl: true,
      status: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}

export const expensesService = new ExpensesService();
