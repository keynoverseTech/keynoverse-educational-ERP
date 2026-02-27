import axios from 'axios';

// Default to localhost:8000 if not specified in env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration (optional for now, but good practice)
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retrying (prevent infinite loop)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Here you would typically call a refresh token endpoint
      // For now, we'll just clear storage and redirect to login if refresh fails
      // localStorage.removeItem('auth_token');
      // window.location.href = '/super-admin/login';
    }
    
    return Promise.reject(error);
  }
);

export default client;
