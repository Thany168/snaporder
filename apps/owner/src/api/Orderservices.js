const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return res.json();
};

/* ─── Orders ─────────────────────────────────────────────────── */

/** GET /orders?status=&search=&page= */
export const getOrders = ({ status, search, page = 1 } = {}) => {
  const params = new URLSearchParams({ page });
  if (status && status !== "all") params.set("status", status);
  if (search) params.set("search", search);
  return request(`/orders?${params}`);
};

/** GET /orders/:id  (includes items, payment, delivery) */
export const getOrder = (id) => request(`/orders/${id}`);

/** POST /orders/:id/confirm  → sets status = confirmed */
export const confirmOrder = (id) =>
  request(`/orders/${id}/confirm`, { method: "POST" });

/** POST /orders/:id/reject */
export const rejectOrder = (id, reason = "") =>
  request(`/orders/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });

/** POST /orders/:id/assign  → sets status = delivering */
export const assignDelivery = (id, userId) =>
  request(`/orders/${id}/assign`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });

/** POST /orders/:id/deliver  → sets status = delivered (optional helper) */
export const markDelivered = (id) =>
  request(`/orders/${id}/deliver`, { method: "POST" });

/* ─── Delivery staff ──────────────────────────────────────────── */

/** GET /users?role=delivery  — list available delivery staff */
export const getDeliveryStaff = () => request(`/users?role=delivery`);
