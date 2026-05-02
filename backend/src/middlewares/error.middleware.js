const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Wrap non-ApiError instances
  if (!(error instanceof ApiError)) {
    let statusCode = 500;
    let message = error.message || 'Internal Server Error';

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      statusCode = 422;
      const errors = Object.values(error.errors).map((e) => e.message);
      message = errors.join(', ');
      error = new ApiError(statusCode, message, errors);
    }
    // Mongoose cast error (invalid ObjectId)
    else if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ${error.path}: ${error.value}`;
      error = new ApiError(statusCode, message);
    }
    // MongoDB duplicate key
    else if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      message = `Duplicate value for '${field}'`;
      error = new ApiError(statusCode, message);
    }
    // JWT errors
    else if (error.name === 'JsonWebTokenError') {
      error = new ApiError(401, 'Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      error = new ApiError(401, 'Token has expired');
    } else {
      error = new ApiError(statusCode, message);
    }
  }

  // Log server errors
  if (error.statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} — ${error.message}`, { stack: error.stack });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

module.exports = errorMiddleware;
