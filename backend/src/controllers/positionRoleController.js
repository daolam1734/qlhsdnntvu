const PositionRole = require('../models/PositionRole');
const pool = require('../config/database');

const positionRoleController = {
    getAllPositionRoles: async (req, res) => {
        try {
            const positionRoles = await PositionRole.findAll();
            res.json({
                success: true,
                data: positionRoles
            });
        } catch (error) {
            console.error('Error fetching position roles:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy danh sách phân vai trò chức vụ'
            });
        }
    },

    getPositionRoles: async (req, res) => {
        try {
            const { ma_chuc_vu } = req.params;
            const positionRoles = await PositionRole.findByPosition(parseInt(ma_chuc_vu));

            res.json({
                success: true,
                data: positionRoles
            });
        } catch (error) {
            console.error('Error fetching position roles:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy vai trò của chức vụ'
            });
        }
    },

    assignRoleToPosition: async (req, res) => {
        try {
            const { ma_chuc_vu, ma_vai_tro } = req.body;

            // Validate position exists
            const positionQuery = 'SELECT * FROM chuc_vu WHERE ma_chuc_vu = $1';
            const positionResult = await pool.query(positionQuery, [ma_chuc_vu]);
            if (positionResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Chức vụ không tồn tại'
                });
            }

            // Validate role exists
            const roleQuery = 'SELECT * FROM vai_tro WHERE ma_vai_tro = $1';
            const roleResult = await pool.query(roleQuery, [ma_vai_tro]);
            if (roleResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Vai trò không tồn tại'
                });
            }

            const positionRole = await PositionRole.assignRole({ ma_chuc_vu, ma_vai_tro });

            res.status(201).json({
                success: true,
                data: positionRole,
                message: 'Gán vai trò cho chức vụ thành công'
            });
        } catch (error) {
            console.error('Error assigning role to position:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể gán vai trò cho chức vụ'
            });
        }
    },

    removeRoleFromPosition: async (req, res) => {
        try {
            const { ma_chuc_vu, ma_vai_tro } = req.params;
            const positionRole = await PositionRole.removeRole(parseInt(ma_chuc_vu), parseInt(ma_vai_tro));

            if (!positionRole) {
                return res.status(404).json({
                    success: false,
                    message: 'Phân vai trò chức vụ không tồn tại'
                });
            }

            res.json({
                success: true,
                message: 'Xóa vai trò của chức vụ thành công'
            });
        } catch (error) {
            console.error('Error removing role from position:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xóa vai trò của chức vụ'
            });
        }
    },

    getRolesByPosition: async (req, res) => {
        try {
            const { ma_chuc_vu } = req.params;
            const roles = await PositionRole.getRolesByPosition(parseInt(ma_chuc_vu));

            res.json({
                success: true,
                data: roles
            });
        } catch (error) {
            console.error('Error fetching roles by position:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy vai trò theo chức vụ'
            });
        }
    },

    getAllPositions: async (req, res) => {
        try {
            const query = 'SELECT * FROM chuc_vu ORDER BY ma_chuc_vu';
            const result = await pool.query(query);
            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            console.error('Error fetching positions:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy danh sách chức vụ'
            });
        }
    }
};

module.exports = positionRoleController;