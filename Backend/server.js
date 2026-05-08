const http = require('http');
const app = require('./src/app');
const env = require('./src/config/env');
const loadApp = require('./src/loaders');
const logger = require('./src/utils/logger');

const server = http.createServer(app);

loadApp({ httpServer: server })
  .then(() => {
    server.listen(env.port, () => logger.info('RoadSoS backend listening', { port: env.port }));
  })
  .catch((error) => {
    logger.error('Failed to start RoadSoS backend', { message: error.message, stack: error.stack });
    process.exit(1);
  });

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: reason instanceof Error ? reason.message : reason });
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { message: error.message, stack: error.stack });
  process.exit(1);
});
