import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import client from "../../api/client";
import { RiArrowGoBackFill } from "react-icons/ri";

// 🎯 ALL UNIFIED CENTRAL API LAYER METHODS IMPORTED
import {
  getProductById,
  createProduct,
  updateProduct,
} from "../../api/products";

function ProductSkeleton() {
  return (
    <div className="max-w-xl mx-auto animate-pulse space-y-5">
      <div className="h-6 w-40 bg-gray-200 rounded" />
      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        <div className="h-36 bg-gray-200 rounded-xl" />
        <div className="h-10 bg-gray-200 rounded-xl" />
        <div className="h-20 bg-gray-200 rounded-xl" />
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
  const [existingImage, setExistingImage] = useState("");
  const [existingPublicId, setExistingPublicId] = useState("");

  const hasFetched = useRef(false);

  // 🎯 HARMONIZED STATE: Unified key names to prevent field mapping loops
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock: "0",
    available: true,
    image_file: null, // 🚀 Explicitly tracked as a fresh file binary wrapper property
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // 1️⃣ Fetch product categories once on component mount
  useEffect(() => {
    client
      .get("/owner/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // 2️⃣ Hydrate form fields if editing an existing item
  useEffect(() => {
    if (isEdit && !hasFetched.current) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          const data = await getProductById(id);
          if (data) {
            setExistingImage(data.image_url || "");
            setExistingPublicId(data.image_public_id || "");

            // Clean category values defensively to prevent string roadblocks
            let catId = "";
            if (data.category_id) {
              catId = data.category_id.toString();
            } else if (data.category?.id) {
              catId = data.category.id.toString();
            }

            setForm({
              name: data.name || "",
              description: data.description || "",
              price:
                data.price !== undefined && data.price !== null
                  ? data.price.toString()
                  : "",
              category_id: catId,
              stock:
                data.stock !== undefined && data.stock !== null
                  ? data.stock.toString()
                  : "0",
              available: data.is_available ?? true,
              image_file: null, // Restarts fresh on load sequence
            });
            hasFetched.current = true;
          }
        } catch (err) {
          console.error("Load product parameters exception loop:", err);
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id, isEdit]);

  // 3️⃣ Balanced Form Submission Processing Action Engine
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description || "");
      formData.append("price", parseFloat(form.price || "0"));
      formData.append("stock", parseInt(form.stock || "0"));
      formData.append("is_available", form.available ? "1" : "0");
      formData.append("category_id", form.category_id || "");

      // 🎯 FIXED DATA PAYLOAD PACKING RULES: Checks the verified file state key cleanly
      if (form.image_file) {
        // User selected a genuine raw binary file chunk from their disk
        formData.append("image", form.image_file);
      }

      // Route data safely using centralized helper layers
      if (isEdit) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }

      hasFetched.current = false;
      navigate("/products");
    } catch (err) {
      console.error("Submit operation structural crash error context:", err);
    }
  };

  if (loading) return <ProductSkeleton />;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            hasFetched.current = false;
            navigate("/products");
          }}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2"
        >
          <RiArrowGoBackFill />
          Products
        </button>
        <span className="text-gray-200">/</span>
        <h1 className="text-sm font-medium text-gray-900">
          {isEdit ? "Edit product" : "Add product"}
        </h1>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
        {/* File upload drag canvas viewport */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Product image
          </label>
          <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 bg-gray-50 overflow-hidden relative">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              // 🚀 FIXED: Point handler explicitly to update image_file property key natively!
              onChange={(e) => set("image_file", e.target.files?.[0] || null)}
            />
            {form.image_file ? (
              <img
                src={URL.createObjectURL(form.image_file)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : isEdit && existingImage ? (
              <img
                src={existingImage}
                alt="Current"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <p className="text-2xl">📷</p>
                <p className="text-xs text-gray-400">Upload image</p>
              </>
            )}
          </label>
        </div>

        {/* Name Input */}
        <input
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Product name"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />

        {/* Description Text block container */}
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />

        {/* Pricing context configuration menu */}
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

        {/* Stock management counter values */}
        <input
          type="number"
          value={form.stock}
          onChange={(e) => set("stock", e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />

        {/* Store availability badge configuration switchers */}
        <div className="flex justify-between items-center">
          <span className="text-sm">Available</span>
          <button
            type="button"
            onClick={() => set("available", !form.available)}
            className={`w-11 h-6 rounded-full transition relative flex items-center p-0.5 ${
              form.available
                ? "bg-green-500 justify-end"
                : "bg-gray-300 justify-start"
            }`}
          >
            <span className="w-5 h-5 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        {/* Form state controller buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => navigate("/products")}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {isEdit ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
