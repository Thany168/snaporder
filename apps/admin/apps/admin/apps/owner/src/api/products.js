import client from "./client";

const OWNER_ID = import.meta.env.VITE_OWNER_ID;

// GET /owner/products — for owner dashboard (flat list)
export const getOwnerProducts = async () => {
  const res = await client.get("/owner/products");
  return res.data;
};

// GET /shop/:owner/products — public (categories + nested products)
export const getShopProducts = async () => {
  const res = await client.get(`/shop/${OWNER_ID}/products`);
  return res.data;
};

// POST /owner/products
export const createProduct = async (data) => {
  const res = await client.post("/owner/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await client.get(`/owner/products/${id}`);
  return res.data;
};

// PUT /owner/products/:id
export const updateProduct = async (id, data) => {
  const res = await client.post(`/owner/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await client.delete(`/owner/products/${id}`);
  return res.data;
};
