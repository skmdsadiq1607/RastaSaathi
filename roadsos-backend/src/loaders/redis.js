const { connectRedis } = require('../config/redis');

async function loadRedis() {
  return connectRedis();
}

module.exports = loadRedis;
