import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Store, Users, DollarSign, 
  Settings, LogOut, Search, Bell, MoreVertical, 
  Trash2, ShieldCheck, ShieldAlert 
} from 'lucide-react';
import { ownerService } from './api/ownerService';

const App = () => {
  const [stats, setStats] = useState(null);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [s, o] = await Promise.all([ownerService.getStats(), ownerService.getOwners()]);
      setStats(s.data);
      setOwners(o.data.data || []);
    } catch (err) { 
        console.error("API Error:", err); 
    } finally { 
        setLoading(false); 
    }
  };

  const toggleStatus = async (owner) => {
    const next = owner.status === 'active' ? 'suspended' : 'active';
    try {
        await ownerService.toggleStatus(owner.id, next);
        setOwners(owners.map(o => o.id === owner.id ? { ...o, status: next } : o));
    } catch (err) {
        alert("Failed to update status. Check your connection.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8F9FD]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-indigo-600 tracking-widest">THREADCRAFT</p>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8F9FD] text-slate-700 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">T</div>
          <span className="text-xl font-bold tracking-tight text-slate-900">ThreadCraft</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Store size={20}/>} label="Stores" />
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors mt-auto">
          <LogOut size={20}/> <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input type="text" placeholder="Search stores..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"/>
            </div>
            <div className="flex items-center gap-3 bg-white p-1 pr-4 border border-slate-200 rounded-2xl">
              <img src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff" className="w-8 h-8 rounded-xl" alt="avatar"/>
              <span className="text-sm font-bold text-slate-900">Super Admin</span>
            </div>
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            label="Total Shops" 
            value={stats?.total_shops ?? 0} 
            change="+2.5%" 
            color="text-indigo-600" 
          />
          <StatCard 
            label="Active Subs" 
            value={stats?.active_subscriptions ?? 0} 
            change="+1.2%" 
            color="text-emerald-600" 
          />
          <StatCard 
            label="Total Revenue" 
            value={stats?.total_revenue ? `$${Number(stats.total_revenue).toLocaleString()}` : "$0"} 
            change="-0.4%" 
            color="text-amber-600" 
          />
          <StatCard 
            label="Recent Orders" 
            value={stats?.recent_orders ?? 0} 
            change="+5.7%" 
            color="text-purple-600" 
          />
        </div>

        {/* TABLE SECTION */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Manage Stores</h2>
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              + New Owner
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="px-8 py-4">Shop Details</th>
                  <th className="px-8 py-4">Owner Email</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {owners.map(owner => (
                  <tr key={owner.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold capitalize">
                          {owner.shop_name[0]}
                        </div>
                        <span className="font-bold text-slate-900">{owner.shop_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-medium">{owner.user?.email}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        owner.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {owner.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => toggleStatus(owner)}
                            title={owner.status === 'active' ? 'Suspend' : 'Activate'}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                          {owner.status === 'active' ? <ShieldAlert size={18}/> : <ShieldCheck size={18}/>}
                        </button>
                        <button className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
  }`}>
    {icon} <span className="font-bold">{label}</span>
  </div>
);

const StatCard = ({ label, value, change, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {label} <MoreVertical size={16} className="cursor-pointer"/>
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-2xl font-black ${color}`}>{value}</span>
      <span className={`text-[10px] font-bold ${change.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
        {change}
      </span>
    </div>
  </div>
);

export default App;