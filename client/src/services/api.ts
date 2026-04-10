import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { getGuestId, getDisplayName } from '@/utils/guestId';

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
    config.headers['X-Viewer-Id'] = getGuestId();
    const name = getDisplayName();
    if (name) config.headers['X-Display-Name'] = name;
    // TODO: replace with JWT Bearer token when auth is implemented
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
