import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stinging-unknowing-dry.ngrok-free.dev/api', 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // ADD THIS LINE BELOW:
    'ngrok-skip-browser-warning': 'true'
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