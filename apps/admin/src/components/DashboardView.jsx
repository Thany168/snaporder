import React from "react";
import { MoreVertical } from "lucide-react";

const DashboardView = ({ stats, setCurrentTab }) => {
  return (
    <div>
      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Shops" value={stats?.totalShops ?? 0} change="+2.5%" color="text-indigo-600" />
        <StatCard label="Active Subs" value={stats?.activeSubs ?? 0} change="+1.2%" color="text-emerald-600" />
        <StatCard label="Total Revenue" value={stats?.totalRevenue ? `$${Number(stats.totalRevenue).toLocaleString()}` : "$0"} change="-0.4%" color="text-amber-600" />
        <StatCard label="Recent Orders" value={stats?.recentOrders ?? 0} change="+5.7%" color="text-purple-600" />
      </div>

      {/* Quick Info Welcome Box */}
      <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Welcome to PhumYerng Control Panel</h3>
        <p className="text-sm text-slate-400 mb-6">Create new clients and fully monitor store portals effortlessly.</p>
        <button 
          onClick={() => setCurrentTab("stores")}
          className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
        >
          Open Stores Manager →
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, change, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {label} <MoreVertical size={16} className="cursor-pointer" />
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-2xl font-black ${color}`}>{value}</span>
      <span className={`text-[10px] font-bold ${change.includes("+") ? "text-emerald-500" : "text-rose-500"}`}>
        {change}
      </span>
    </div>
  </div>
);

export default DashboardView;