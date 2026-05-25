import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from '@/config/env';
import { prisma } from '@/config/database';
import { loggerMiddleware } from '@/middleware/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { authRoutes } from '@/modules/auth/auth.routes';
import { usersRoutes } from '@/modules/users/users.routes';
import { clientsRoutes } from '@/modules/clients/clients.routes';
import { successResponse } from '@/utils/response';

const app: Express = express();

// Middleware
app.use(cors({ origin: config.cors.origin }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(loggerMiddleware);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json(successResponse('Server is running'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/clients', clientsRoutes);

// Not found handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    statusCode: 404,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
