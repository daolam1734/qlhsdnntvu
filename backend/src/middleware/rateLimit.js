// src/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const authConfig = require('../config/auth');

// Rate limiter for login attempts
const loginRateLimit = rateLimit({
  windowMs: authConfig.loginAttemptsWindowMs, // 15 minutes
  max: authConfig.loginAttemptsLimit, // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.',
    retryAfter: Math.ceil(authConfig.loginAttemptsWindowMs / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: (req) => {
    // Use IP address and attempted username/email as key
    const identifier = req.body.username || req.body.email || req.ip;
    return `${req.ip}-${identifier}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.',
      retryAfter: Math.ceil(authConfig.loginAttemptsWindowMs / 1000)
    });
  }
});

// General API rate limiter
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiter for password reset
const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 1 giờ.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for token refresh
const tokenRefreshRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 token refresh requests per 5 minutes
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu làm mới token. Vui lòng thử lại sau.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true // Don't count failed requests
});

module.exports = {
  loginRateLimit,
  apiRateLimit,
  passwordResetRateLimit,
  tokenRefreshRateLimit
};