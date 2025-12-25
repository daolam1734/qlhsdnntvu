// src/utils/index.js
// Utility functions

import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // Vietnamese locale

dayjs.locale('vi');

// Date utilities
export const dateUtils = {
  format: (date, format = 'DD/MM/YYYY') => dayjs(date).format(format),
  isValid: (date) => dayjs(date).isValid(),
  addDays: (date, days) => dayjs(date).add(days, 'day'),
  diff: (date1, date2, unit = 'day') => dayjs(date1).diff(dayjs(date2), unit),
};

// String utilities
export const stringUtils = {
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  truncate: (str, length = 50) => str.length > length ? str.slice(0, length) + '...' : str,
  slugify: (str) => str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
};

// Array utilities
export const arrayUtils = {
  unique: (arr) => [...new Set(arr)],
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },
};

// Object utilities
export const objectUtils = {
  isEmpty: (obj) => Object.keys(obj).length === 0,
  pick: (obj, keys) => keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {}),
  omit: (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },
};

// Validation utilities
export const validationUtils = {
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isPhone: (phone) => /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/.test(phone),
  isStrongPassword: (password) => {
    return password.length >= 8 &&
           /[a-z]/.test(password) &&
           /[A-Z]/.test(password) &&
           /[0-9]/.test(password);
  },
};

// Local storage utilities
export const storageUtils = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  },
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};