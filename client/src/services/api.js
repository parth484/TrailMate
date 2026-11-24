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

export default API;
