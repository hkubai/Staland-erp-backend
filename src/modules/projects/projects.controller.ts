import { Request, Response } from 'express';
import { projectsService } from './projects.service';
import { asyncHandler } from '@/middleware/errorHandler';
import { successResponse } from '@/utils/response';
import { getPaginationParams, getPaginationMeta } from '@/utils/pagination';

/**
 * Get all projects
 */
export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, clientId, status } = req.query;
  const pagination = getPaginationParams(page, limit);

  const [projects, total] = await projectsService.getAllProjects(
    pagination.skip,
    pagination.limit,
    clientId as string,
    status as string
  );

  const meta = getPaginationMeta(pagination.page, pagination.limit, total);

  res.json(
    successResponse('Projects fetched successfully', { projects, meta })
  );
});

/**
 * Get project by ID
 */
export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await projectsService.getProjectById(id);

  res.json(successResponse('Project fetched successfully', project));
});

/**
 * Create project
 */
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.user!.id;

  const project = await projectsService.createProject(userId, data);

  res.status(201).json(
    successResponse('Project created successfully', project, 201)
  );
});

/**
 * Update project
 */
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const project = await projectsService.updateProject(id, data);

  res.json(successResponse('Project updated successfully', project));
});

/**
 * Delete project
 */
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await projectsService.deleteProject(id);

  res.json(successResponse('Project deleted successfully'));
});
