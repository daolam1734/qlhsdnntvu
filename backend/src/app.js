// src/app.js
// Express application initialization

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const permissionRoutes = require('./routes/permission');
const userRoleRoutes = require('./routes/userRole');
const rolePermissionRoutes = require('./routes/rolePermission');
const positionRoleRoutes = require('./routes/positionRole');
const { apiRateLimit } = require('./middleware/rateLimit');

// Create Express application
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use('/api/', apiRateLimit);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/position-roles', positionRoleRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);

  // Handle different types of errors
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu JSON không hợp lệ'
    });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Dữ liệu quá lớn'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Lỗi hệ thống. Vui lòng thử lại sau.'
  });
});

module.exports = app;