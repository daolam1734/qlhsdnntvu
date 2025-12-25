// src/config/index.js
// Application configuration constants

export const APP_CONFIG = {
  name: process.env.REACT_APP_APP_NAME || 'QLHS_DNN_TVU',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  },
  auth: {
    jwtSecret: process.env.REACT_APP_JWT_SECRET_KEY,
    tokenExpireTime: parseInt(process.env.REACT_APP_TOKEN_EXPIRE_TIME) || 3600000,
  },
  debug: process.env.REACT_APP_DEBUG === 'true',
};

// Other configuration objects can be added here
export const UI_CONFIG = {
  theme: 'light',
  language: 'vi',
  dateFormat: 'DD/MM/YYYY',
};

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
};