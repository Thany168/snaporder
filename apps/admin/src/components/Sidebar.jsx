import React from "react";
import { LayoutDashboard, Store, Settings, LogOut } from "lucide-react";

// 🚀 ADDED onLogout PROP DETECTOR HERE
const Sidebar = ({ currentTab, setCurrentTab, onLogout }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 hidden md:flex">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">P</div>
        <span className="text-xl font-bold tracking-tight text-slate-900">PhumYerng</span>
      </div>

      <nav className="flex-1 space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={currentTab === "dashboard"} onClick={() => setCurrentTab("dashboard")} />
        <NavItem icon={<Store size={20} />} label="Stores" active={currentTab === "stores"} onClick={() => setCurrentTab("stores")} />
        <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => {}} />
      </nav>

      {/* 🚀 LOGOUT TRIGGER REGISTERED CLEANLY HERE */}
      <button 
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors mt-auto w-full text-left"
      >
        <LogOut size={20} /> <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}>
    {icon} <span className="font-bold">{label}</span>
  </div>
);

export default Sidebar;