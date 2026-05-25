import { Router } from 'express';
import * as projectsController from './projects.controller';
import { authMiddleware } from '@/middleware/auth';
import { validators, handleValidationErrors } from '@/utils/validators';

const router = Router();

// All projects routes require authentication
router.use(authMiddleware);

/**
 * GET /api/projects
 * Get all projects with filtering and pagination
 */
router.get('/', projectsController.getAllProjects);

/**
 * POST /api/projects
 * Create new project
 */
router.post('/', validators.createProject, handleValidationErrors, projectsController.createProject);

/**
 * GET /api/projects/:id
 * Get project by ID
 */
router.get('/:id', projectsController.getProjectById);

/**
 * PUT /api/projects/:id
 * Update project
 */
router.put('/:id', projectsController.updateProject);

/**
 * DELETE /api/projects/:id
 * Delete project
 */
router.delete('/:id', projectsController.deleteProject);

export const projectsRoutes = router;
