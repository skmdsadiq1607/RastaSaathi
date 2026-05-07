const morgan = require('morgan');
const logger = require('../utils/logger');

const stream = { write: (message) => logger.http(message.trim()) };
const httpLogger = morgan('combined', { stream });

module.exports = { httpLogger };
