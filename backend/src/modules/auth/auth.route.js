// src/modules/auth/auth.route.js
// Authentication routes

const express = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/role.middleware');
const validateRequest = require('../../middlewares/validation.middleware');
const { loginSchema, registerSchema, changePasswordSchema, refreshTokenSchema } = require('./auth.schema');

const router = express.Router();

// Public routes
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', authController.logout);
router.get('/me', authController.me);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.post('/change-password', validateRequest(changePasswordSchema), authController.changePassword);

// Admin only routes
router.post('/register', requireAdmin, validateRequest(registerSchema), authController.register);

module.exports = router;