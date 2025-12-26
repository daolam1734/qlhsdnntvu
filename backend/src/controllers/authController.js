// src/controllers/authController.js
const User = require('../models/User');
const LoginHistory = require('../models/LoginHistory');
const JWTUtils = require('../utils/jwt');
const PasswordUtils = require('../utils/password');
const { v4: uuidv4 } = require('uuid');

// Store for refresh tokens (in production, use Redis or database)
const refreshTokens = new Set();

// Login controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên đăng nhập và mật khẩu'
      });
    }

    // Find user
    const user = await User.findByUsernameOrEmail(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    // Check if user is active
    if (!user.trang_thai) {
      await LoginHistory.logFailedLogin(
        user.mavc,
        req.ip,
        req.get('User-Agent'),
        'user_inactive'
      );

      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa'
      });
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
      // Log failed login attempt
      await LoginHistory.logFailedLogin(
        user.mavc,
        req.ip,
        req.get('User-Agent'),
        'invalid_password'
      );

      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Log successful login
    const loginRecord = await LoginHistory.logLogin(
      user.mavc,
      req.ip,
      req.get('User-Agent')
    );

    // Generate tokens
    const tokenPair = JWTUtils.generateTokenPair(user);
    refreshTokens.add(tokenPair.refreshToken);

    // Return success response
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: user.toJSON(),
        tokens: tokenPair,
        sessionId: loginRecord.thoi_diem
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};

// Logout controller
const logout = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const refreshToken = req.body.refreshToken;

    // Log logout if sessionId provided
    if (sessionId) {
      try {
        await LoginHistory.logLogout(sessionId);
      } catch (error) {
        console.warn('Failed to log logout:', error);
      }
    }

    // Remove refresh token
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};

// Refresh token controller
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token không được cung cấp'
      });
    }

    // Check if refresh token exists in store
    if (!refreshTokens.has(token)) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token không hợp lệ'
      });
    }

    // Verify refresh token
    const decoded = JWTUtils.verifyRefreshToken(token);

    // Get user by mavc
    const user = await User.findById(decoded.mavc);

    if (!user || !user.trang_thai) {
      refreshTokens.delete(token);
      return res.status(401).json({
        success: false,
        message: 'Người dùng không hợp lệ'
      });
    }

    // Remove old refresh token
    refreshTokens.delete(token);

    // Generate new token pair
    const tokenPair = JWTUtils.generateTokenPair(user);
    refreshTokens.add(tokenPair.refreshToken);

    res.json({
      success: true,
      message: 'Token đã được làm mới',
      data: {
        tokens: tokenPair
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token đã hết hạn'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};

// Change password controller
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới'
      });
    }

    // Validate new password strength
    const passwordValidation = PasswordUtils.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới không đáp ứng yêu cầu',
        errors: passwordValidation.errors
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.verifyPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Change password
    await user.changePassword(newPassword);

    // Invalidate all refresh tokens for security
    // Note: In production, you might want to keep track of token families
    refreshTokens.clear();

    res.json({
      success: true,
      message: 'Mật khẩu đã được thay đổi thành công. Vui lòng đăng nhập lại.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};

// Forgot password controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập địa chỉ email'
      });
    }

    // Find user by email
    const user = await User.findByUsernameOrEmail(email);

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.'
      });
    }

    // Generate reset token (in production, send email)
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store reset token (in production, use database)
    // For demo purposes, we'll just return it
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.',
      // In production, remove this
      debug: {
        resetToken,
        resetExpires
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};

// Reset password controller
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token và mật khẩu mới là bắt buộc'
      });
    }

    // Validate new password
    const passwordValidation = PasswordUtils.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới không đáp ứng yêu cầu',
        errors: passwordValidation.errors
      });
    }

    // In production, verify token from database
    // For demo, we'll accept any token
    console.log(`Password reset with token: ${token}`);

    // Find user and update password (in production, get user from token)
    // This is a simplified version
    res.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const user = req.user;

    const updateData = {};
    if (fullName) updateData.ho_ten = fullName;
    if (email) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có thông tin nào để cập nhật'
      });
    }

    await user.update(updateData);

    res.json({
      success: true,
      message: 'Thông tin cá nhân đã được cập nhật',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
    });
  }
};

module.exports = {
  login,
  logout,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
};