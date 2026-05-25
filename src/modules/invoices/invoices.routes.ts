import { Router } from 'express';
import * as invoicesController from './invoices.controller';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// All invoices routes require authentication
router.use(authMiddleware);

/**
 * GET /api/invoices
 * Get all invoices with filtering and pagination
 */
router.get('/', invoicesController.getAllInvoices);

/**
 * POST /api/invoices
 * Create new invoice
 */
router.post('/', invoicesController.createInvoice);

/**
 * GET /api/invoices/:id
 * Get invoice by ID
 */
router.get('/:id', invoicesController.getInvoiceById);

/**
 * PUT /api/invoices/:id
 * Update invoice
 */
router.put('/:id', invoicesController.updateInvoice);

/**
 * POST /api/invoices/:invoiceId/payment
 * Record payment for invoice
 */
router.post('/:invoiceId/payment', invoicesController.recordPayment);

export const invoicesRoutes = router;
