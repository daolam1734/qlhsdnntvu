// src/modules/auth/auth.service.js
// Authentication service layer

const db = require('../../config/database');
const { passwordUtils, jwtUtils, dateUtils } = require('../../utils');
const { USER_ROLES } = require('../../constants');
const logger = require('../../config/logger');

class AuthService {
  // Login user
  async login(username, password) {
    try {
      // Find user by username
      const userQuery = `
        SELECT id, username, name, email, phone, department, role, password_hash, is_active, created_at, updated_at
        FROM users
        WHERE username = $1 AND is_active = true
      `;
      const userResult = await db.query(userQuery, [username]);

      if (userResult.rows.length === 0) {
        throw new Error('Invalid username or password');
      }

      const user = userResult.rows[0];

      // Verify password
      const isValidPassword = await passwordUtils.verify(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid username or password');
      }

      // Generate tokens
      const tokenPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
        department: user.department
      };

      const accessToken = jwtUtils.generateAccessToken(tokenPayload);
      const refreshToken = jwtUtils.generateRefreshToken(tokenPayload);

      // Update last login
      await db.query(
        'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
        [user.id]
      );

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = user;

      logger.info(`User ${username} logged in successfully`);

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error(`Login failed for user ${username}:`, error.message);
      throw error;
    }
  }

  // Register new user (admin only)
  async register(userData) {
    const client = await db.getTransaction();

    try {
      const { username, password, name, email, phone, department, role = USER_ROLES.EMPLOYEE } = userData;

      // Check if username already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('Username already exists');
      }

      // Check if email already exists
      const existingEmail = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingEmail.rows.length > 0) {
        throw new Error('Email already exists');
      }

      // Hash password
      const passwordHash = await passwordUtils.hash(password);

      // Insert new user
      const insertQuery = `
        INSERT INTO users (username, password_hash, name, email, phone, department, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
        RETURNING id, username, name, email, phone, department, role, created_at, updated_at
      `;

      const result = await client.query(insertQuery, [
        username, passwordHash, name, email, phone, department, role
      ]);

      await db.commit(client);

      logger.info(`New user registered: ${username}`);
      return result.rows[0];
    } catch (error) {
      await db.rollback(client);
      logger.error('User registration failed:', error.message);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwtUtils.verifyRefreshToken(refreshToken);

      // Check if user still exists and is active
      const userQuery = `
        SELECT id, username, role, department, is_active
        FROM users
        WHERE id = $1 AND is_active = true
      `;
      const userResult = await db.query(userQuery, [decoded.id]);

      if (userResult.rows.length === 0) {
        throw new Error('User not found or inactive');
      }

      const user = userResult.rows[0];

      // Generate new access token
      const tokenPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
        department: user.department
      };

      const newAccessToken = jwtUtils.generateAccessToken(tokenPayload);

      logger.info(`Access token refreshed for user: ${user.username}`);

      return {
        accessToken: newAccessToken,
        user
      };
    } catch (error) {
      logger.error('Token refresh failed:', error.message);
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const client = await db.getTransaction();

    try {
      // Get current user
      const userQuery = 'SELECT password_hash FROM users WHERE id = $1 AND is_active = true';
      const userResult = await client.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];

      // Verify current password
      const isValidPassword = await passwordUtils.verify(currentPassword, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await passwordUtils.hash(newPassword);

      // Update password
      await client.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [newPasswordHash, userId]
      );

      await db.commit(client);

      logger.info(`Password changed for user ID: ${userId}`);
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      await db.rollback(client);
      logger.error(`Password change failed for user ID ${userId}:`, error.message);
      throw error;
    }
  }

  // Get user profile
  async getProfile(userId) {
    try {
      const query = `
        SELECT id, username, name, email, phone, department, role, is_active, created_at, updated_at, last_login
        FROM users
        WHERE id = $1 AND is_active = true
      `;
      const result = await db.query(query, [userId]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      logger.error(`Failed to get profile for user ID ${userId}:`, error.message);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    const client = await db.getTransaction();

    try {
      const { name, email, phone, department } = profileData;

      // Check if email is already taken by another user
      if (email) {
        const emailCheck = await client.query(
          'SELECT id FROM users WHERE email = $1 AND id != $2',
          [email, userId]
        );

        if (emailCheck.rows.length > 0) {
          throw new Error('Email already exists');
        }
      }

      // Update profile
      const updateQuery = `
        UPDATE users
        SET name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone),
            department = COALESCE($4, department),
            updated_at = NOW()
        WHERE id = $5
        RETURNING id, username, name, email, phone, department, role, updated_at
      `;

      const result = await client.query(updateQuery, [name, email, phone, department, userId]);

      await db.commit(client);

      logger.info(`Profile updated for user ID: ${userId}`);
      return result.rows[0];
    } catch (error) {
      await db.rollback(client);
      logger.error(`Profile update failed for user ID ${userId}:`, error.message);
      throw error;
    }
  }

  // Logout (invalidate refresh token if needed)
  async logout(userId) {
    try {
      // In a more complex implementation, you might want to blacklist tokens
      // For now, just log the logout
      logger.info(`User ID ${userId} logged out`);
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      logger.error(`Logout failed for user ID ${userId}:`, error.message);
      throw error;
    }
  }
}

module.exports = new AuthService();