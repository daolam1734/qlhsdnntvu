// src/constants/index.js
// Application constants and enums

// User Roles
const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  VIEWER: 'viewer',
};

// Record Status
const RECORD_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

// Approval Status
const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Database Constraints
const DB_CONSTRAINTS = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
};

// JWT Token Types
const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
};

// File Upload
const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SPREADSHEET: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Cache TTL (in seconds)
const CACHE_TTL = {
  USER: 3600, // 1 hour
  RECORD: 1800, // 30 minutes
  APPROVAL: 900, // 15 minutes
};

// Business Rules
const BUSINESS_RULES = {
  MAX_RECORDS_PER_USER: 50,
  APPROVAL_TIMEOUT_DAYS: 7,
  RECORD_RETENTION_YEARS: 5,
};

// Department Codes
const DEPARTMENTS = {
  CNTT: 'CNTT',
  KINHTE: 'KINHTE',
  NGOAINGU: 'NGOAINGU',
  KETOAN: 'KETOAN',
  NHANSU: 'NHANSU',
};

// Travel Types
const TRAVEL_TYPES = {
  CONFERENCE: 'conference',
  TRAINING: 'training',
  BUSINESS: 'business',
  OTHER: 'other',
};

// Transportation Types
const TRANSPORTATION_TYPES = {
  PLANE: 'plane',
  TRAIN: 'train',
  BUS: 'bus',
  CAR: 'car',
  OTHER: 'other',
};

module.exports = {
  USER_ROLES,
  RECORD_STATUS,
  APPROVAL_STATUS,
  HTTP_STATUS,
  DB_CONSTRAINTS,
  TOKEN_TYPES,
  FILE_TYPES,
  PAGINATION,
  CACHE_TTL,
  BUSINESS_RULES,
  DEPARTMENTS,
  TRAVEL_TYPES,
  TRANSPORTATION_TYPES,
};