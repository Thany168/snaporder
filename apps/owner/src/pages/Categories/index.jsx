import { useState, useEffect, useCallback } from "react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import client from "../../api/client";

import {
  HiOutlineFolder,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineTag,
} from "react-icons/hi";

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  //
  const loadCats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.get("/owner/categories");
      setCats(res.data);
    } catch (e) {
      setError("Failed to load categories.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCats();
  }, [loadCats]);

  const openAdd = () => {
    setForm({ name: "" });
    setEditing(null);
    setShowAdd(true);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name });
    setEditing(cat);
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const res = await client.put(`/owner/categories/${editing.id}`, {
          name: form.name,
        });
        setCats((cs) => cs.map((c) => (c.id === editing.id ? res.data : c)));
      } else {
        const res = await client.post("/owner/categories", { name: form.name });
        setCats((cs) => [...cs, res.data]);
      }
      setShowAdd(false);
    } catch (e) {
      console.error(e);
      setError("Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (cat) => {
    // optimistic update
    setCats((cs) =>
      cs.map((c) => (c.id === cat.id ? { ...c, is_active: !c.is_active } : c)),
    );
    try {
      await client.put(`/owner/categories/${cat.id}`, {
        is_active: !cat.is_active,
      });
    } catch {
      setCats((cs) =>
        cs.map((c) =>
          c.id === cat.id ? { ...c, is_active: cat.is_active } : c,
        ),
      );
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    setCats((cs) => cs.filter((c) => c.id !== id));
    try {
      await client.delete(`/owner/categories/${id}`);
    } catch {
      loadCats(); // re-sync on failure
    }
  };

  if (loading)
    return (
      <div className="space-y-5 max-w-3xl animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-4 w-28 bg-gray-200 rounded-lg"></div>

          <div className="h-10 w-36 bg-gray-200 rounded-xl"></div>
        </div>

        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
                <div className="h-3 w-24 bg-gray-100 rounded-md"></div>
              </div>

              <div className="w-10 h-5 bg-gray-200 rounded-full"></div>

              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-5 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{cats.length} categories</p>
        <Button onClick={openAdd}>
          <span className="flex items-center gap-1.5">
            <HiOutlinePlus className="text-sm" />
            Add category
          </span>
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className={`group bg-white border rounded-2xl px-5 py-4
              flex items-center gap-4 transition-all hover:shadow-sm
              ${!cat.is_active ? "opacity-60" : "border-gray-100"}`}
          >
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
              <HiOutlineFolder className="text-gray-400 text-lg" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-400">
                {cat.products_count ?? 0} products
              </p>
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggleActive(cat)}
              className={`relative w-10 h-5 rounded-full transition
                ${cat.is_active ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full
                transition-all shadow-sm ${cat.is_active ? "left-5" : "left-0.5"}`}
              />
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => openEdit(cat)}
                className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"
              >
                <HiOutlinePencil className="text-sm" />
              </button>
              <button
                onClick={() => remove(cat.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
              >
                <HiOutlineTrash className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {cats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <HiOutlineTag className="text-4xl mb-2 opacity-40" />
          <p className="text-sm">No categories yet</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title={editing ? "Edit category" : "Add category"}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Add category"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Category name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Drinks"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5
                text-sm outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
