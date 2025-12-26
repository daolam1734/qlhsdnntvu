// src/models/LoginHistory.js
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class LoginHistory {
  constructor(data) {
    this.mavc = data.mavc;
    this.thoi_diem = data.thoi_diem;
    this.dia_chi_ip = data.dia_chi_ip;
    this.ket_qua = data.ket_qua;
    this.thiet_bi = data.thiet_bi;
    this.trinh_duyet = data.trinh_duyet;
    this.ly_do_that_bai = data.ly_do_that_bai;
  }

  // Log successful login
  static async logLogin(mavc, ipAddress, userAgent) {
    try {
      const query = `
        INSERT INTO lich_su_dang_nhap (
          mavc, dia_chi_ip, ket_qua, thiet_bi, trinh_duyet
        )
        VALUES ($1, $2, true, $3, $4)
      `;

      const values = [
        mavc,
        ipAddress,
        userAgent,
        userAgent // using userAgent for both, since schema has thiet_bi and trinh_duyet
      ];

      await pool.query(query, values);
      return { mavc, thoi_diem: new Date() }; // return a simple object
    } catch (error) {
      console.error('Error logging login:', error);
      throw error;
    }
  }

  // Log failed login attempt
  static async logFailedLogin(mavc, ipAddress, userAgent, reason) {
    try {
      const query = `
        INSERT INTO lich_su_dang_nhap (
          mavc, dia_chi_ip, ket_qua, thiet_bi, trinh_duyet, ly_do_that_bai
        )
        VALUES ($1, $2, false, $3, $4, $5)
      `;

      const values = [
        mavc,
        ipAddress,
        userAgent,
        userAgent,
        reason
      ];

      await pool.query(query, values);
    } catch (error) {
      console.error('Error logging failed login:', error);
      throw error;
    }
  }

  // Log logout
  static async logLogout(mavc, loginTime) {
    // Since the schema doesn't have logout time, perhaps we can skip or add a separate table
    // For now, just return success
    return true;
  }

  // Get login history for user
  static async getUserLoginHistory(mavc, limit = 50, offset = 0) {
    try {
      const query = `
        SELECT * FROM lich_su_dang_nhap
        WHERE mavc = $1
        ORDER BY thoi_diem DESC
        LIMIT $2 OFFSET $3
      `;
      const result = await pool.query(query, [mavc, limit, offset]);
      return result.rows.map(row => new LoginHistory(row));
    } catch (error) {
      console.error('Error getting user login history:', error);
      throw error;
    }
  }

  // Get recent failed login attempts
  static async getRecentFailedAttempts(limit = 100) {
    try {
      const query = `
        SELECT * FROM lich_su_dang_nhap
        WHERE trang_thai = 'failed'
        AND thoi_gian_dang_nhap > NOW() - INTERVAL '24 hours'
        ORDER BY thoi_gian_dang_nhap DESC
        LIMIT $1
      `;

      const result = await pool.query(query, [limit]);
      return result.rows.map(row => new LoginHistory(row));
    } catch (error) {
      console.error('Error getting recent failed attempts:', error);
      throw error;
    }
  }

  // Get login statistics
  static async getLoginStats(days = 30) {
    try {
      const query = `
        SELECT
          DATE(thoi_gian_dang_nhap) as date,
          COUNT(CASE WHEN trang_thai = 'success' THEN 1 END) as successful_logins,
          COUNT(CASE WHEN trang_thai = 'failed' THEN 1 END) as failed_logins
        FROM lich_su_dang_nhap
        WHERE thoi_gian_dang_nhap > NOW() - INTERVAL '${days} days'
        GROUP BY DATE(thoi_gian_dang_nhap)
        ORDER BY date DESC
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting login stats:', error);
      throw error;
    }
  }
}

module.exports = LoginHistory;