import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import client from "../../api/client";
import { RiArrowGoBackFill } from "react-icons/ri";

import {
  getProductById,
  createProduct,
  updateProduct,
} from "../../api/products";

//  Skeleton
function ProductSkeleton() {
  return (
    <div className="max-w-xl mx-auto animate-pulse space-y-5">
      <div className="h-6 w-40 bg-gray-200 rounded" />
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <div className="h-36 bg-gray-200 rounded-xl" />
        <div className="h-10 bg-gray-200 rounded-xl" />
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded-xl" />
          <div className="h-10 bg-gray-200 rounded-xl" />
        </div>
        <div className="h-10 bg-gray-200 rounded-xl" />
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
          <div className="w-11 h-6 bg-gray-200 rounded-full" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
          <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock: "0",
    available: true,
    image: null,
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  useEffect(() => {
    client.get("/owner/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (isEdit) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setForm({
        name: data.name || "",
        description: data.description || "",
        price: data.price?.toString() || "",
        category_id: data.category?.id?.toString() || "",
        stock: data.stock?.toString() || "0",
        available: data.is_available ?? true,
        image: null,
      });
    } catch (err) {
      console.error("Load product error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", parseFloat(form.price));
      formData.append("stock", parseInt(form.stock));
      formData.append("is_available", form.available ? 1 : 0);
      formData.append("category_id", form.category_id);
      if (form.image) formData.append("image", form.image);

      if (isEdit) {
        formData.append("_method", "PUT");
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }

      navigate("/products");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  if (loading) return <ProductSkeleton />;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/products")}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2"
        >
          <RiArrowGoBackFill className="" />
          Products
        </button>
        <span className="text-gray-200">/</span>
        <h1 className="text-sm font-medium text-gray-900">
          {isEdit ? "Edit product" : "Add product"}
        </h1>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        {/* Image */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Product image
          </label>
          <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 bg-gray-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => set("image", e.target.files?.[0])}
            />
            {form.image ? (
              <p className="text-sm text-green-600">{form.image.name}</p>
            ) : (
              <>
                <p className="text-2xl">📷</p>
                <p className="text-xs text-gray-400">Upload image</p>
              </>
            )}
          </label>
        </div>

        {/* Name */}
        <input
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Product name"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />

        {/* Description */}
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />

        {/* Price + Category */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="Price"
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
          />

          <select
            value={form.category_id}
            onChange={(e) => set("category_id", e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <input
          type="number"
          value={form.stock}
          onChange={(e) => set("stock", e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />

        {/* Available toggle */}
        <div className="flex justify-between items-center">
          <span className="text-sm">Available</span>
          <button
            onClick={() => set("available", !form.available)}
            className={`w-11 h-6 rounded-full transition ${
              form.available ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button onClick={() => navigate("/products")} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Save" : "Create"}</Button>
        </div>
      </div>
    </div>
  );
}
