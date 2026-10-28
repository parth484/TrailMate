import axios from 'axios';

// Support VITE_API_URL for Vercel/Production deployment, fallback to /api in local development
const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE = rawApiUrl
  ? `${rawApiUrl.replace(/\/$/, '')}/api`
  : '/api';

const API = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
