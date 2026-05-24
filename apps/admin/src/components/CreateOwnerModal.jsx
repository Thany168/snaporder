import React from "react";

const CreateOwnerModal = ({ isOpen, onClose, onSubmit, newOwner, setNewOwner }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900">Add New Store Portal</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Owner Name *</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={newOwner.name}
              onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address (optional)</label>
            <input
              type="email"
              placeholder="owner@example.com"
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={newOwner.email}
              onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Temporary Password *</label>
            <input
              type="password"
              required
              placeholder="******"
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={newOwner.password}
              onChange={(e) => setNewOwner({ ...newOwner, password: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number *</label>
            <input
              type="text"
              required
              placeholder="0123456789"
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={newOwner.phone}
              onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shop Name *</label>
              <input
                type="text"
                required
                placeholder="My Shop"
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                value={newOwner.shop_name}
                onChange={(e) => setNewOwner({ ...newOwner, shop_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan *</label>
              <select
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold text-slate-700"
                value={newOwner.plan}
                onChange={(e) => setNewOwner({ ...newOwner, plan: e.target.value })}
              >
                <option value="trial">Trial</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Telegram Chat ID (optional)</label>
            <input
              type="text"
              placeholder="123456789"
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={newOwner.telegram_chat_id}
              onChange={(e) => setNewOwner({ ...newOwner, telegram_chat_id: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shop Description (optional)</label>
            <textarea
              placeholder="Describe the shop..."
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none h-20 resize-none"
              value={newOwner.shop_description}
              onChange={(e) => setNewOwner({ ...newOwner, shop_description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all mt-4 shadow-lg shadow-indigo-100"
          >
            Create Owner & Active Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOwnerModal;