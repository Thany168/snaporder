import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stinging-unknowing-dry.ngrok-free.dev/api', // Your Laravel API URL
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Automatically add Bearer Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;