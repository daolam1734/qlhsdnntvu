// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = this.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      // Handle token expiration
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the request with new token
          config.headers.Authorization = `Bearer ${this.getAccessToken()}`;
          return fetch(url, config);
        } else {
          // Refresh failed - clear auth data to force re-login
          console.warn('Unauthorized and refresh failed - clearing tokens');
          this.clearTokens();
          // return original 401 response for caller to handle
          return response;
        }
      }

      return response;
    } catch (error) {
      // Network errors (e.g., backend down) will end up here
      console.warn('API request failed (network error). Is the backend running?', error && error.message ? error.message : error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    let fullEndpoint = endpoint;
    
    const queryParams = Object.keys(params).filter(key => 
      params[key] !== null && params[key] !== undefined
    );
    
    if (queryParams.length > 0) {
      const searchParams = new URLSearchParams();
      queryParams.forEach(key => {
        searchParams.append(key, params[key]);
      });
      fullEndpoint += `?${searchParams.toString()}`;
    }

    return this.request(fullEndpoint);
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Token management
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Parse response
  async parseResponse(response) {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
      };
    } else {
      const text = await response.text();
      return {
        ok: response.ok,
        status: response.status,
        data: { message: text },
      };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;