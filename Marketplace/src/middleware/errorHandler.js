const logger = require('../utils/logger');
const ApiResponse = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return ApiResponse.error(res, 'Resource not found', 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(res, `${field} already exists`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return ApiResponse.error(res, 'Validation failed', 400, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Token expired', 401);
  }

  // Default error
  return ApiResponse.error(
    res,
    err.message || 'Server error',
    err.statusCode || 500
  );
};

// Handle 404 routes
const notFound = (req, res) => {
  ApiResponse.error(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = { errorHandler, notFound };
