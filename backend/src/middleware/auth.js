// src/middleware/auth.js
const JWTUtils = require('../utils/jwt');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không được cung cấp'
      });
    }

    const decoded = JWTUtils.verifyAccessToken(token);

    // Get user from database to ensure they still exist and are active
    const user = await User.findById(decoded.mavc);

    if (!user || !user.trang_thai) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không hợp lệ hoặc đã bị vô hiệu hóa'
      });
    }

    // Attach user to request object
    req.user = user;
    req.tokenPayload = decoded;

    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực'
    });
  }
};

// Middleware to check if user has required role (simple username check fallback)
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực'
      });
    }

    // If user object contains role, use it; otherwise allow known admin usernames
    if (req.user.role) {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập'
        });
      }
      return next();
    }

    const adminUsernames = ['admin', 'superadmin', 'sysadmin'];
    if (!adminUsernames.includes(req.user.ten_dang_nhap)) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource or has admin privileges
const requireOwnershipOrAdmin = (resourceUserIdField = 'mavc') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực'
      });
    }

    // Quick admin check using username
    const adminUsernames = ['admin', 'superadmin', 'sysadmin'];
    if (adminUsernames.includes(req.user.ten_dang_nhap)) {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

    if (String(req.user.mavc) !== String(resourceUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập tài nguyên này'
      });
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = JWTUtils.verifyAccessToken(token);
      const user = await User.findById(decoded.mavc);

      if (user && user.trang_thai) {
        req.user = user;
        req.tokenPayload = decoded;
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnershipOrAdmin,
  optionalAuth
};