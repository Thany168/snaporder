import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";

const CATEGORIES = ["Drinks", "Food", "Snacks", "Desserts"];

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: isEdit ? "Iced Coffee" : "",
    description: isEdit ? "Classic iced coffee with milk" : "",
    price: isEdit ? "3.50" : "",
    category: isEdit ? "Drinks" : "",
    stock: isEdit ? "-1" : "0",
    available: true,
    image: null,
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    console.log("Submit:", form);
    navigate("/products");
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/products")}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← Products
        </button>
        <span className="text-gray-200">/</span>
        <h1 className="text-sm font-medium text-gray-900">
          {isEdit ? `Edit product` : "Add product"}
        </h1>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        {/* Image upload */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Product image
          </label>
          <label
            className="flex flex-col items-center justify-center h-36
            border-2 border-dashed border-gray-200 rounded-xl cursor-pointer
            hover:border-blue-300 transition-colors bg-gray-50"
          >
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
                <p className="text-2xl mb-1">📷</p>
                <p className="text-xs text-gray-400">Tap to upload image</p>
              </>
            )}
          </label>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Product name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Iced Coffee"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5
              text-sm outline-none focus:border-blue-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe your product..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5
              text-sm outline-none focus:border-blue-400 resize-none"
          />
        </div>

        {/* Price + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Price ($) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                text-sm outline-none focus:border-blue-400 bg-white"
            >
              <option value="">Select...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Stock (-1 = unlimited)
          </label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
            min="-1"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5
              text-sm outline-none focus:border-blue-400"
          />
        </div>

        {/* Available toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-900">Available</p>
            <p className="text-xs text-gray-400">
              Show this product in the shop
            </p>
          </div>
          <button
            onClick={() => set("available", !form.available)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              form.available ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full
              transition-all shadow-sm ${form.available ? "left-6" : "left-1"}`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/products")}
          >
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit}>
            {isEdit ? "Save changes" : "Add product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
