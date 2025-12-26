// src/utils/password.js
const authConfig = require('../config/auth');

class PasswordUtils {
  // Validate password strength
  static validatePassword(password) {
    const errors = [];

    if (!password || password.length < authConfig.passwordMinLength) {
      errors.push(`Mật khẩu phải có ít nhất ${authConfig.passwordMinLength} ký tự`);
    }

    if (authConfig.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất một chữ cái viết hoa');
    }

    if (authConfig.passwordRequireLowercase && !/[a-z]/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất một chữ cái viết thường');
    }

    if (authConfig.passwordRequireNumbers && !/\d/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất một chữ số');
    }

    if (authConfig.passwordRequireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Mật khẩu phải chứa ít nhất một ký tự đặc biệt');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate password strength score (0-4)
  static getPasswordStrength(password) {
    if (!password) return 0;

    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    return Math.min(score, 4);
  }

  // Get password strength description
  static getPasswordStrengthDescription(strength) {
    const descriptions = {
      0: 'Rất yếu',
      1: 'Yếu',
      2: 'Trung bình',
      3: 'Mạnh',
      4: 'Rất mạnh'
    };

    return descriptions[strength] || 'Không xác định';
  }

  // Generate random password
  static generateRandomPassword(length = 12) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';

    // Ensure at least one character from each required set
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    if (authConfig.passwordRequireSpecialChars) {
      password += symbols[Math.floor(Math.random() * symbols.length)];
    }

    // Fill the rest randomly
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}

module.exports = PasswordUtils;