const RolePermission = require('../models/RolePermission');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const rolePermissionController = {
    getAllRolePermissions: async (req, res) => {
        try {
            const rolePermissions = await RolePermission.findAll();
            res.json({
                success: true,
                data: rolePermissions
            });
        } catch (error) {
            console.error('Error fetching role permissions:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy danh sách phân quyền vai trò'
            });
        }
    },

    getRolePermissions: async (req, res) => {
        try {
            const { ma_vai_tro } = req.params;
            const rolePermissions = await RolePermission.findByRole(parseInt(ma_vai_tro));

            res.json({
                success: true,
                data: rolePermissions
            });
        } catch (error) {
            console.error('Error fetching role permissions:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy quyền của vai trò'
            });
        }
    },

    assignPermissionToRole: async (req, res) => {
        try {
            const { ma_vai_tro, ma_quyen } = req.body;

            // Validate role exists
            const role = await Role.findById(ma_vai_tro);
            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Vai trò không tồn tại'
                });
            }

            // Validate permission exists
            const permission = await Permission.findById(ma_quyen);
            if (!permission) {
                return res.status(404).json({
                    success: false,
                    message: 'Quyền không tồn tại'
                });
            }

            const rolePermission = await RolePermission.assignPermission({ ma_vai_tro, ma_quyen });

            res.status(201).json({
                success: true,
                data: rolePermission,
                message: 'Gán quyền cho vai trò thành công'
            });
        } catch (error) {
            console.error('Error assigning permission to role:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể gán quyền cho vai trò'
            });
        }
    },

    removePermissionFromRole: async (req, res) => {
        try {
            const { ma_vai_tro, ma_quyen } = req.params;
            const rolePermission = await RolePermission.removePermission(parseInt(ma_vai_tro), parseInt(ma_quyen));

            if (!rolePermission) {
                return res.status(404).json({
                    success: false,
                    message: 'Phân quyền không tồn tại'
                });
            }

            res.json({
                success: true,
                message: 'Xóa quyền của vai trò thành công'
            });
        } catch (error) {
            console.error('Error removing permission from role:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xóa quyền của vai trò'
            });
        }
    },

    getPermissionsByRoles: async (req, res) => {
        try {
            const { roleIds } = req.body; // Array of role IDs
            const permissions = await RolePermission.getPermissionsByRoles(roleIds);

            res.json({
                success: true,
                data: permissions
            });
        } catch (error) {
            console.error('Error fetching permissions by roles:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy quyền theo vai trò'
            });
        }
    }
};

module.exports = rolePermissionController;