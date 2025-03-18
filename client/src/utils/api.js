import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to check if token is expired
const isTokenExpired = (token) => {
  try {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Function to clear auth state
const clearAuthState = () => {
  try {
    store.dispatch(logout());
  } catch (error) {
    console.error('Error clearing auth state:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
  }
};

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token in request interceptor:', token ? 'exists' : 'not found');
      
      if (token) {
        if (isTokenExpired(token)) {
          console.warn('Token is expired, clearing auth state');
          clearAuthState();
          return Promise.reject('Token expired');
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.warn('Unauthorized response detected, clearing auth state');
      clearAuthState();
    }
    
    return Promise.reject(error);
  }
);

export default api; 
