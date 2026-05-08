const env = require('../config/env');
const logger = require('../utils/logger');
const { AppError, formatError } = require('../utils/responseFormatter');

function notFound(req, _res, next) {
  next(new AppError('Route not found: ' + req.originalUrl, 404, 'ROUTE_NOT_FOUND'));
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const operational = error.isOperational || statusCode < 500;
  if (!operational) {
    logger.error('Unhandled application error', { message: error.message, stack: error.stack });
  }
  const safeError = operational || !env.isProduction ? error : new AppError('Internal server error', 500);
  res.status(statusCode).json(formatError(safeError));
}

module.exports = { notFound, errorHandler };
