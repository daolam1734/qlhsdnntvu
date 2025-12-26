// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const {
  loginRateLimit,
  passwordResetRateLimit,
  tokenRefreshRateLimit
} = require('../middleware/rateLimit');

// Public routes (no authentication required)
router.post('/login', loginRateLimit, authController.login);
router.post('/refresh-token', tokenRefreshRateLimit, authController.refreshToken);
router.post('/forgot-password', passwordResetRateLimit, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes (authentication required)
router.post('/logout', authenticateToken, authController.logout);
router.post('/change-password', authenticateToken, authController.changePassword);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;