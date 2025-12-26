// src/controllers/categoryController.js
// Controller for catalog/danh mục management

const {
    MucDichChuyenDi,
    LoaiChuyenDi,
    QuocGia,
    TrangThaiHoSo,
    LoaiTaiLieu
} = require('../models/Category');

// Category type mapping - instances of category models
const categoryTypes = {
    'muc-dich': new MucDichChuyenDi(),
    'loai-chuyen-di': new LoaiChuyenDi(),
    'quoc-gia': new QuocGia(),
    'trang-thai': new TrangThaiHoSo(),
    'loai-tai-lieu': new LoaiTaiLieu()
};

// Get all items for a category type
const getAllCategories = async (req, res) => {
    try {
        const { type } = req.params;
        const { page = 1, limit = 10, activeOnly = 'true' } = req.query;

        console.log('getAllCategories params:', { type, page, limit, activeOnly });

        const CategoryModel = categoryTypes[type];
        if (!CategoryModel) {
            return res.status(400).json({
                success: false,
                message: 'Loại danh mục không hợp lệ'
            });
        }

        const result = await CategoryModel.findAll(
            parseInt(page),
            parseInt(limit),
            activeOnly === 'true'
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
            message: 'Lấy danh sách thành công'
        });
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        // Return detailed error message for debugging (remove in production)
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ',
            error: error.message
        });
    }
};

// Get single item by ID
const getCategoryById = async (req, res) => {
    try {
        const { type, id } = req.params;

        const CategoryModel = categoryTypes[type];
        if (!CategoryModel) {
            return res.status(400).json({
                success: false,
                message: 'Loại danh mục không hợp lệ'
            });
        }

        const item = await CategoryModel.findById(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy mục này'
            });
        }

        res.json({
            success: true,
            data: item,
            message: 'Lấy thông tin thành công'
        });
    } catch (error) {
        console.error('Error in getCategoryById:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ'
        });
    }
};

// Create new item
const createCategory = async (req, res) => {
    try {
        const { type } = req.params;
        const data = req.body;

        const CategoryModel = categoryTypes[type];
        if (!CategoryModel) {
            return res.status(400).json({
                success: false,
                message: 'Loại danh mục không hợp lệ'
            });
        }

        // Validate required fields
        if (!data.ten || data.ten.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Tên là trường bắt buộc'
            });
        }

        // Add default values
        data.ten = data.ten.trim();
        if (data.mo_ta) {
            data.mo_ta = data.mo_ta.trim();
        }

        const newItem = await CategoryModel.create(data);

        res.status(201).json({
            success: true,
            data: newItem,
            message: 'Tạo mới thành công'
        });
    } catch (error) {
        console.error('Error in createCategory:', error);
        if (error.code === '23505') { // Unique constraint violation
            res.status(400).json({
                success: false,
                message: 'Dữ liệu đã tồn tại'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    }
};

// Update item
const updateCategory = async (req, res) => {
    try {
        const { type, id } = req.params;
        const data = req.body;

        const CategoryModel = categoryTypes[type];
        if (!CategoryModel) {
            return res.status(400).json({
                success: false,
                message: 'Loại danh mục không hợp lệ'
            });
        }

        // Check if item exists
        const existingItem = await CategoryModel.findById(id);
        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy mục này'
            });
        }

        // Validate required fields
        if (!data.ten || data.ten.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Tên là trường bắt buộc'
            });
        }

        // Clean data
        data.ten = data.ten.trim();
        if (data.mo_ta) {
            data.mo_ta = data.mo_ta.trim();
        }

        const updatedItem = await CategoryModel.update(id, data);

        res.json({
            success: true,
            data: updatedItem,
            message: 'Cập nhật thành công'
        });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        if (error.code === '23505') { // Unique constraint violation
            res.status(400).json({
                success: false,
                message: 'Dữ liệu đã tồn tại'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
    }
};

// Delete item (soft delete)
const deleteCategory = async (req, res) => {
    try {
        const { type, id } = req.params;

        const CategoryModel = categoryTypes[type];
        if (!CategoryModel) {
            return res.status(400).json({
                success: false,
                message: 'Loại danh mục không hợp lệ'
            });
        }

        // Check if item exists
        const existingItem = await CategoryModel.findById(id);
        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy mục này'
            });
        }

        await CategoryModel.delete(id);

        res.json({
            success: true,
            message: 'Xóa thành công'
        });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ'
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};