const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const prisma = require('./config/prisma');

const server = app.listen(env.PORT, () => {
  logger.logger.info(`Backend API is running on port ${env.PORT}`);
});

const shutdown = (signal) => {
  logger.logger.info(`Received ${signal}. Closing server...`);

  server.close(() => {
    prisma.$disconnect().then(
      () => {
        logger.logger.info('Prisma disconnected');
        process.exit(0);
      },
      (error) => {
        logger.logger.error({ err: error }, 'Failed to disconnect Prisma');
        process.exit(1);
      },
    );
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
