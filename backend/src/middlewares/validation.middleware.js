// src/middlewares/validation.middleware.js
// Request validation middleware using Joi

const { responseUtils } = require('../utils');
const { HTTP_STATUS } = require('../constants');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown properties
      convert: true // Convert types (e.g., string numbers to numbers)
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        responseUtils.error('Validation failed', HTTP_STATUS.BAD_REQUEST, errors)
      );
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = validateRequest;