// src/middlewares/error.middleware.js
// Global error handling middleware

const env = require('../config/env');
const logger = require('../config/logger');
const { responseUtils } = require('../utils');
const { HTTP_STATUS, DB_CONSTRAINTS } = require('../constants');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`${err.name}: ${err.message}\nStack: ${err.stack}`);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: HTTP_STATUS.NOT_FOUND };
  }

  // Mongoose duplicate key
  if (err.code === DB_CONSTRAINTS.UNIQUE_VIOLATION) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: HTTP_STATUS.CONFLICT };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: HTTP_STATUS.BAD_REQUEST };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: HTTP_STATUS.UNAUTHORIZED };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: HTTP_STATUS.UNAUTHORIZED };
  }

  // Default error
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';

  // Send error response
  if (env.isDevelopment()) {
    // Include stack trace in development
    res.status(statusCode).json({
      ...responseUtils.error(message, statusCode, err.stack),
      stack: err.stack
    });
  } else {
    // Don't include stack trace in production
    res.status(statusCode).json(responseUtils.error(message, statusCode));
  }
};

module.exports = errorHandler;