import axios from "axios";

// 🚀 FIXED FOR PRODUCTION MIXED CONTENT RULES:
// Switch from localhost back to your secure HTTPS ngrok address while testing live client deployments!
const API_BASE = "https://stinging-unknowing-dry.ngrok-free.dev/api/admin";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "ngrok-skip-browser-warning": "true", 
      Accept: "application/json", 
      "Content-Type": "application/json",
    },
  };
};

export const ownerService = {
  // 📊 GET: /api/admin/dashboard-stats
  getStats: async () => {
    const res = await axios.get(`${API_BASE}/dashboard-stats`, getHeaders());
    return res?.data ? res.data : res;
  },

  // 📋 GET: /api/admin/owners
  getOwners: async () => {
    const res = await axios.get(`${API_BASE}/owners`, getHeaders());
    return res?.data ? res.data : res;
  },

  // 🔐 POST: /api/admin/owners/{id}/toggle-status
  toggleStatus: async (id, status) => {
    const res = await axios.post(
      `${API_BASE}/owners/${id}/toggle-status`,
      { status },
      getHeaders()
    );
    return res?.data ? res.data : res;
  },

  // 🌟 POST: /api/admin/owners
  store: async (data) => {
    const res = await axios.post(`${API_BASE}/owners`, data, getHeaders());
    return res?.data ? res.data : res;
  },
};