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

// Reject HTML responses (e.g. SPA fallback returning index.html for /api/*)
API.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
      return Promise.reject(new Error('API endpoint returned HTML instead of JSON.'));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default API;
