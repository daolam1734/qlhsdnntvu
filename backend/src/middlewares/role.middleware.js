// src/middlewares/role.middleware.js
// Role-based authorization middleware

const { responseUtils } = require('../utils');
const { HTTP_STATUS, USER_ROLES } = require('../constants');
const logger = require('../config/logger');

// Authorize specific roles
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        responseUtils.error('Authentication required.', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`Access denied for user ${req.user.username} with role ${req.user.role}. Required roles: ${allowedRoles.join(', ')}`);
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        responseUtils.error('Access denied. Insufficient permissions.', HTTP_STATUS.FORBIDDEN)
      );
    }

    logger.info(`Access granted for user ${req.user.username} with role ${req.user.role}`);
    next();
  };
};

// Specific role middlewares
const requireAdmin = authorize(USER_ROLES.ADMIN);
const requireManager = authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER);
const requireEmployee = authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE);
const requireViewer = authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE, USER_ROLES.VIEWER);

// Department-based authorization
const authorizeDepartment = (req, res, next) => {
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      responseUtils.error('Authentication required.', HTTP_STATUS.UNAUTHORIZED)
    );
  }

  // Allow admin to access all departments
  if (req.user.role === USER_ROLES.ADMIN) {
    return next();
  }

  // For other roles, check if they can access the requested department
  const requestedDepartment = req.params.department || req.body.department || req.query.department;

  if (requestedDepartment && requestedDepartment !== req.user.department) {
    // Managers can access their own department and sub-departments
    if (req.user.role === USER_ROLES.MANAGER && !isSubDepartment(req.user.department, requestedDepartment)) {
      logger.warn(`Department access denied for user ${req.user.username}`);
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        responseUtils.error('Access denied. Cannot access other departments.', HTTP_STATUS.FORBIDDEN)
      );
    }

    // Employees can only access their own department
    if (req.user.role === USER_ROLES.EMPLOYEE) {
      logger.warn(`Department access denied for user ${req.user.username}`);
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        responseUtils.error('Access denied. Cannot access other departments.', HTTP_STATUS.FORBIDDEN)
      );
    }
  }

  next();
};

// Check if department is a sub-department (helper function)
const isSubDepartment = (userDepartment, requestedDepartment) => {
  // This is a simple implementation - you might want to implement a more sophisticated hierarchy
  // For now, assume flat department structure
  return userDepartment === requestedDepartment;
};

// Resource ownership check
const checkOwnership = (resourceType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        responseUtils.error('Authentication required.', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    // Admin can access all resources
    if (req.user.role === USER_ROLES.ADMIN) {
      return next();
    }

    const resourceId = req.params.id;
    if (!resourceId) {
      return next();
    }

    try {
      // This would typically query the database to check ownership
      // For now, we'll assume the resource has a created_by field
      const db = require('../config/database');
      let query, params;

      switch (resourceType) {
        case 'record':
          query = 'SELECT created_by FROM records WHERE id = $1';
          break;
        case 'approval':
          query = 'SELECT approver_id FROM approvals WHERE id = $1';
          break;
        default:
          return next();
      }

      const result = await db.query(query, [resourceId]);

      if (result.rows.length === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(
          responseUtils.error('Resource not found.', HTTP_STATUS.NOT_FOUND)
        );
      }

      const ownerId = result.rows[0].created_by || result.rows[0].approver_id;

      if (ownerId !== req.user.id) {
        logger.warn(`Ownership check failed for user ${req.user.username} on ${resourceType} ${resourceId}`);
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          responseUtils.error('Access denied. You do not own this resource.', HTTP_STATUS.FORBIDDEN)
        );
      }

      next();
    } catch (error) {
      logger.error('Error checking resource ownership:', error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        responseUtils.error('Internal server error.', HTTP_STATUS.INTERNAL_SERVER_ERROR)
      );
    }
  };
};

module.exports = {
  authorize,
  requireAdmin,
  requireManager,
  requireEmployee,
  requireViewer,
  authorizeDepartment,
  checkOwnership
};