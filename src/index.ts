import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    const port = config.port;
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
      console.log(`Environment: ${config.env}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
