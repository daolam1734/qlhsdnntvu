// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.initializeAuth();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Không thể khởi tạo trạng thái đăng nhập');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login(credentials);

      if (result.success) {
        setUser(result.user);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if API call fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.updateProfile(profileData);

      if (result.success) {
        setUser(result.user);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.changePassword(passwordData);

      if (result.success) {
        // Logout after password change for security
        setUser(null);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;