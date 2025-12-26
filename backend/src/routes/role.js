// src/routes/role.js
// Routes for role management

const express = require('express');
const router = express.Router();
const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require('../controllers/roleController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all roles
router.get('/', getAllRoles);

// Get role by ID
router.get('/:ma_vai_tro', getRoleById);

// Create new role
router.post('/', createRole);

// Update role
router.put('/:ma_vai_tro', updateRole);

// Delete role
router.delete('/:ma_vai_tro', deleteRole);

module.exports = router;