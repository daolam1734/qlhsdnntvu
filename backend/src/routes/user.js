// src/routes/user.js
// Routes for user management

const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserPassword
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all users with pagination and filtering
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Create new user
router.post('/', createUser);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Toggle user status (activate/deactivate)
router.patch('/:id/status', toggleUserStatus);

// Reset user password
router.patch('/:id/password', resetUserPassword);

module.exports = router;