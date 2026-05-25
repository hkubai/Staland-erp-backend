import { Router } from 'express';
import * as clientsController from './clients.controller';
import { authMiddleware } from '@/middleware/auth';
import { validators, handleValidationErrors } from '@/utils/validators';

const router = Router();

// All clients routes require authentication
router.use(authMiddleware);

/**
 * GET /api/clients
 * Get all clients with pagination and search
 */
router.get('/', clientsController.getAllClients);

/**
 * POST /api/clients
 * Create new client
 */
router.post('/', validators.createClient, handleValidationErrors, clientsController.createClient);

/**
 * GET /api/clients/:id
 * Get client by ID
 */
router.get('/:id', clientsController.getClientById);

/**
 * PUT /api/clients/:id
 * Update client
 */
router.put('/:id', validators.updateClient, handleValidationErrors, clientsController.updateClient);

/**
 * DELETE /api/clients/:id
 * Delete client
 */
router.delete('/:id', clientsController.deleteClient);

export const clientsRoutes = router;
