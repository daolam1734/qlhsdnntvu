// src/config/auth.js
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',

  // Password requirements
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: false,

  // Rate limiting
  loginAttemptsLimit: 5,
  loginAttemptsWindowMs: 15 * 60 * 1000, // 15 minutes

  // Session settings
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};