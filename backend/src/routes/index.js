// src/routes/index.js
// Main routes configuration

const express = require('express');
const authRoutes = require('../modules/auth/auth.route');
// TODO: Import other module routes when created
// const userRoutes = require('../modules/nguoi-dung/nguoi-dung.route');
// const recordRoutes = require('../modules/ho-so/ho-so.route');
// const approvalRoutes = require('../modules/phe-duyet/phe-duyet.route');
// const decisionRoutes = require('../modules/quyet-dinh/quyet-dinh.route');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'QLHS_DNN_TVU Backend API',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
// TODO: Add other routes when modules are implemented
// router.use('/users', userRoutes);
// router.use('/records', recordRoutes);
// router.use('/approvals', approvalRoutes);
// router.use('/decisions', decisionRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'API endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;