// src/routes/positionRole.js
// Routes for position role assignment management

const express = require('express');
const router = express.Router();
const {
    getAllPositionRoles,
    getPositionRoles,
    assignRoleToPosition,
    removeRoleFromPosition,
    getRolesByPosition,
    getAllPositions
} = require('../controllers/positionRoleController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all positions
router.get('/positions', getAllPositions);

// Get all position role assignments
router.get('/', getAllPositionRoles);

// Get roles for a specific position
router.get('/position/:ma_chuc_vu', getPositionRoles);

// Get roles by position
router.get('/roles-by-position/:ma_chuc_vu', getRolesByPosition);

// Assign role to position
router.post('/', assignRoleToPosition);

// Remove role from position
router.delete('/:ma_chuc_vu/:ma_vai_tro', removeRoleFromPosition);

module.exports = router;