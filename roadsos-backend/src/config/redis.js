const Redis = require('ioredis');
const env = require('./env');
const logger = require('../utils/logger');

let client;

function createRedisClient() {
  const redis = new Redis(env.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      return Math.min(times * 200, 2000);
    }
  });
  redis.on('error', (error) => logger.warn('Redis connection issue', { message: error.message }));
  return redis;
}

function getRedisClient() {
  if (!client) {
    client = createRedisClient();
  }
  return client;
}

async function connectRedis() {
  const redis = getRedisClient();
  try {
    // Try to ping with a 2-second timeout
    await Promise.race([
      redis.ping(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connection timeout')), 2000))
    ]);
    logger.info('Redis connected');
  } catch (error) {
    logger.warn('Redis not available - background tasks (queues) will be disabled', { error: error.message });
  }
  return redis;
}

function duplicateRedisClient() {
  return getRedisClient().duplicate();
}

module.exports = { connectRedis, getRedisClient, duplicateRedisClient, createRedisClient };
