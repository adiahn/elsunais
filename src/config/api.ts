import axios from 'axios';

// API Configuration
export const API_BASE_URL = 'https://flask-management-api.onrender.com';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if this is NOT a login request
      // Login requests should show error messages, not redirect
      const isLoginRequest = error.config?.url?.includes('/login');
      
      if (!isLoginRequest) {
        // Token expired or invalid for authenticated requests, clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
