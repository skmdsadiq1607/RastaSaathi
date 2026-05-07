const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

let connectionPromise;

async function connectDb(uri = env.mongodbUri) {
  if (!connectionPromise) {
    mongoose.set('strictQuery', true);
    connectionPromise = mongoose.connect(uri, {
      autoIndex: !env.isProduction,
      serverSelectionTimeoutMS: 10000
    });
  }
  const connection = await connectionPromise;
  logger.info('MongoDB connected', { database: connection.connection.name });
  return connection;
}

async function disconnectDb() {
  await mongoose.disconnect();
  connectionPromise = undefined;
}

module.exports = { connectDb, disconnectDb, mongoose };
