import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Store,
  Settings,
  LogOut,
  Search,
  MoreVertical,
} from "lucide-react";
import { ownerService } from "./api/ownerService";

const App = () => {
  const [stats, setStats] = useState(null);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);

  // View Navigation Tab State ('dashboard' or 'stores')
  const [currentTab, setCurrentTab] = useState("dashboard");

  // States to manage forms
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    shop_name: "",
    shop_description: "",
    telegram_chat_id: "",
    plan: "trial",
  });

  // 🌟 FIXED: Corrected the ref declaration scope to prevent 'isFetching is not defined' crash!
  const isFetchingRef = useRef(false);

  // 🌟 UNIFIED MOUNT ENGINE: Runs flawlessly on F5 browser refresh
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setLoading(false);
    return;
  }

  if (isFetchingRef.current) return;
  isFetchingRef.current = true;
  setLoading(true);

  const initializeDashboard = async () => {
    try {
      // 1. Fetch both endpoint collections together securely over ngrok tunnel paths
      const [ownersRes, statsRes] = await Promise.all([
        ownerService.getOwners(),
        ownerService.getStats()
      ]);

      // 🌟 DYNAMIC BULLETPROOF ARRAY CHECK WRAPPER:
      // This catches the database records whether they are pre-stripped by your service or raw!
      let verifiedOwnersList = [];
      
      if (Array.isArray(ownersRes)) {
        // Option A: Clean array passed straight out of your updated service layer file
        verifiedOwnersList = ownersRes;
      } else if (ownersRes?.data && Array.isArray(ownersRes.data)) {
        // Option B: Standard Axios container object payload tracking path
        verifiedOwnersList = ownersRes.data;
      } else if (ownersRes?.data?.data && Array.isArray(ownersRes.data.data)) {
        // Option C: Paginated multi-tier database object collection rows return layout mapping
        verifiedOwnersList = ownersRes.data.data;
      }

      // Commit the verified results list directly into your components display state matrix!
      setOwners(verifiedOwnersList);

      // 🌟 Extract and assign KPI statistics dashboard values cleanly
      const statsData = statsRes?.data ? statsRes.data : statsRes;
      if (statsData) {
        setStats({
          totalShops: statsData.total_shops || 0,
          activeSubs: statsData.active_subscriptions || 0,
          totalRevenue: statsData.total_revenue || 0,
          recentOrders: statsData.recent_orders || 0,
        });
      }
    } catch (err) {
      console.error("Initialization sync failed:", err);
      setOwners([]); // Handle gracefully to clear the data view grid
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  initializeDashboard();
}, []);

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    try {
      const response = await ownerService.store(newOwner);

      // Extract raw JSON object from Axios response wrapper
      const newlyCreatedOwner = response.data ? response.data : response;

      // Append newly created item straight to owners list layout
      setOwners([newlyCreatedOwner, ...owners]);

      // Automatically sync and increase your dashboard stats total counters!
      setStats((prev) => prev ? { ...prev, totalShops: (prev.totalShops || 0) + 1 } : null);

      // Close modal and clear inputs
      setIsModalOpen(false);
      setNewOwner({
        name: "",
        email: "",
        password: "",
        phone: "",
        shop_name: "",
        shop_description: "",
        telegram_chat_id: "",
        plan: "trial",
      });
    } catch (err) {
      console.error("Submission backend transaction error string: ", err);
      alert("Failed to register store portal account.");
    }
  };

  const toggleStatus = async (owner) => {
    const next = owner.status === "active" ? "suspended" : "active";
    try {
      await ownerService.toggleStatus(owner.id, next);
      setOwners(
        owners.map((o) => (o.id === owner.id ? { ...o, status: next } : o)),
      );
    } catch (err) {
      alert("Failed to update status. Check your connection.");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FD]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-indigo-600 tracking-widest uppercase">
            PhumYerng
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#F8F9FD] text-slate-700 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            PhumYerng
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {/* Dashboard Switcher Button */}
          <div onClick={() => setCurrentTab("dashboard")}>
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={currentTab === "dashboard"}
            />
          </div>
          
          {/* Stores Feature Switcher Button */}
          <div onClick={() => setCurrentTab("stores")}>
            <NavItem 
              icon={<Store size={20} />} 
              label="Stores" 
              active={currentTab === "stores"} 
            />
          </div>
          
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors mt-auto">
          <LogOut size={20} /> <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT HEADER */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900">
            {currentTab === "dashboard" ? "Dashboard Overview" : "Manage Stores Feature"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search stores..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-3 bg-white p-1 pr-4 border border-slate-200 rounded-2xl">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff"
                className="w-8 h-8 rounded-xl"
                alt="avatar"
              />
              <span className="text-sm font-bold text-slate-900">
                {user?.name || "Super Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* 🌟 VIEW 1: DASHBOARD OVERVIEW PERSPECTIVE */}
        {currentTab === "dashboard" && (
          <div>
            {/* STATS CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard label="Total Shops" value={stats?.totalShops ?? 0} change="+2.5%" color="text-indigo-600" />
              <StatCard label="Active Subs" value={stats?.activeSubs ?? 0} change="+1.2%" color="text-emerald-600" />
              <StatCard label="Total Revenue" value={stats?.totalRevenue ? `$${Number(stats.totalRevenue).toLocaleString()}` : "$0"} change="-0.4%" color="text-amber-600" />
              <StatCard label="Recent Orders" value={stats?.recentOrders ?? 0} change="+5.7%" color="text-purple-600" />
            </div>

            {/* Quick Info Box */}
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
        )}

        {/* 🌟 VIEW 2: STORES FEATURE MANAGEMENT VIEW (Permanent & Dedicated Store Manager) */}
        {currentTab === "stores" && (
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">All Owner Shop Portals</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                + New Owner
              </button>
            </div>

            <div className="overflow-hidden">
              {/* TABLE HEADERS */}
              <div className="grid grid-cols-6 items-center bg-slate-50/70 p-4 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <div>Shop Details</div>
                <div>Company Code</div>
                <div>Owner Phone</div>
                <div>Owner Email</div>
                <div>Plan Type</div>
                <div className="text-center">Status</div>
              </div>

              {/* DATA ROWS LOOPER */}
              <div className="divide-y divide-slate-100">
                {owners.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-medium">
                    No store portals registered yet.
                  </div>
                ) : (
                  owners.map((owner) => {
                    const shopName = owner?.shop_name || "Unnamed Shop";
                    const companyCode = owner?.user?.company_code || "N/A";
                    const phoneNum = owner?.user?.phone || "N/A";
                    const emailAddr = owner?.user?.email || "No Email";
                    const planType = owner?.subscription?.plan || "trial";
                    const activeStatus = owner?.status || "active";

                    return (
                      <div
                        key={owner?.id || Math.random()}
                        className="grid grid-cols-6 items-center p-4 text-slate-600 hover:bg-slate-50/80 transition-all text-sm font-medium"
                      >
                        {/* 1. Shop Details */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold uppercase shrink-0">
                            {shopName.charAt(0)}
                          </div>
                          <div className="font-bold text-slate-900 truncate">
                            {shopName}
                          </div>
                        </div>

                        {/* 2. Company Code */}
                        <div>
                          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold tracking-wider">
                            {companyCode}
                          </span>
                        </div>

                        {/* 3. Phone */}
                        <div className="text-slate-700 font-semibold">
                          {phoneNum}
                        </div>

                        {/* 4. Email */}
                        <div className="text-slate-500 text-xs truncate pr-2">
                          {emailAddr && !emailAddr.includes("@phumyerng.local")
                            ? emailAddr
                            : "No Email"}
                        </div>

                        {/* 5. Plan Badge Type */}
                        <div>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-md uppercase ${
                              planType === "pro"
                                ? "bg-amber-50 text-amber-600 border border-amber-200"
                                : planType === "basic"
                                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {planType}
                          </span>
                        </div>

                        {/* 6. Status Action Button */}
                        <div className="flex justify-center">
                          <button
                            onClick={() => toggleStatus(owner)}
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 ${
                              String(activeStatus).toLowerCase() === "active"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-rose-50 text-rose-600 border border-rose-200"
                            }`}
                          >
                            {activeStatus}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ADD NEW OWNER MODAL FORM BLOCK */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                Add New Store Portal
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateOwner} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Owner Name *</label>
                <input
                  type="text" required placeholder="John Doc"
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={newOwner.name} onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address (optional)</label>
                <input
                  type="email" placeholder="owner@example.com"
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={newOwner.email} onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Temporary Password *</label>
                <input
                  type="password" required placeholder="******"
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={newOwner.password} onChange={(e) => setNewOwner({ ...newOwner, password: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number *</label>
                <input
                  type="text" required placeholder="0123456789"
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={newOwner.phone} onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shop Name *</label>
                  <input
                    type="text" required placeholder="My Shop"
                    className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={newOwner.shop_name} onChange={(e) => setNewOwner({ ...newOwner, shop_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan *</label>
                  <select
                    className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-semibold text-slate-700"
                    value={newOwner.plan} onChange={(e) => setNewOwner({ ...newOwner, plan: e.target.value })}
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
                  type="text" placeholder="123456789"
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={newOwner.telegram_chat_id} onChange={(e) => setNewOwner({ ...newOwner, telegram_chat_id: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shop Description (optional)</label>
                <textarea
                  placeholder="Describe the shop store properties..."
                  className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none h-20 resize-none"
                  value={newOwner.shop_description} onChange={(e) => setNewOwner({ ...newOwner, shop_description: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all mt-4"
              >
                Create Owner & Active Portal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
    }`}
  >
    {icon} <span className="font-bold">{label}</span>
  </div>
);

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

export default App;