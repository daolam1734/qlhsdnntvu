// src/routes/rolePermission.js
// Routes for role permission assignment management

const express = require('express');
const router = express.Router();
const {
    getAllRolePermissions,
    getRolePermissions,
    assignPermissionToRole,
    removePermissionFromRole,
    getPermissionsByRoles
} = require('../controllers/rolePermissionController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all role permission assignments
router.get('/', getAllRolePermissions);

// Get permissions for a specific role
router.get('/role/:ma_vai_tro', getRolePermissions);

// Get permissions for multiple roles
router.post('/by-roles', getPermissionsByRoles);

// Assign permission to role
router.post('/', assignPermissionToRole);

// Remove permission from role
router.delete('/:ma_vai_tro/:ma_quyen', removePermissionFromRole);

module.exports = router;