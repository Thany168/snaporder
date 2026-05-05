// src/api/ownerService.js
import axios from 'axios';

// Use your ngrok URL here
const API_BASE = 'https://stinging-unknowing-dry.ngrok-free.dev/api/admin'; 

const headers = () => ({
    headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        // IMPORTANT: ngrok sometimes requires this header to skip the warning page
        'ngrok-skip-browser-warning': 'true' 
    }
});

export const ownerService = {
    getStats: () => axios.get(`${API_BASE}/dashboard-stats`, headers()),
    getOwners: () => axios.get(`${API_BASE}/owners`, headers()),
    toggleStatus: (id, status) => axios.patch(`${API_BASE}/owners/${id}/status`, { status }, headers()),
    deleteOwner: (id) => axios.delete(`${API_BASE}/owners/${id}`, headers()),
};