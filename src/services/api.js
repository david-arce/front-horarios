// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Adjunta el token en cada request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user');
  if (stored) {
    const { access_token } = JSON.parse(stored) || {};
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
  }
  return config;
});

export default api;
