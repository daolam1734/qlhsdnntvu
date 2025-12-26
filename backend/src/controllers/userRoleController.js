const UserRole = require('../models/UserRole');
const User = require('../models/User');
const Role = require('../models/Role');

const userRoleController = {
    getAllUserRoles: async (req, res) => {
        try {
            const userRoles = await UserRole.findAll();
            res.json({
                success: true,
                data: userRoles
            });
        } catch (error) {
            console.error('Error fetching user roles:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy danh sách phân vai trò người dùng'
            });
        }
    },

    getUserRoles: async (req, res) => {
        try {
            const { mavc } = req.params;
            const userRoles = await UserRole.findByUser(parseInt(mavc));

            res.json({
                success: true,
                data: userRoles
            });
        } catch (error) {
            console.error('Error fetching user roles:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể lấy vai trò của người dùng'
            });
        }
    },

    assignRoleToUser: async (req, res) => {
        try {
            const userRoleData = req.body;

            // Validate user exists
            const user = await User.findById(userRoleData.mavc);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Người dùng không tồn tại'
                });
            }

            // Validate role exists
            const role = await Role.findById(userRoleData.ma_vai_tro);
            if (!role) {
                return res.status(404).json({
                    success: false,
                    message: 'Vai trò không tồn tại'
                });
            }

            const userRole = await UserRole.assignRole(userRoleData);

            res.status(201).json({
                success: true,
                data: userRole,
                message: 'Gán vai trò cho người dùng thành công'
            });
        } catch (error) {
            console.error('Error assigning role to user:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể gán vai trò cho người dùng'
            });
        }
    },

    removeRoleFromUser: async (req, res) => {
        try {
            const { mavc, ma_vai_tro, ngay_gan } = req.params;
            const userRole = await UserRole.removeRole(parseInt(mavc), parseInt(ma_vai_tro), ngay_gan);

            if (!userRole) {
                return res.status(404).json({
                    success: false,
                    message: 'Phân vai trò không tồn tại'
                });
            }

            res.json({
                success: true,
                message: 'Xóa vai trò của người dùng thành công'
            });
        } catch (error) {
            console.error('Error removing role from user:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể xóa vai trò của người dùng'
            });
        }
    },

    updateUserRole: async (req, res) => {
        try {
            const { mavc, ma_vai_tro, ngay_gan } = req.params;
            const updateData = req.body;

            const userRole = await UserRole.updateRole(parseInt(mavc), parseInt(ma_vai_tro), ngay_gan, updateData);

            if (!userRole) {
                return res.status(404).json({
                    success: false,
                    message: 'Phân vai trò không tồn tại'
                });
            }

            res.json({
                success: true,
                data: userRole,
                message: 'Cập nhật phân vai trò thành công'
            });
        } catch (error) {
            console.error('Error updating user role:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể cập nhật phân vai trò'
            });
        }
    }
};

module.exports = userRoleController;