const pool = require('../config/database');

class RolePermission {
    static async findAll() {
        const query = `
            SELECT rp.*, r.ten_vai_tro, p.ten_quyen, p.module, p.action
            FROM vai_tro_phan_quyen rp
            JOIN vai_tro r ON rp.ma_vai_tro = r.ma_vai_tro
            JOIN phan_quyen p ON rp.ma_quyen = p.ma_quyen
            ORDER BY rp.ma_vai_tro, rp.ma_quyen
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    static async findByRole(ma_vai_tro) {
        const query = `
            SELECT rp.*, p.ten_quyen, p.mo_ta, p.module, p.action
            FROM vai_tro_phan_quyen rp
            JOIN phan_quyen p ON rp.ma_quyen = p.ma_quyen
            WHERE rp.ma_vai_tro = $1
            ORDER BY p.module, p.action
        `;
        const result = await pool.query(query, [ma_vai_tro]);
        return result.rows;
    }

    static async assignPermission(rolePermissionData) {
        const { ma_vai_tro, ma_quyen } = rolePermissionData;
        const query = `
            INSERT INTO vai_tro_phan_quyen (ma_vai_tro, ma_quyen)
            VALUES ($1, $2)
            ON CONFLICT (ma_vai_tro, ma_quyen) DO NOTHING
            RETURNING *
        `;
        const result = await pool.query(query, [ma_vai_tro, ma_quyen]);
        return result.rows[0];
    }

    static async removePermission(ma_vai_tro, ma_quyen) {
        const query = 'DELETE FROM vai_tro_phan_quyen WHERE ma_vai_tro = $1 AND ma_quyen = $2 RETURNING *';
        const result = await pool.query(query, [ma_vai_tro, ma_quyen]);
        return result.rows[0];
    }

    static async getPermissionsByRoles(roleIds) {
        if (!roleIds || roleIds.length === 0) return [];
        const placeholders = roleIds.map((_, i) => `$${i + 1}`).join(',');
        const query = `
            SELECT DISTINCT p.*
            FROM phan_quyen p
            JOIN vai_tro_phan_quyen rp ON p.ma_quyen = rp.ma_quyen
            WHERE rp.ma_vai_tro IN (${placeholders})
        `;
        const result = await pool.query(query, roleIds);
        return result.rows;
    }
}

module.exports = RolePermission;