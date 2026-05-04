import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import {
  getOwnerProducts,
  deleteProduct,
  updateProduct,
} from "../../api/products";
import {
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getOwnerProducts();
      setProducts(data);
    } catch (e) {
      setError("Failed to load products. Check your token.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Toggle available — calls API
  const toggleAvailable = async (product) => {
    // Optimistic update
    setProducts((ps) =>
      ps.map((p) =>
        p.id === product.id ? { ...p, is_available: !p.is_available } : p,
      ),
    );
    try {
      await updateProduct(product.id, { is_available: !product.is_available });
    } catch {
      // Revert on failure
      setProducts((ps) =>
        ps.map((p) =>
          p.id === product.id
            ? { ...p, is_available: product.is_available }
            : p,
        ),
      );
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    // Optimistic remove
    setProducts((ps) => ps.filter((p) => p.id !== id));
    try {
      await deleteProduct(id);
    } catch {
      // Reload on failure
      loadProducts();
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ── Loading state ──
  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-7 h-7 border-2 border-blue-500 border-t-transparent
        rounded-full animate-spin"
        />
      </div>
    );

  return (
    <div className="space-y-5">
      {/* Error */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-600 text-sm
          px-4 py-3 rounded-xl flex items-center justify-between"
        >
          <span>{error}</span>
          <button onClick={loadProducts} className="underline text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch
            className="absolute left-3 top-1/2 -translate-y-1/2
            text-gray-400 text-sm"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5
              text-sm outline-none focus:border-blue-400"
          />
        </div>
        <Button onClick={() => navigate("/products/new")}>Add product</Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* Product name */}
                <td className="px-4 py-3 font-medium text-gray-800">
                  {product.name}
                  {product.description && (
                    <p
                      className="text-xs text-gray-400 font-normal mt-0.5 truncate
                      max-w-[160px]"
                    >
                      {product.description}
                    </p>
                  )}
                </td>

                {/* Category */}
                <td className="px-4 py-3 text-gray-500">
                  {product.category?.name ?? "—"}
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-blue-600 font-semibold">
                  ${parseFloat(product.price).toFixed(2)}
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  {product.stock === -1 ? (
                    <span className="text-gray-400">Unlimited</span>
                  ) : product.stock === 0 ? (
                    <span className="text-red-500 font-medium">
                      Out of stock
                    </span>
                  ) : (
                    <span className="text-green-600">{product.stock}</span>
                  )}
                </td>

                {/* Available toggle */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAvailable(product)}
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      transition ${
                        product.is_available
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {product.is_available ? "Available" : "Disabled"}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-gray-500
                        hover:text-blue-600 transition"
                    >
                      <HiOutlinePencil />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-500
                        hover:text-red-500 transition"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-400">
            No products found
          </div>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
