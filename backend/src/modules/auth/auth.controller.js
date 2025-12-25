// src/modules/auth/auth.controller.js
// Authentication controller

const authService = require('./auth.service');
const { responseUtils, asyncHandler } = require('../../utils');
const { HTTP_STATUS } = require('../../constants');
const logger = require('../../config/logger');

class AuthController {
  // Login
  login = asyncHandler(async (req, res) => {
    const { username, password, rememberMe } = req.body;

    const result = await authService.login(username, password);

    logger.info(`Login successful for user: ${username}`);

    res.status(HTTP_STATUS.OK).json(
      responseUtils.success(result, 'Login successful')
    );
  });

  // Register (admin only)
  register = asyncHandler(async (req, res) => {
    const userData = req.body;

    const newUser = await authService.register(userData);

    logger.info(`User registered: ${newUser.username}`);

    res.status(HTTP_STATUS.CREATED).json(
      responseUtils.success(newUser, 'User registered successfully')
    );
  });

  // Refresh token
  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    logger.info(`Token refreshed for user: ${result.user.username}`);

    res.status(HTTP_STATUS.OK).json(
      responseUtils.success(result, 'Token refreshed successfully')
    );
  });

  // Change password
  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const result = await authService.changePassword(userId, currentPassword, newPassword);

    logger.info(`Password changed for user ID: ${userId}`);

    res.status(HTTP_STATUS.OK).json(
      responseUtils.success(result, 'Password changed successfully')
    );
  });

  // Get profile
  getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await authService.getProfile(userId);

    res.status(HTTP_STATUS.OK).json(
      responseUtils.success(profile, 'Profile retrieved successfully')
    );
  });

  // Update profile
  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const profileData = req.body;

    const updatedProfile = await authService.updateProfile(userId, profileData);

    logger.info(`Profile updated for user ID: ${userId}`);

    res.status(HTTP_STATUS.OK).json(
      responseUtils.success(updatedProfile, 'Profile updated successfully')
    );
  });

  // Logout
  logout = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await authService.logout(userId);

    res.status(HTTP_STATUS.OK).json(
      responseUtils.success(result, 'Logged out successfully')
    );
  });

  // Get current user info (for frontend)
  me = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await authService.getProfile(userId);

    res.status(HTTP_STATUS.OK).json(
      responseUtils.success(profile, 'Current user info retrieved successfully')
    );
  });
}

module.exports = new AuthController();