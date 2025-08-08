import axios from 'axios';
const API_URL = 'http://localhost:8000/auth';

export const register = (username, email, password) => {
  return axios.post(`${API_URL}/register`, { username, email, password });
};

export const login = async (username, password) => {
  const response = await axios
    .post(`${API_URL}/token`, new URLSearchParams({ username, password }));
  if (response.data.access_token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};