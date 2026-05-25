import { prisma } from '@/config/database';
import { NotFoundError, ConflictError } from '@/utils/errors';
import { CreateProjectRequest, UpdateProjectRequest, ProjectResponse } from './projects.types';

class ProjectsService {
  /**
   * Get all projects
   */
  async getAllProjects(
    skip: number,
    take: number,
    clientId?: string,
    status?: string
  ): Promise<[ProjectResponse[], number]> {
    const where: any = {};

    if (clientId) where.clientId = clientId;
    if (status) where.status = status;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take,
        select: this.getProjectSelect(),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    return [projects as ProjectResponse[], total];
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId: string): Promise<ProjectResponse> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: this.getProjectSelect(),
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project as ProjectResponse;
  }

  /**
   * Create project
   */
  async createProject(
    userId: string,
    data: CreateProjectRequest
  ): Promise<ProjectResponse> {
    // Verify client exists
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        clientId: data.clientId,
        userId,
        name: data.name,
        description: data.description,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        parcelSize: data.parcelSize,
        parcelRef: data.parcelRef,
        budget: data.budget ? BigInt(Math.round(data.budget * 100)) / BigInt(100) : null,
      },
      select: this.getProjectSelect(),
    });

    return project as ProjectResponse;
  }

  /**
   * Update project
   */
  async updateProject(
    projectId: string,
    data: UpdateProjectRequest
  ): Promise<ProjectResponse> {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...data,
        budget: data.budget ? BigInt(Math.round(data.budget * 100)) / BigInt(100) : undefined,
      },
      select: this.getProjectSelect(),
    });

    return updatedProject as ProjectResponse;
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string): Promise<void> {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Delete project
    await prisma.project.delete({
      where: { id: projectId },
    });
  }

  /**
   * Get project select fields
   */
  private getProjectSelect() {
    return {
      id: true,
      clientId: true,
      userId: true,
      name: true,
      description: true,
      location: true,
      latitude: true,
      longitude: true,
      parcelSize: true,
      parcelRef: true,
      status: true,
      startDate: true,
      expectedEnd: true,
      actualEnd: true,
      budget: true,
      spent: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}

export const projectsService = new ProjectsService();
