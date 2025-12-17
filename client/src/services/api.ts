import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for adding auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token when auth is implemented
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for handling errors globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle specific error cases (401, 403, etc.)
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
