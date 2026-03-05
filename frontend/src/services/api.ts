import axios from 'axios';

const api = axios.create({
  baseURL: 'https://erp-api-production-024c.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if token is invalid/expired
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Ideally, we should redirect to the login page here, 
      // but since we have multiple login pages, we might just let the UI handle the unauthenticated state
      // or dispatch a custom event.
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
