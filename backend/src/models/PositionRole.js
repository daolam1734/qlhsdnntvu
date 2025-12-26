const pool = require('../config/database');

class PositionRole {
    static async findAll() {
        const query = `
            SELECT pr.*, p.ten_chuc_vu, r.ten_vai_tro, r.mo_ta as mo_ta_vai_tro
            FROM chuc_vu_vai_tro pr
            JOIN chuc_vu p ON pr.ma_chuc_vu = p.ma_chuc_vu
            JOIN vai_tro r ON pr.ma_vai_tro = r.ma_vai_tro
            ORDER BY pr.ma_chuc_vu, pr.ma_vai_tro
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    static async findByPosition(ma_chuc_vu) {
        const query = `
            SELECT pr.*, r.ten_vai_tro, r.mo_ta
            FROM chuc_vu_vai_tro pr
            JOIN vai_tro r ON pr.ma_vai_tro = r.ma_vai_tro
            WHERE pr.ma_chuc_vu = $1
            ORDER BY r.ten_vai_tro
        `;
        const result = await pool.query(query, [ma_chuc_vu]);
        return result.rows;
    }

    static async assignRole(positionRoleData) {
        const { ma_chuc_vu, ma_vai_tro } = positionRoleData;
        const query = `
            INSERT INTO chuc_vu_vai_tro (ma_chuc_vu, ma_vai_tro)
            VALUES ($1, $2)
            ON CONFLICT (ma_chuc_vu, ma_vai_tro) DO NOTHING
            RETURNING *
        `;
        const result = await pool.query(query, [ma_chuc_vu, ma_vai_tro]);
        return result.rows[0];
    }

    static async removeRole(ma_chuc_vu, ma_vai_tro) {
        const query = 'DELETE FROM chuc_vu_vai_tro WHERE ma_chuc_vu = $1 AND ma_vai_tro = $2 RETURNING *';
        const result = await pool.query(query, [ma_chuc_vu, ma_vai_tro]);
        return result.rows[0];
    }

    static async getRolesByPosition(ma_chuc_vu) {
        const query = `
            SELECT r.*
            FROM vai_tro r
            JOIN chuc_vu_vai_tro pr ON r.ma_vai_tro = pr.ma_vai_tro
            WHERE pr.ma_chuc_vu = $1 AND r.trang_thai = true
        `;
        const result = await pool.query(query, [ma_chuc_vu]);
        return result.rows;
    }
}

module.exports = PositionRole;