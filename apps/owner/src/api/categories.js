import client from "./client";

const OWNER_ID = import.meta.env.VITE_OWNER_ID;

export const getCategories = async () => {
  const res = await client.get("/owner/categories"); // 👈 changed to owner endpoint
  return res.data;
};

export const createCategory = async (name) => {
  const res = await client.post("/owner/categories", { name });
  return res.data;
};
