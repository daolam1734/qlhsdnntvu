// src/utils/jwt.js
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

class JWTUtils {
  // Generate access token
  static generateAccessToken(payload) {
    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn,
      issuer: 'qlhs-dnn-tvu',
      audience: 'qlhs-dnn-tvu-users'
    });
  }

  // Generate refresh token
  static generateRefreshToken(payload) {
    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.refreshTokenExpiresIn,
      issuer: 'qlhs-dnn-tvu',
      audience: 'qlhs-dnn-tvu-refresh'
    });
  }

  // Verify token
  static verifyToken(token) {
    try {
      return jwt.verify(token, authConfig.jwtSecret, {
        issuer: 'qlhs-dnn-tvu'
      });
    } catch (error) {
      throw error;
    }
  }

  // Verify access token
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, authConfig.jwtSecret, {
        issuer: 'qlhs-dnn-tvu',
        audience: 'qlhs-dnn-tvu-users'
      });
    } catch (error) {
      throw error;
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, authConfig.jwtSecret, {
        issuer: 'qlhs-dnn-tvu',
        audience: 'qlhs-dnn-tvu-refresh'
      });
    } catch (error) {
      throw error;
    }
  }

  // Extract token from Authorization header
  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  // Generate token pair
  static generateTokenPair(user) {
    const payload = {
      mavc: user.mavc,
      ten_dang_nhap: user.ten_dang_nhap,
      email: user.email,
      ho_ten: user.ho_ten,
      ma_don_vi: user.ma_don_vi
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({ mavc: user.mavc });

    return {
      accessToken,
      refreshToken,
      expiresIn: authConfig.jwtExpiresIn
    };
  }
}

module.exports = JWTUtils;