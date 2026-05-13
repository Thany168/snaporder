import client from "./client";

/**
 * POST /auth/owner/login
 * Body: { company_code, phone, password }
 * Returns: { token, owner }
 */
export const login = async (credentials) => {
  const res = await client.post("/auth/owner/login", credentials);
  return res.data;
};

/**
 * POST /auth/owner/logout  (invalidates Sanctum token)
 */
export const logout = async () => {
  try {
    await client.post("/auth/owner/logout");
  } finally {
    localStorage.removeItem("token");
  }
};

export const isAuthenticated = () => !!localStorage.getItem("token");
