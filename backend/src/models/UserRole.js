const pool = require('../config/database');

class UserRole {
    static async findAll() {
        const query = `
            SELECT ur.*, u.ten_dang_nhap, r.ten_vai_tro
            FROM nguoi_dung_vai_tro ur
            JOIN nguoi_dung u ON ur.mavc = u.mavc
            JOIN vai_tro r ON ur.ma_vai_tro = r.ma_vai_tro
            ORDER BY ur.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    static async findByUser(mavc) {
        const query = `
            SELECT ur.*, r.ten_vai_tro, r.mo_ta
            FROM nguoi_dung_vai_tro ur
            JOIN vai_tro r ON ur.ma_vai_tro = r.ma_vai_tro
            WHERE ur.mavc = $1 AND (ur.ngay_het_hieu_luc IS NULL OR ur.ngay_het_hieu_luc > CURRENT_DATE)
            ORDER BY ur.ngay_gan DESC
        `;
        const result = await pool.query(query, [mavc]);
        return result.rows;
    }

    static async assignRole(userRoleData) {
        const { mavc, ma_vai_tro, ngay_gan, ngay_het_hieu_luc, ghi_chu } = userRoleData;
        const query = `
            INSERT INTO nguoi_dung_vai_tro (mavc, ma_vai_tro, ngay_gan, ngay_het_hieu_luc, ghi_chu)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await pool.query(query, [mavc, ma_vai_tro, ngay_gan, ngay_het_hieu_luc, ghi_chu]);
        return result.rows[0];
    }

    static async removeRole(mavc, ma_vai_tro, ngay_gan) {
        const query = 'DELETE FROM nguoi_dung_vai_tro WHERE mavc = $1 AND ma_vai_tro = $2 AND ngay_gan = $3 RETURNING *';
        const result = await pool.query(query, [mavc, ma_vai_tro, ngay_gan]);
        return result.rows[0];
    }

    static async updateRole(mavc, ma_vai_tro, ngay_gan, updateData) {
        const { ngay_het_hieu_luc, ghi_chu } = updateData;
        const query = `
            UPDATE nguoi_dung_vai_tro
            SET ngay_het_hieu_luc = $1, ghi_chu = $2
            WHERE mavc = $3 AND ma_vai_tro = $4 AND ngay_gan = $5
            RETURNING *
        `;
        const result = await pool.query(query, [ngay_het_hieu_luc, ghi_chu, mavc, ma_vai_tro, ngay_gan]);
        return result.rows[0];
    }
}

module.exports = UserRole;