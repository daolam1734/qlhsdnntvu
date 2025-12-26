// src/models/Category.js
// Models for catalog/danh mục tables

const pool = require('../config/database');

class Category {
    constructor(tableName, idField = 'id') {
        this.tableName = tableName;
        this.idField = idField;
    }

    // Get all items with pagination
    async findAll(page = 1, limit = 10, activeOnly = true) {
        try {
            const offset = (page - 1) * limit;

            // Build base queries
            let baseQuery = `SELECT * FROM ${this.tableName}`;
            let countQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;

            if (activeOnly) {
                baseQuery += ` WHERE trang_thai = true`;
                countQuery += ` WHERE trang_thai = true`;
            }

            // Determine whether the table has a 'thu_tu' column to build a safe ORDER BY
            const colCheck = await pool.query(
                `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name = $2`,
                [this.tableName, 'thu_tu']
            );

            const orderClause = colCheck.rowCount > 0 ? ' ORDER BY thu_tu ASC, created_at DESC' : ' ORDER BY created_at DESC';

            const query = `${baseQuery}${orderClause} LIMIT $1 OFFSET $2`;

            const [dataResult, countResult] = await Promise.all([
                pool.query(query, [limit, offset]),
                pool.query(countQuery)
            ]);

            return {
                data: dataResult.rows,
                total: parseInt(countResult.rows[0].total),
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(countResult.rows[0].total / limit)
            };
        } catch (error) {
            console.error(`Error in Category.findAll for ${this.tableName}:`, error);
            throw error;
        }
    }

    // Get item by ID
    async findById(id) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE ${this.idField} = $1`;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error in Category.findById for ${this.tableName}:`, error);
            throw error;
        }
    }

    // Generate next auto-incrementing code for the category
    async generateNextCode() {
        try {
            const codeField = this.getCodeFieldName();
            // Get current max code for this table
            const codeRes = await pool.query(`SELECT ${codeField} FROM ${this.tableName} WHERE ${codeField} IS NOT NULL ORDER BY ${codeField} DESC LIMIT 1`);
            let nextCode = '001';

            if (codeRes.rows.length > 0) {
                const lastCode = codeRes.rows[0][codeField];
                // Extract prefix and number
                const match = lastCode.match(/^([A-Z]+)(\d+)$/);
                if (match) {
                    const prefix = match[1];
                    const num = parseInt(match[2]);
                    nextCode = prefix + String(num + 1).padStart(3, '0');
                } else {
                    // If no pattern, just increment as number
                    const num = parseInt(lastCode.replace(/\D/g, '')) || 0;
                    nextCode = String(num + 1).padStart(3, '0');
                }
            } else {
                // First code for this table
                const prefix = this.getCodePrefix();
                nextCode = prefix + '001';
            }

            return nextCode;
        } catch (error) {
            console.error(`Error generating code for ${this.tableName}:`, error);
            // Fallback to simple increment
            const countRes = await pool.query(`SELECT COUNT(*) as count FROM ${this.tableName}`);
            const count = parseInt(countRes.rows[0].count) + 1;
            return String(count).padStart(3, '0');
        }
    }

    // Get code field name based on table name
    getCodeFieldName() {
        const fieldNames = {
            'dm_muc_dich_chuyen_di': 'ma_muc_dich',
            'dm_loai_chuyen_di': 'ma_loai_chuyen_di',
            'dm_quoc_gia': 'ma_quoc_gia',
            'dm_trang_thai_ho_so': 'ma_trang_thai',
            'dm_loai_tai_lieu': 'ma_loai_tai_lieu'
        };
        return fieldNames[this.tableName] || 'ma';
    }

    // Get code prefix based on table name
    getCodePrefix() {
        const prefixes = {
            'dm_muc_dich_chuyen_di': 'MD',
            'dm_loai_chuyen_di': 'LCD',
            'dm_quoc_gia': 'QG',
            'dm_trang_thai_ho_so': 'TT',
            'dm_loai_tai_lieu': 'TL'
        };
        return prefixes[this.tableName] || 'CAT';
    }

    // Create new item
    async create(data) {
        try {
            // Get valid columns for this table (include data_type so we can make type-safe decisions)
            const colsRes = await pool.query(
                `SELECT column_name, column_default, data_type FROM information_schema.columns WHERE table_name = $1`,
                [this.tableName]
            );

            const validCols = new Set(colsRes.rows.map(r => r.column_name));
            const colDefaults = Object.fromEntries(colsRes.rows.map(r => [r.column_name, r.column_default]));
            const columnTypes = Object.fromEntries(colsRes.rows.map(r => [r.column_name, r.data_type]));

            // Filter incoming data to valid columns only
            const filteredData = {};
            for (const key of Object.keys(data)) {
                if (validCols.has(key)) {
                    filteredData[key] = data[key];
                } else {
                    console.warn(`Ignoring unknown column '${key}' for table ${this.tableName}`);
                }
            }

            // If id field is required and not provided, attempt to generate next id when no default exists
            // Only do numeric MAX-based id generation for integer-like id columns to avoid text/integer COALESCE issues
            if (!filteredData[this.idField]) {
                const idColDefault = colDefaults[this.idField];
                const idDataType = columnTypes[this.idField];
                const isNumericId = idDataType && ['integer', 'bigint', 'numeric'].includes(idDataType);
                if (!idColDefault && isNumericId) {
                    const idRes = await pool.query(`SELECT COALESCE(MAX(${this.idField}), 0) + 1 AS next_id FROM ${this.tableName}`);
                    filteredData[this.idField] = idRes.rows[0].next_id;
                }
            }

            // If thu_tu exists in table but not provided, set it to max(thu_tu)+1
            if (validCols.has('thu_tu') && filteredData['thu_tu'] === undefined) {
                const tRes = await pool.query(`SELECT COALESCE(MAX(thu_tu), 0) + 1 AS next_thu_tu FROM ${this.tableName}`);
                filteredData['thu_tu'] = tRes.rows[0].next_thu_tu;
            }

            // Auto-generate code (ma) if column exists and not provided
            const codeField = this.getCodeFieldName();
            if (validCols.has(codeField) && filteredData[codeField] === undefined) {
                const code = await this.generateNextCode();
                filteredData[codeField] = code;
            }

            // For dm_quoc_gia, handle ma_quoc_gia field (already handled above)
            // This section can be removed as it's now handled by the generic code above

            // Ensure trang_thai defaults to true if column exists and not provided
            if (validCols.has('trang_thai') && filteredData['trang_thai'] === undefined) {
                filteredData['trang_thai'] = true;
            }

            const fields = Object.keys(filteredData);
            const values = Object.values(filteredData);
            const placeholders = fields.map((_, index) => `$${index + 1}`);

            const query = `
                INSERT INTO ${this.tableName} (${fields.join(', ')})
                VALUES (${placeholders.join(', ')})
                RETURNING *
            `;

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(`Error in Category.create for ${this.tableName}:`, error);
            throw error;
        }
    }

    // Update item
    async update(id, data) {
        try {
            // Get valid columns for this table
            const colsRes = await pool.query(
                `SELECT column_name FROM information_schema.columns WHERE table_name = $1`,
                [this.tableName]
            );

            const validCols = new Set(colsRes.rows.map(r => r.column_name));

            // Filter data to only valid and updatable columns (exclude id and created_at)
            const filtered = {};
            for (const key of Object.keys(data)) {
                if (validCols.has(key) && key !== this.idField && key !== 'created_at') {
                    filtered[key] = data[key];
                } else if (!validCols.has(key)) {
                    console.warn(`Ignoring unknown column '${key}' for update on ${this.tableName}`);
                }
            }

            const fields = Object.keys(filtered);
            if (fields.length === 0) {
                // Nothing to update; return existing row
                return await this.findById(id);
            }

            const values = Object.values(filtered);
            const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

            // Only add updated_at if the column exists in the table
            const hasUpdatedAt = validCols.has('updated_at');
            const updateSection = hasUpdatedAt ? `${setClause}, updated_at = CURRENT_TIMESTAMP` : setClause;

            const query = `
                UPDATE ${this.tableName}
                SET ${updateSection}
                WHERE ${this.idField} = $${fields.length + 1}
                RETURNING *
            `;

            const result = await pool.query(query, [...values, id]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error in Category.update for ${this.tableName}:`, error);
            throw error;
        }
    }

    // Delete item (soft delete by setting trang_thai = false)
    async delete(id) {
        try {
            // Check if table has updated_at
            const colsRes = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [this.tableName]);
            const validCols = new Set(colsRes.rows.map(r => r.column_name));
            const hasUpdatedAt = validCols.has('updated_at');

            const setClause = hasUpdatedAt ? 'trang_thai = false, updated_at = CURRENT_TIMESTAMP' : 'trang_thai = false';

            const query = `
                UPDATE ${this.tableName}
                SET ${setClause}
                WHERE ${this.idField} = $1
                RETURNING *
            `;

            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error in Category.delete for ${this.tableName}:`, error);
            throw error;
        }
    }

    // Hard delete (permanent delete)
    async hardDelete(id) {
        try {
            const query = `DELETE FROM ${this.tableName} WHERE ${this.idField} = $1 RETURNING *`;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error in Category.hardDelete for ${this.tableName}:`, error);
            throw error;
        }
    }
}

// Specific category models
class MucDichChuyenDi extends Category {
    constructor() {
        super('dm_muc_dich_chuyen_di', 'ma_muc_dich');
    }
}

class LoaiChuyenDi extends Category {
    constructor() {
        super('dm_loai_chuyen_di', 'ma_loai_chuyen_di');
    }
}

class QuocGia extends Category {
    constructor() {
        super('dm_quoc_gia', 'ma_quoc_gia');
    }
}

class TrangThaiHoSo extends Category {
    constructor() {
        super('dm_trang_thai_ho_so', 'ma_trang_thai');
    }
}

class LoaiTaiLieu extends Category {
    constructor() {
        super('dm_loai_tai_lieu', 'ma_loai_tai_lieu');
    }
}

module.exports = {
    Category,
    MucDichChuyenDi,
    LoaiChuyenDi,
    QuocGia,
    TrangThaiHoSo,
    LoaiTaiLieu
};