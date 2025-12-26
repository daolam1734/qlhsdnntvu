const pool = require('../config/database');

class Role {
    static async findAll() {
        const query = 'SELECT * FROM vai_tro ORDER BY ma_vai_tro';
        const result = await pool.query(query);
        return result.rows;
    }

    static async findById(ma_vai_tro) {
        const query = 'SELECT * FROM vai_tro WHERE ma_vai_tro = $1';
        const result = await pool.query(query, [ma_vai_tro]);
        return result.rows[0];
    }

    static async create(roleData) {
        const { ten_vai_tro, mo_ta, trang_thai = true } = roleData;
        const query = `
            INSERT INTO vai_tro (ten_vai_tro, mo_ta, trang_thai)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [ten_vai_tro, mo_ta, trang_thai]);
        return result.rows[0];
    }

    static async update(ma_vai_tro, roleData) {
        const { ten_vai_tro, mo_ta, trang_thai } = roleData;
        const query = `
            UPDATE vai_tro
            SET ten_vai_tro = $1, mo_ta = $2, trang_thai = $3, updated_at = CURRENT_TIMESTAMP
            WHERE ma_vai_tro = $4
            RETURNING *
        `;
        const result = await pool.query(query, [ten_vai_tro, mo_ta, trang_thai, ma_vai_tro]);
        return result.rows[0];
    }

    static async delete(ma_vai_tro) {
        const query = 'DELETE FROM vai_tro WHERE ma_vai_tro = $1 RETURNING *';
        const result = await pool.query(query, [ma_vai_tro]);
        return result.rows[0];
    }
}

module.exports = Role;