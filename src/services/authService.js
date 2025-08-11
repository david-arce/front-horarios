// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/auth';
const STORAGE_KEY = 'user';
const AUTH_EVENT = 'auth:changed';

export const register = (username, email, password, user_type) => {
  return axios.post(`${API_URL}/register`, { username, email, password, user_type });
};

export const login = async (username, password) => {
  const body = new URLSearchParams({ username, password });
  const response = await axios.post(`${API_URL}/token`, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const data = response.data;
  if (data?.access_token) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Notifica a la app que cambió el estado de auth (para mostrar el botón)
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
  // Notifica a la app que cambió el estado de auth (para ocultar el botón)
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/* --- Helpers opcionales, no rompen la lógica existente --- */
export const isAuthenticated = () => !!getCurrentUser();
export const onAuthChange = (handler) => {
  window.addEventListener(AUTH_EVENT, handler);
  return () => window.removeEventListener(AUTH_EVENT, handler);
};
