const Permission = require('../models/Permission');

const permissionController = {
    getAllPermissions: async (req, res) => {
        try {
            const permissions = await Permission.findAll();
            res.json({
                success: true,
                data: permissions
            });
        } catch (error) {
            console.error('Error fetching permissions:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy danh sách quyền'
            });
        }
    },

    getPermissionById: async (req, res) => {
        try {
            const { ma_quyen } = req.params;
            const permission = await Permission.findById(parseInt(ma_quyen));

            if (!permission) {
                return res.status(404).json({
                    success: false,
                    message: 'Quyền không tồn tại'
                });
            }

            res.json({
                success: true,
                data: permission
            });
        } catch (error) {
            console.error('Error fetching permission:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy thông tin quyền'
            });
        }
    },

    createPermission: async (req, res) => {
        try {
            const permissionData = req.body;
            const permission = await Permission.create(permissionData);

            res.status(201).json({
                success: true,
                data: permission,
                message: 'Tạo quyền thành công'
            });
        } catch (error) {
            console.error('Error creating permission:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tạo quyền'
            });
        }
    },

    updatePermission: async (req, res) => {
        try {
            const { ma_quyen } = req.params;
            const permissionData = req.body;

            const permission = await Permission.update(parseInt(ma_quyen), permissionData);

            if (!permission) {
                return res.status(404).json({
                    success: false,
                    message: 'Quyền không tồn tại'
                });
            }

            res.json({
                success: true,
                data: permission,
                message: 'Cập nhật quyền thành công'
            });
        } catch (error) {
            console.error('Error updating permission:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể cập nhật quyền'
            });
        }
    },

    deletePermission: async (req, res) => {
        try {
            const { ma_quyen } = req.params;
            const permission = await Permission.delete(parseInt(ma_quyen));

            if (!permission) {
                return res.status(404).json({
                    success: false,
                    message: 'Quyền không tồn tại'
                });
            }

            res.json({
                success: true,
                message: 'Xóa quyền thành công'
            });
        } catch (error) {
            console.error('Error deleting permission:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xóa quyền'
            });
        }
    }
};

module.exports = permissionController;