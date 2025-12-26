const Role = require('../models/Role');

const roleController = {
    getAllRoles: async (req, res) => {
        try {
            const roles = await Role.findAll();
            res.json({
                success: true,
                data: roles
            });
        } catch (error) {
            console.error('Error fetching roles:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy danh sách vai trò'
            });
        }
    },

    getRoleById: async (req, res) => {
        try {
            const { ma_vai_tro } = req.params;
            const role = await Role.findById(parseInt(ma_vai_tro));

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Vai trò không tồn tại'
                });
            }

            res.json({
                success: true,
                data: role
            });
        } catch (error) {
            console.error('Error fetching role:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy thông tin vai trò'
            });
        }
    },

    createRole: async (req, res) => {
        try {
            const roleData = req.body;
            const role = await Role.create(roleData);

            res.status(201).json({
                success: true,
                data: role,
                message: 'Tạo vai trò thành công'
            });
        } catch (error) {
            console.error('Error creating role:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tạo vai trò'
            });
        }
    },

    updateRole: async (req, res) => {
        try {
            const { ma_vai_tro } = req.params;
            const roleData = req.body;

            const role = await Role.update(parseInt(ma_vai_tro), roleData);

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Vai trò không tồn tại'
                });
            }

            res.json({
                success: true,
                data: role,
                message: 'Cập nhật vai trò thành công'
            });
        } catch (error) {
            console.error('Error updating role:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể cập nhật vai trò'
            });
        }
    },

    deleteRole: async (req, res) => {
        try {
            const { ma_vai_tro } = req.params;
            const role = await Role.delete(parseInt(ma_vai_tro));

            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Vai trò không tồn tại'
                });
            }

            res.json({
                success: true,
                message: 'Xóa vai trò thành công'
            });
        } catch (error) {
            console.error('Error deleting role:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xóa vai trò'
            });
        }
    }
};

module.exports = roleController;