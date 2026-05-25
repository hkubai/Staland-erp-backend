import { prisma } from '@/config/database';
import { NotFoundError, ForbiddenError, ConflictError } from '@/utils/errors';
import { CreateClientRequest, UpdateClientRequest, ClientResponse } from './clients.types';

class ClientsService {
  /**
   * Get all clients
   */
  async getAllClients(
    skip: number,
    take: number,
    search?: string
  ): Promise<[ClientResponse[], number]> {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take,
        select: this.getClientSelect(),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.client.count({ where }),
    ]);

    return [clients as ClientResponse[], total];
  }

  /**
   * Get client by ID
   */
  async getClientById(clientId: string): Promise<ClientResponse> {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: this.getClientSelect(),
    });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    return client as ClientResponse;
  }

  /**
   * Create client
   */
  async createClient(
    userId: string,
    data: CreateClientRequest
  ): Promise<ClientResponse> {
    // Check if client email already exists
    const existingClient = await prisma.client.findFirst({
      where: { email: data.email },
    });

    if (existingClient) {
      throw new ConflictError('Client with this email already exists');
    }

    // Create client
    const client = await prisma.client.create({
      data: {
        userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        county: data.county,
        kraPin: data.kraPin,
        idNumber: data.idNumber,
        notes: data.notes,
      },
      select: this.getClientSelect(),
    });

    return client as ClientResponse;
  }

  /**
   * Update client
   */
  async updateClient(
    clientId: string,
    userId: string,
    data: UpdateClientRequest
  ): Promise<ClientResponse> {
    // Check if client exists and belongs to user
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    // Check if email is being changed and if it's unique
    if (data.email && data.email !== client.email) {
      const existingClient = await prisma.client.findFirst({
        where: { email: data.email },
      });
      if (existingClient) {
        throw new ConflictError('Email already in use');
      }
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data,
      select: this.getClientSelect(),
    });

    return updatedClient as ClientResponse;
  }

  /**
   * Delete client
   */
  async deleteClient(clientId: string): Promise<void> {
    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    // Delete client
    await prisma.client.delete({
      where: { id: clientId },
    });
  }

  /**
   * Get client select fields
   */
  private getClientSelect() {
    return {
      id: true,
      userId: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      county: true,
      kraPin: true,
      idNumber: true,
      idCopyUrl: true,
      kraPin2Url: true,
      titleDeedsUrl: true,
      active: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}

export const clientsService = new ClientsService();
