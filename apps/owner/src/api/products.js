import client from "./client";

/**
 * 💼 OWNER PORTAL DASHBOARD ENDPOINTS (Authenticated via Sanctum Bearer Tokens)
 * Backend automatically captures owner_id from Token sessions!
 */

// 1. GET /api/owner/products — for owner dashboard product table lists (flat list)
export const getOwnerProducts = async () => {
  const res = await client.get("/owner/products");
  return res.data;
};

// 2. GET /api/owner/products/{id} — Fetch single item for editing parameters
export const getProductById = async (id) => {
  const res = await client.get(`/owner/products/${id}`);
  return res.data;
};

// 3. POST /api/owner/products — Create brand new storefront items
export const createProduct = async (formData) => {
  const res = await client.post("/owner/products", formData, {
    headers: { "Content-Type": "multipart/form-data" }, // Crucial for file binary handling
  });
  return res.data;
};

// 4. POST /api/owner/products/{id} (Spoofed as PUT) — Update item records cleanly
export const updateProduct = async (id, formData) => {
  // 🎯 THE WORKAROUND: Force multipart parsing on PHP backend environments
 if (formData instanceof FormData && !formData.has('_method')) {
    formData.append('_method', 'PUT'); // ⚡ This alters the payload to look like a PUT request under the hood!
  }

  // 🚀 UNIFIED ACTION: Fires form updates over a unified central pipeline handler
  const res = await client.post(`/owner/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 5. DELETE /api/owner/products/{id} — Wipe item from server storage disks and database
export const deleteProduct = async (id) => {
  const res = await client.delete(`/owner/products/${id}`);
  return res.data;
};


/**
 * 🌐 PUBLIC CUSTOMER MINI APP ENDPOINTS (Public - No Token Needed)
 * Requires passing the target store profile ID dynamically!
 */

// 6. GET /api/shop/{ownerId}/products — Public menu loading (Categories + Nested Products)
export const getShopProducts = async (ownerId) => {
  const res = await client.get(`/shop/${ownerId}/products`);
  return res.data;
};