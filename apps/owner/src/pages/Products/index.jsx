import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import * as XLSX from "xlsx";
import { createCategory, getCategories } from "../../api/categories";
import { LuImport, LuPlus } from "react-icons/lu";
import { BsBackspace } from "react-icons/bs";
import { MdBackup } from "react-icons/md";

import {
  getOwnerProducts,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../../api/products";
import {
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineUpload,
  HiOutlineDocumentDownload,
} from "react-icons/hi";

const ITEMS_PER_PAGE = 10;

const TEMPLATE_COLUMNS = ["Name", "Category", "Price", "Stock", "Status"];

const TEMPLATE_SAMPLE_ROWS = [
  {
    Name: "Product A",
    Category: "Food",
    Price: 5.99,
    Stock: 100,
    Status: "Available",
  },
  {
    Name: "Product B",
    Category: "Drinks",
    Price: 2.5,
    Stock: -1,
    Status: "Available",
  },
  {
    Name: "Product C",
    Category: "Snacks",
    Price: 1.25,
    Stock: 0,
    Status: "Disabled",
  },
];

function parseImportRow(row) {
  return {
    name: String(row["Name"] ?? "").trim(),
    category_name: String(row["Category"] ?? "").trim(),
    price: parseFloat(row["Price"]) || 0,
    stock: parseInt(row["Stock"], 10) || 0,
    is_available:
      String(row["Status"] ?? "")
        .trim()
        .toLowerCase() === "available",
  };
}

function readWorkbook(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        resolve(XLSX.utils.sheet_to_json(sheet));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

function Pagination({ page, total, onChange }) {
  if (total <= 1) return null;

  const getPages = () => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (page >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", page - 1, page, page + 1, "...", total];
  };

  const btn =
    "w-9 h-9 rounded-lg text-sm font-medium transition flex items-center justify-center";

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${btn} border border-gray-200 text-gray-500
          hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ‹
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span
            key={`dot-${i}`}
            className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`${btn} ${
              p === page
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        className={`${btn} border border-gray-200 text-gray-500
          hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ›
      </button>
    </div>
  );
}

function ImagePreviewModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen
  bg-black/80 z-[99999] flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 text-white text-3xl"
        onClick={onClose}
        aria-label="Close preview"
      >
        <HiOutlineX />
      </button>
      <img
        src={src}
        alt="Preview"
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl animate-[zoomIn_.2s_ease]"
      />
    </div>
  );
}

function ImportModal({ onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(TEMPLATE_SAMPLE_ROWS, {
      header: TEMPLATE_COLUMNS,
    });
    ws["!cols"] = TEMPLATE_COLUMNS.map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "product_import_template.xlsx");
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setImportError("");

    //  Parse file
    let rawRows;
    try {
      rawRows = await readWorkbook(file);
    } catch (err) {
      setImportError(`Could not read file: ${err.message}`);
      setImporting(false);
      return;
    }

    if (rawRows.length === 0) {
      setImportError("The file is empty. Please add at least one product row.");
      setImporting(false);
      return;
    }

    // . Validate columns
    const missing = TEMPLATE_COLUMNS.filter((col) => !(col in rawRows[0]));
    if (missing.length > 0) {
      setImportError(
        `Missing column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. ` +
          `Download the template to see the correct format.`,
      );
      setImporting(false);
      return;
    }

    try {
      const products = rawRows.map(parseImportRow);

      // Fetch + auto-create categories
      const existingCats = await getCategories();
      const catMap = {};
      existingCats.forEach((c) => {
        catMap[c.name.toLowerCase()] = c.id;
      });

      const uniqueNames = [
        ...new Set(products.map((p) => p.category_name.toLowerCase())),
      ];
      for (const name of uniqueNames) {
        if (!catMap[name]) {
          const created = await createCategory(name);
          catMap[name] = created.id;
        }
      }

      //  Send products one-by-one, collect results
      const results = await Promise.allSettled(
        products.map((p) => {
          const fd = new FormData();
          fd.append("name", p.name);
          fd.append("category_id", catMap[p.category_name.toLowerCase()]);
          fd.append("price", p.price);
          fd.append("stock", p.stock);
          fd.append("is_available", p.is_available ? "1" : "0");
          return createProduct(fd);
        }),
      );

      const failed = results.filter((r) => r.status === "rejected");
      const created = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      if (created.length > 0) onImported(created);

      if (failed.length > 0) {
        const reason =
          failed[0].reason?.response?.data?.message ??
          failed[0].reason?.message ??
          "Unknown error";
        setImportError(
          `${created.length} product${created.length !== 1 ? "s" : ""} imported. ` +
            `${failed.length} failed — ${reason}`,
        );
      } else {
        onClose();
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ?? err?.message ?? "Unexpected error";
      setImportError(message);
    } finally {
      setImporting(false);
    }
  };
  //

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Import Products
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <BsBackspace />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <label
            className="flex flex-col items-center justify-center w-full h-36
            border-2 border-dashed border-gray-300 rounded-2xl
            cursor-pointer hover:border-blue-400 transition"
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files[0] ?? null);
                setImportError("");
              }}
            />
            <HiOutlineUpload className="text-2xl text-gray-400 mb-2" />
            {file ? (
              <p className="text-sm font-medium text-blue-600">{file.name}</p>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  Click to upload Excel or CSV file
                </p>
                <p className="text-xs text-gray-400 mt-1">.xlsx, .xls, .csv</p>
              </>
            )}
          </label>

          <p className="text-xs text-gray-400">
            Expected columns:{" "}
            <span className="font-medium text-gray-600">
              {TEMPLATE_COLUMNS.join(", ")}
            </span>
            . Download the template below to get started.
          </p>

          {importError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {importError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
          >
            <HiOutlineDocumentDownload />
            Download Template
          </button>
          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700
              transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? (
              "Generating"
            ) : (
              <span className="flex items-center gap-2">
                <MdBackup />
                Generate
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonRows({ count = 6 }) {
  return [...Array(count)].map((_, i) => (
    <div key={i} className="grid grid-cols-6 gap-4 px-4 py-3">
      <div className="h-4 bg-gray-200 rounded col-span-2" />
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded" />
    </div>
  ));
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [openImport, setOpenImport] = useState(false);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filtered = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, search],
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [filtered, page],
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const toggleAvailable = useCallback(async (product) => {
    setProducts((ps) =>
      ps.map((p) =>
        p.id === product.id ? { ...p, is_available: !p.is_available } : p,
      ),
    );
    try {
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("is_available", product.is_available ? 0 : 1);
      await updateProduct(product.id, fd);
    } catch {
      setProducts((ps) =>
        ps.map((p) =>
          p.id === product.id
            ? { ...p, is_available: product.is_available }
            : p,
        ),
      );
    }
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (!confirm("Delete this product?")) return;
      setProducts((ps) => ps.filter((p) => p.id !== id));
      try {
        await deleteProduct(id);
      } catch {
        loadProducts();
      }
    },
    [loadProducts],
  );

  const handleImported = useCallback((newProducts) => {
    setProducts((ps) => [...ps, ...newProducts]);
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
          <div className="w-32 h-10 bg-gray-200 rounded-xl" />
          <div className="w-32 h-10 bg-gray-200 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y">
            <SkeletonRows count={6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Error banner */}
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
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5
              text-sm outline-none focus:border-blue-400"
          />
        </div>

        <Button
          onClick={() => setOpenImport(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600
    text-white text-sm font-medium hover:bg-green-800 active:scale-95
    transition-all duration-150 shadow-sm"
        >
          <LuImport className="text-lg" />
          Import Products
        </Button>
        <Button
          onClick={() => navigate("/products/new")}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700
            active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md"
        >
          <LuPlus className="text-lg" />
          Add Product
        </Button>
      </div>

      {/* Import modal */}
      {openImport && (
        <ImportModal
          onClose={() => setOpenImport(false)}
          onImported={handleImported}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Image */}
                  <td className="px-4 py-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        onClick={() => setPreview(product.image_url)}
                        className="w-10 h-10 rounded-lg object-cover
                          cursor-pointer hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg bg-gray-100
                        flex items-center justify-center text-gray-300 text-xs"
                      >
                        N/A
                      </div>
                    )}
                  </td>

                  {/* Product */}
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {product.name}
                    {product.description && (
                      <p className="text-xs text-gray-400 font-normal mt-0.5 truncate max-w-[160px]">
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

                  {/* Status */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAvailable(product)}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition ${
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
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition"
                        aria-label="Edit product"
                      >
                        <HiOutlinePencil />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition"
                        aria-label="Delete product"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginated.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination page={page} total={totalPages} onChange={setPage} />

      {/* Count */}
      <p className="text-xs text-gray-400 text-center">
        {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        {totalPages > 1 && ` · page ${page} of ${totalPages}`}
      </p>

      {/* Image preview modal */}
      <ImagePreviewModal src={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
