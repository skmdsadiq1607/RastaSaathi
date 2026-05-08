const { connectDb } = require('../config/db');

async function loadMongoose() {
  return connectDb();
}

module.exports = loadMongoose;
