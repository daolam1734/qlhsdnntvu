// src/routes/category.js
// Routes for catalog/danh mục management

const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');

// Public routes for reading categories (no authentication required)
router.get('/:type', getAllCategories);
router.get('/:type/:id', getCategoryById);

// Protected routes for write operations (authentication required)
router.use(authenticateToken);
router.post('/:type', createCategory);
router.put('/:type/:id', updateCategory);
router.delete('/:type/:id', deleteCategory);

module.exports = router;