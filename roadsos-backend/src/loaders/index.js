const loadMongoose = require('./mongoose');
const loadRedis = require('./redis');
const loadQueues = require('./queues');
const loadSockets = require('./sockets');
const logger = require('../utils/logger');

async function loadApp({ httpServer }) {
  await loadMongoose();
  await loadRedis();
  await loadQueues();
  await loadSockets(httpServer);
  logger.info('RoadSoS backend loaded');
}

module.exports = loadApp;
