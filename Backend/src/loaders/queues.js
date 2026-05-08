const queues = require('../queues');
const eventBus = require('../events');
const logger = require('../utils/logger');

async function loadQueues() {
  queues.registerProcessors();
  eventBus.register();
  logger.info('Bull queues and domain events registered');
  return queues;
}

module.exports = loadQueues;
