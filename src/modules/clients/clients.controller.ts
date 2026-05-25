import { Request, Response } from 'express';
import { clientsService } from './clients.service';
import { asyncHandler } from '@/middleware/errorHandler';
import { successResponse } from '@/utils/response';
import { getPaginationParams, getPaginationMeta } from '@/utils/pagination';

/**
 * Get all clients
 */
export const getAllClients = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search } = req.query;
  const pagination = getPaginationParams(page, limit);

  const [clients, total] = await clientsService.getAllClients(
    pagination.skip,
    pagination.limit,
    search as string
  );

  const meta = getPaginationMeta(pagination.page, pagination.limit, total);

  res.json(
    successResponse('Clients fetched successfully', { clients, meta })
  );
});

/**
 * Get client by ID
 */
export const getClientById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const client = await clientsService.getClientById(id);

  res.json(successResponse('Client fetched successfully', client));
});

/**
 * Create client
 */
export const createClient = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.user!.id;

  const client = await clientsService.createClient(userId, data);

  res.status(201).json(
    successResponse('Client created successfully', client, 201)
  );
});

/**
 * Update client
 */
export const updateClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const userId = req.user!.id;

  const client = await clientsService.updateClient(id, userId, data);

  res.json(successResponse('Client updated successfully', client));
});

/**
 * Delete client
 */
export const deleteClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  await clientsService.deleteClient(id, userId);

  res.json(successResponse('Client deleted successfully'));
});
