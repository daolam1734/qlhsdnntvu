// src/middlewares/auth.middleware.js
// Authentication middleware

const { jwtUtils, responseUtils } = require('../utils');
const { HTTP_STATUS } = require('../constants');
const logger = require('../config/logger');

// Authenticate user middleware
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = jwtUtils.extractToken(authHeader);

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        responseUtils.error('Access denied. No token provided.', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    // Verify token
    const decoded = jwtUtils.verifyAccessToken(token);

    // Add user to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      department: decoded.department
    };

    logger.info(`Authenticated user: ${req.user.username}`);
    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      responseUtils.error('Invalid token.', HTTP_STATUS.UNAUTHORIZED)
    );
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtUtils.extractToken(authHeader);

    if (token) {
      const decoded = jwtUtils.verifyAccessToken(token);
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        department: decoded.department
      };
    }

    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};