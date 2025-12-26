// src/controllers/userController.js
// Controller for user management

const User = require('../models/User');
const PasswordUtils = require('../utils/password');
const { v4: uuidv4 } = require('uuid');

// Get all users with pagination and filtering
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role, status } = req.query;

        console.log('getAllUsers params:', { page, limit, search, role, status });

        const result = await User.findAll(
            parseInt(page),
            parseInt(limit),
            { search, role, status: status ? status === 'true' : undefined }
        );

        res.json({
            success: true,
            data: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages
            },
            message: 'Lấy danh sách người dùng thành công'
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ',
            error: error.message
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.json({
            success: true,
            data: user.toJSON(),
            message: 'Lấy thông tin người dùng thành công'
        });
    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ'
        });
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        const {
            mavc,
            ten_dang_nhap,
            email,
            mat_khau,
            vai_tro,
            trang_thai = true
        } = req.body;

        // Validate required fields
        if (!mavc || !ten_dang_nhap || !vai_tro) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc: mavc, ten_dang_nhap, vai_tro'
            });
        }

        // Check if user already exists
        const existingUser = await User.findByUsernameOrEmail(ten_dang_nhap);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập đã tồn tại'
            });
        }

        if (email) {
            const existingEmail = await User.findByUsernameOrEmail(email);
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng'
                });
            }
        }

        // Hash password if provided
        let hashedPassword = null;
        if (mat_khau) {
            hashedPassword = await PasswordUtils.hashPassword(mat_khau);
        }

        const newUser = await User.create({
            mavc,
            ten_dang_nhap,
            email,
            mat_khau_hash: hashedPassword,
            vai_tro,
            trang_thai
        });

        // Return user without password
        const userResponse = { ...newUser.toJSON() };
        delete userResponse.mat_khau_hash;

        res.status(201).json({
            success: true,
            data: userResponse,
            message: 'Tạo người dùng thành công'
        });
    } catch (error) {
        console.error('Error in createUser:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ'
        });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            ten_dang_nhap,
            email,
            vai_tro,
            trang_thai
        } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Check if username/email conflicts with other users
        if (ten_dang_nhap && ten_dang_nhap !== user.ten_dang_nhap) {
            const existingUser = await User.findByUsernameOrEmail(ten_dang_nhap);
            if (existingUser && existingUser.mavc !== parseInt(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên đăng nhập đã tồn tại'
                });
            }
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findByUsernameOrEmail(email);
            if (existingEmail && existingEmail.mavc !== parseInt(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng'
                });
            }
        }

        const updatedUser = await User.update(id, {
            ten_dang_nhap,
            email,
            vai_tro,
            trang_thai
        });

        // Return user without password
        const userResponse = { ...updatedUser.toJSON() };
        delete userResponse.mat_khau_hash;

        res.json({
            success: true,
            data: userResponse,
            message: 'Cập nhật người dùng thành công'
        });
    } catch (error) {
        console.error('Error in updateUser:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ'
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        await User.delete(id);

        res.json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ'
        });
    }
};

// Toggle user status (activate/deactivate)
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        const updatedUser = await User.update(id, {
            trang_thai: !user.trang_thai
        });

        res.json({
            success: true,
            data: { trang_thai: updatedUser.trang_thai },
            message: `Người dùng đã được ${updatedUser.trang_thai ? 'kích hoạt' : 'vô hiệu hóa'}`
        });
    } catch (error) {
        console.error('Error in toggleUserStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ'
        });
    }
};

// Reset user password
const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu mật khẩu mới'
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        const hashedPassword = await PasswordUtils.hashPassword(newPassword);
        await User.update(id, { mat_khau_hash: hashedPassword });

        res.json({
            success: true,
            message: 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {
        console.error('Error in resetUserPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserPassword
};