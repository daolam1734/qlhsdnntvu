// src/services/authService.js
import apiService from './api.js';

class AuthService {
  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      const result = await apiService.parseResponse(response);

      if (result.ok && result.data.success) {
        const { user, tokens, sessionId } = result.data.data;

        // Store tokens and user data
        apiService.setTokens(tokens.accessToken, tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('sessionId', sessionId);

        return {
          success: true,
          user,
          message: result.data.message
        };
      } else {
        return {
          success: false,
          message: result.data.message || 'Đăng nhập thất bại'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Lỗi kết nối. Vui lòng thử lại sau.'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const refreshToken = apiService.getRefreshToken();

      // Call logout API
      await apiService.post('/auth/logout', {
        sessionId,
        refreshToken
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local data
      apiService.clearTokens();
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiService.get('/auth/profile');
      const result = await apiService.parseResponse(response);

      if (result.status === 401) {
        // Unauthorized - clear tokens and cached user
        console.warn('Get profile returned 401 - clearing tokens');
        apiService.clearTokens();
        return {
          success: false,
          message: result.data?.message || 'Không xác thực'
        };
      }

      if (result.ok && result.data.success) {
        const user = result.data.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return {
          success: true,
          user
        };
      } else {
        return {
          success: false,
          message: result.data?.message || 'Không thể lấy thông tin người dùng'
        };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Lỗi kết nối. Vui lòng thử lại sau.'
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/auth/profile', profileData);
      const result = await apiService.parseResponse(response);

      if (result.ok && result.data.success) {
        const user = result.data.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return {
          success: true,
          user,
          message: result.data.message
        };
      } else {
        return {
          success: false,
          message: result.data.message || 'Cập nhật thông tin thất bại'
        };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Lỗi kết nối. Vui lòng thử lại sau.'
      };
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiService.post('/auth/change-password', passwordData);
      const result = await apiService.parseResponse(response);

      if (result.ok && result.data.success) {
        // Clear tokens after password change for security
        apiService.clearTokens();
        return {
          success: true,
          message: result.data.message
        };
      } else {
        return {
          success: false,
          message: result.data.message || 'Đổi mật khẩu thất bại'
        };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Lỗi kết nối. Vui lòng thử lại sau.'
      };
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      const result = await apiService.parseResponse(response);

      if (result.ok && result.data.success) {
        return {
          success: true,
          message: result.data.message
        };
      } else {
        return {
          success: false,
          message: result.data.message || 'Gửi email thất bại'
        };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Lỗi kết nối. Vui lòng thử lại sau.'
      };
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        newPassword
      });
      const result = await apiService.parseResponse(response);

      if (result.ok && result.data.success) {
        return {
          success: true,
          message: result.data.message
        };
      } else {
        return {
          success: false,
          message: result.data.message || 'Đặt lại mật khẩu thất bại'
        };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Lỗi kết nối. Vui lòng thử lại sau.'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = apiService.getAccessToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Initialize auth state on app start
  async initializeAuth() {
    if (this.isAuthenticated()) {
      // Try to refresh user profile in background
      this.getProfile().catch(error => {
        console.warn('Failed to refresh profile on init:', error);
        // Don't clear auth data, keep user logged in with cached data
      });
      // Return cached user immediately
      return this.getCurrentUser();
    }
    return null;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;