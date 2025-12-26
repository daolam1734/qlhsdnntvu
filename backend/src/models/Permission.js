const pool = require('../config/database');

class Permission {
    static async findAll() {
        const query = 'SELECT * FROM phan_quyen ORDER BY ma_quyen';
        const result = await pool.query(query);
        return result.rows;
    }

    static async findById(ma_quyen) {
        const query = 'SELECT * FROM phan_quyen WHERE ma_quyen = $1';
        const result = await pool.query(query, [ma_quyen]);
        return result.rows[0];
    }

    static async create(permissionData) {
        const { ten_quyen, mo_ta, module, action } = permissionData;
        const query = `
            INSERT INTO phan_quyen (ten_quyen, mo_ta, module, action)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pool.query(query, [ten_quyen, mo_ta, module, action]);
        return result.rows[0];
    }

    static async update(ma_quyen, permissionData) {
        const { ten_quyen, mo_ta, module, action } = permissionData;
        const query = `
            UPDATE phan_quyen
            SET ten_quyen = $1, mo_ta = $2, module = $3, action = $4, updated_at = CURRENT_TIMESTAMP
            WHERE ma_quyen = $5
            RETURNING *
        `;
        const result = await pool.query(query, [ten_quyen, mo_ta, module, action, ma_quyen]);
        return result.rows[0];
    }

    static async delete(ma_quyen) {
        const query = 'DELETE FROM phan_quyen WHERE ma_quyen = $1 RETURNING *';
        const result = await pool.query(query, [ma_quyen]);
        return result.rows[0];
    }
}

module.exports = Permission;