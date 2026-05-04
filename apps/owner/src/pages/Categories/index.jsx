import { useState } from "react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

import {
  HiOutlineFolder,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineTag,
} from "react-icons/hi";

const INIT = [
  { id: 1, name: "Drinks", products: 2, active: true, sort: 1 },
  { id: 2, name: "Food", products: 2, active: true, sort: 2 },
];

export default function Categories() {
  const [cats, setCats] = useState(INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const openAdd = () => {
    setForm({ name: "" });
    setEditing(null);
    setShowAdd(true);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name });
    setEditing(cat.id);
    setShowAdd(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    if (editing) {
      setCats((cs) =>
        cs.map((c) => (c.id === editing ? { ...c, name: form.name } : c)),
      );
    } else {
      setCats((cs) => [
        ...cs,
        {
          id: Date.now(),
          name: form.name,
          products: 0,
          active: true,
          sort: cs.length + 1,
        },
      ]);
    }

    setShowAdd(false);
  };

  const toggleActive = (id) => {
    setCats((cs) =>
      cs.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  };

  const remove = (id) => {
    setCats((cs) => cs.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-5 max-w-3xl">
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
            flex items-center gap-4 transition-all
            hover:shadow-sm ${!cat.active ? "opacity-60" : "border-gray-100"}`}
          >
            {/* Icon */}
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
              <HiOutlineFolder className="text-gray-400 text-lg" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.products} products</p>
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggleActive(cat.id)}
              className={`relative w-10 h-5 rounded-full transition
              ${cat.active ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full
                transition-all shadow-sm
                ${cat.active ? "left-5" : "left-0.5"}`}
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
            <Button onClick={handleSave}>
              {editing ? "Save changes" : "Add category"}
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
