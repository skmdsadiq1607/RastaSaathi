class AppError extends Error {
  constructor(message, statusCode = 500, code = 'APP_ERROR', details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function formatSuccess(data = {}, message = '') {
  return { success: true, data, message };
}

function sendSuccess(res, data = {}, message = '', statusCode = 200) {
  return res.status(statusCode).json(formatSuccess(data, message));
}

function formatError(error) {
  return {
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Unexpected server error',
      details: error.details
    }
  };
}

module.exports = { AppError, formatSuccess, sendSuccess, formatError };
