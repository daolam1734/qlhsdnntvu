// src/utils/index.js
// Utility functions

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const env = require('../config/env');
const { TOKEN_TYPES } = require('../constants');

// Password utilities
const passwordUtils = {
  // Hash password
  hash: async (password) => {
    return await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  },

  // Verify password
  verify: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  // Generate random password
  generateRandom: (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// JWT utilities
const jwtUtils = {
  // Generate access token
  generateAccessToken: (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRE_TIME / 1000, // Convert to seconds
      issuer: env.APP_NAME,
      audience: 'user'
    });
  },

  // Generate refresh token
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRE_TIME / 1000, // Convert to seconds
      issuer: env.APP_NAME,
      audience: 'user'
    });
  },

  // Verify access token
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, env.JWT_SECRET, {
        issuer: env.APP_NAME,
        audience: 'user'
      });
    } catch (error) {
      throw new Error('Invalid access token');
    }
  },

  // Verify refresh token
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET, {
        issuer: env.APP_NAME,
        audience: 'user'
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  },

  // Extract token from Authorization header
  extractToken: (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
};

// Date utilities
const dateUtils = {
  // Format date
  format: (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(date).format(format);
  },

  // Parse date
  parse: (dateString, format = 'YYYY-MM-DD') => {
    return dayjs(dateString, format);
  },

  // Add days
  addDays: (date, days) => {
    return dayjs(date).add(days, 'day');
  },

  // Check if date is valid
  isValid: (date) => {
    return dayjs(date).isValid();
  },

  // Get difference in days
  diffInDays: (date1, date2) => {
    return dayjs(date1).diff(dayjs(date2), 'day');
  },

  // Check if date is in the past
  isPast: (date) => {
    return dayjs(date).isBefore(dayjs());
  },

  // Check if date is in the future
  isFuture: (date) => {
    return dayjs(date).isAfter(dayjs());
  }
};

// Validation utilities
const validationUtils = {
  // Check if email is valid
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Check if phone number is valid (Vietnamese format)
  isValidPhone: (phone) => {
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone);
  },

  // Check if string is empty
  isEmpty: (str) => {
    return !str || str.trim().length === 0;
  },

  // Sanitize string
  sanitize: (str) => {
    return str.replace(/[<>]/g, '');
  }
};

// Pagination utilities
const paginationUtils = {
  // Calculate pagination info
  getPaginationInfo: (page, limit, total) => {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    const offset = (currentPage - 1) * itemsPerPage;

    return {
      currentPage,
      itemsPerPage,
      totalPages,
      totalItems: total,
      offset,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  },

  // Generate pagination links
  getPaginationLinks: (baseUrl, paginationInfo) => {
    const links = {};

    if (paginationInfo.hasPrevPage) {
      links.prev = `${baseUrl}?page=${paginationInfo.currentPage - 1}&limit=${paginationInfo.itemsPerPage}`;
    }

    if (paginationInfo.hasNextPage) {
      links.next = `${baseUrl}?page=${paginationInfo.currentPage + 1}&limit=${paginationInfo.itemsPerPage}`;
    }

    links.first = `${baseUrl}?page=1&limit=${paginationInfo.itemsPerPage}`;
    links.last = `${baseUrl}?page=${paginationInfo.totalPages}&limit=${paginationInfo.itemsPerPage}`;

    return links;
  }
};

// Response utilities
const responseUtils = {
  // Success response
  success: (data = null, message = 'Success', statusCode = 200) => ({
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString()
  }),

  // Error response
  error: (message = 'Internal Server Error', statusCode = 500, errors = null) => ({
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString()
  }),

  // Pagination response
  paginated: (data, paginationInfo, links = null, message = 'Success') => ({
    success: true,
    statusCode: 200,
    message,
    data,
    pagination: paginationInfo,
    links,
    timestamp: new Date().toISOString()
  })
};

// Async error handler for routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  passwordUtils,
  jwtUtils,
  dateUtils,
  validationUtils,
  paginationUtils,
  responseUtils,
  asyncHandler
};