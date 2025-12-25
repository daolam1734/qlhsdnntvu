// src/hooks/index.js
// Custom React hooks

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { storageUtils } from '../utils';

// Authentication hook
export const useAuth = () => {
  const [user, setUser] = useState(storageUtils.get('user'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!storageUtils.get('authToken'));
  const navigate = useNavigate();

  const login = useCallback(async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user: userData } = response.data;

      storageUtils.set('authToken', token);
      storageUtils.set('user', userData);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  }, []);

  const logout = useCallback(() => {
    storageUtils.remove('authToken');
    storageUtils.remove('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const checkAuth = useCallback(() => {
    const token = storageUtils.get('authToken');
    const userData = storageUtils.get('user');
    setIsAuthenticated(!!token);
    setUser(userData);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
};

// API hook for data fetching
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Local storage hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return storageUtils.get(key) || initialValue;
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      storageUtils.set(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
};

// Window size hook
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Debounced value hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Form validation hook (basic)
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      // Validate on change if field was touched
      const error = validationRules[name]?.(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validationRules]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validationRules[name]?.(values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validationRules]);

  const validate = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach(key => {
      const error = validationRules[key](values[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};