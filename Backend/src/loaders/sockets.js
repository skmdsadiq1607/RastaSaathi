const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const env = require('../config/env');
const { duplicateRedisClient } = require('../config/redis');
const { setIO } = require('../config/socket');
const registerSockets = require('../sockets');
const logger = require('../utils/logger');

async function loadSockets(httpServer) {
  const io = new Server(httpServer, { cors: { origin: env.frontendUrl, credentials: true } });
  try {
    const pubClient = duplicateRedisClient();
    const subClient = duplicateRedisClient();
    io.adapter(createAdapter(pubClient, subClient));
  } catch (error) {
    logger.warn('Socket Redis adapter unavailable', { message: error.message });
  }
  setIO(io);
  registerSockets(io);
  logger.info('Socket.IO namespaces registered');
  return io;
}

module.exports = loadSockets;
