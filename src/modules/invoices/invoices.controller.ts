import { Request, Response } from 'express';
import { invoicesService } from './invoices.service';
import { asyncHandler } from '@/middleware/errorHandler';
import { successResponse } from '@/utils/response';
import { getPaginationParams, getPaginationMeta } from '@/utils/pagination';

/**
 * Get all invoices
 */
export const getAllInvoices = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, projectId, status } = req.query;
  const pagination = getPaginationParams(page, limit);

  const [invoices, total] = await invoicesService.getAllInvoices(
    pagination.skip,
    pagination.limit,
    projectId as string,
    status as string
  );

  const meta = getPaginationMeta(pagination.page, pagination.limit, total);

  res.json(
    successResponse('Invoices fetched successfully', { invoices, meta })
  );
});

/**
 * Get invoice by ID
 */
export const getInvoiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const invoice = await invoicesService.getInvoiceById(id);

  res.json(successResponse('Invoice fetched successfully', invoice));
});

/**
 * Create invoice
 */
export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.user!.id;

  const invoice = await invoicesService.createInvoice(userId, data);

  res.status(201).json(
    successResponse('Invoice created successfully', invoice, 201)
  );
});

/**
 * Update invoice
 */
export const updateInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const invoice = await invoicesService.updateInvoice(id, data);

  res.json(successResponse('Invoice updated successfully', invoice));
});

/**
 * Record payment receipt
 */
export const recordPayment = asyncHandler(async (req: Request, res: Response) => {
  const { invoiceId } = req.params;
  const data = req.body;

  const receipt = await invoicesService.recordPayment(invoiceId, data);

  res.status(201).json(
    successResponse('Payment recorded successfully', receipt, 201)
  );
});
