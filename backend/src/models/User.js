// src/models/User.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data) {
    this.mavc = data.mavc;
    this.ten_dang_nhap = data.ten_dang_nhap;
    this.email = data.email;
    this.mat_khau_hash = data.mat_khau_hash;
    this.ho_ten = data.ho_ten;
    this.chuc_vu = data.chuc_vu;
    this.ma_don_vi = data.ma_don_vi;
    this.vai_tro = data.vai_tro;
    this.trang_thai = data.trang_thai;
    this.lan_dang_nhap_cuoi = data.lan_dang_nhap_cuoi;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Find user by username or email
  static async findByUsernameOrEmail(identifier) {
    try {
      const query = `
        SELECT u.*, vc.ho_ten, vc.chuc_vu, vc.ma_don_vi, u.mavc, u.vai_tro
        FROM nguoi_dung u
        LEFT JOIN vien_chuc vc ON u.mavc = vc.mavc
        WHERE u.ten_dang_nhap = $1 OR u.email = $1
      `;
      const result = await pool.query(query, [identifier]);

      if (result.rows.length === 0) {
        return null;
      }

      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  // Find user by ID (ma_gv)
  static async findById(mavc) {
    try {
      const query = `
        SELECT u.*, vc.ho_ten, vc.chuc_vu, vc.ma_don_vi, u.mavc, u.vai_tro
        FROM nguoi_dung u
        LEFT JOIN vien_chuc vc ON u.mavc = vc.mavc
        WHERE u.mavc = $1
      `;
      const result = await pool.query(query, [mavc]);

      if (result.rows.length === 0) {
        return null;
      }

      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { username, email, password, fullName, role, departmentId, staffId } = userData;

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      const query = `
        INSERT INTO nguoi_dung (
          id, ten_dang_nhap, email, mat_khau_hash, vai_tro,
          vien_chuc_id, khoa_id, trang_thai, ngay_tao, ngay_cap_nhat
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING *
      `;

      const values = [
        uuidv4(),
        username,
        email,
        passwordHash,
        role,
        staffId,
        departmentId,
        'active'
      ];

      const result = await pool.query(query, values);
      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  async update(updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push(`updated_at = NOW()`);

      const query = `
        UPDATE nguoi_dung
        SET ${fields.join(', ')}
        WHERE mavc = $${paramCount}
        RETURNING *
      `;

      values.push(this.mavc);
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      // Update current instance
      Object.assign(this, result.rows[0]);
      return this;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(newPassword) {
    try {
      const passwordHash = await bcrypt.hash(newPassword, 12);
      return await this.update({ mat_khau_hash: passwordHash });
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.mat_khau_hash);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  // Update last login
  async updateLastLogin() {
    try {
      await this.update({ lan_dang_nhap_cuoi: new Date() });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  // Deactivate user
  async deactivate() {
    try {
      return await this.update({ trang_thai: 'inactive' });
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  // To JSON (exclude sensitive data)
  toJSON() {
    return {
      mavc: this.mavc,
      ten_dang_nhap: this.ten_dang_nhap,
      email: this.email,
      ho_ten: this.ho_ten,
      chuc_vu: this.chuc_vu,
      ma_don_vi: this.ma_don_vi,
      vai_tro: this.vai_tro,
      trang_thai: this.trang_thai,
      lan_dang_nhap_cuoi: this.lan_dang_nhap_cuoi,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Static methods

  // Find all users with pagination and filtering
  static async findAll(page = 1, limit = 10, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      const conditions = [];
      const values = [];
      let paramCount = 1;

      // Build WHERE conditions
      if (filters.search) {
        conditions.push(`(
          u.ten_dang_nhap ILIKE $${paramCount} OR
          u.email ILIKE $${paramCount + 1} OR
          COALESCE(vc.ho_ten, '') ILIKE $${paramCount + 2}
        )`);
        values.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
        paramCount += 3;
      }

      if (filters.role) {
        conditions.push(`u.vai_tro = $${paramCount}`);
        values.push(filters.role);
        paramCount++;
      }

      if (filters.status !== undefined) {
        conditions.push(`u.trang_thai = $${paramCount}`);
        values.push(filters.status);
        paramCount++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM nguoi_dung u
        LEFT JOIN vien_chuc vc ON u.mavc = vc.mavc
        ${whereClause}
      `;
      const countResult = await pool.query(countQuery, values);
      const total = parseInt(countResult.rows[0].total);

      // Get paginated data
      const dataQuery = `
        SELECT
          u.mavc,
          u.ten_dang_nhap,
          u.email,
          COALESCE(vc.ho_ten, u.ten_dang_nhap) as ho_ten,
          vc.chuc_vu,
          vc.ma_don_vi,
          u.vai_tro,
          u.trang_thai,
          u.lan_dang_nhap_cuoi,
          u.created_at,
          u.updated_at
        FROM nguoi_dung u
        LEFT JOIN vien_chuc vc ON u.mavc = vc.mavc
        ${whereClause}
        ORDER BY u.created_at DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

      values.push(limit, offset);
      const dataResult = await pool.query(dataQuery, values);

      const totalPages = Math.ceil(total / limit);

      return {
        data: dataResult.rows,
        page,
        limit,
        total,
        totalPages
      };
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const {
        mavc,
        ten_dang_nhap,
        email,
        mat_khau_hash,
        vai_tro,
        trang_thai = true
      } = userData;

      const query = `
        INSERT INTO nguoi_dung (
          mavc, ten_dang_nhap, email, mat_khau_hash, vai_tro, trang_thai, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *
      `;

      const values = [
        mavc, ten_dang_nhap, email, mat_khau_hash, vai_tro, trang_thai
      ];

      const result = await pool.query(query, values);

      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user by ID
  static async update(mavc, updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(updateData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      fields.push(`updated_at = NOW()`);

      const query = `
        UPDATE nguoi_dung
        SET ${fields.join(', ')}
        WHERE mavc = $${paramCount}
        RETURNING *
      `;

      values.push(mavc);
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user by ID
  static async delete(mavc) {
    try {
      const query = 'DELETE FROM nguoi_dung WHERE mavc = $1 RETURNING mavc';
      const result = await pool.query(query, [mavc]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = User;