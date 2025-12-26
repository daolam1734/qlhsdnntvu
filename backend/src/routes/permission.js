// src/routes/permission.js
// Routes for permission management

const express = require('express');
const router = express.Router();
const {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
} = require('../controllers/permissionController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all permissions
router.get('/', getAllPermissions);

// Get permission by ID
router.get('/:ma_quyen', getPermissionById);

// Create new permission
router.post('/', createPermission);

// Update permission
router.put('/:ma_quyen', updatePermission);

// Delete permission
router.delete('/:ma_quyen', deletePermission);

module.exports = router;