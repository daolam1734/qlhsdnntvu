// src/routes/userRole.js
// Routes for user role assignment management

const express = require('express');
const router = express.Router();
const {
    getAllUserRoles,
    getUserRoles,
    assignRoleToUser,
    removeRoleFromUser,
    updateUserRole
} = require('../controllers/userRoleController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all user role assignments
router.get('/', getAllUserRoles);

// Get roles for a specific user
router.get('/user/:mavc', getUserRoles);

// Assign role to user
router.post('/', assignRoleToUser);

// Update user role assignment
router.put('/:mavc/:ma_vai_tro/:ngay_gan', updateUserRole);

// Remove role from user
router.delete('/:mavc/:ma_vai_tro/:ngay_gan', removeRoleFromUser);

module.exports = router;