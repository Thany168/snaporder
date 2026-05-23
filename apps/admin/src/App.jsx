import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"; // 🚀 Router hooks
import { Search } from "lucide-react";
import { ownerService } from "./api/ownerService";

import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import StoresView from "./components/StoresView";
import CreateOwnerModal from "./components/CreateOwnerModal";
import AuthView from "./components/AuthView";

const App = () => {
  const [stats, setStats] = useState(null);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine current active tab string to pass cleanly to Sidebar component highlighting
  const currentTab = location.pathname === "/stores" ? "stores" : "dashboard";
  const setCurrentTab = (tab) => navigate(tab === "dashboard" ? "/" : `/${tab}`);
  
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_profile");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [newOwner, setNewOwner] = useState({
    name: "", email: "", password: "", phone: "",
    shop_name: "", shop_description: "", telegram_chat_id: "", plan: "trial",
  });

  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    const initializeDashboard = async () => {
      try {
        // 🚀 FETCH SEPARATELY: One failing will no longer crash the other!
        try {
          const ownersRes = await ownerService.getOwners();
          let verifiedOwnersList = [];
          if (Array.isArray(ownersRes)) verifiedOwnersList = ownersRes;
          else if (ownersRes?.data && Array.isArray(ownersRes.data)) verifiedOwnersList = ownersRes.data;
          else if (ownersRes?.data?.data && Array.isArray(ownersRes.data.data)) verifiedOwnersList = ownersRes.data.data;
          
          setOwners(verifiedOwnersList);
        } catch (ownerErr) {
          console.error("Failed to load owners data table:", ownerErr);
        }

        try {
          const statsRes = await ownerService.getStats();
          const statsData = statsRes?.data ? statsRes.data : statsRes;
          if (statsData) {
            setStats({
              totalShops: statsData.total_shops || 0,
              activeSubs: statsData.active_subscriptions || 0,
              totalRevenue: statsData.total_revenue || 0,
              recentOrders: statsData.recent_orders || 0,
            });
          }
        } catch (statsErr) {
          console.error("Failed to load metrics statistics cards:", statsErr);
        }

      } catch (err) {
        console.error("General initialization breakdown:", err);
        if (err.response?.status === 401) handleLogout();
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [token]);

  const handleAuthSuccess = (receivedToken, receivedUser) => {
    localStorage.setItem("token", receivedToken);
    localStorage.setItem("user_profile", JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_profile");
    setToken(null);
    setUser(null);
    setOwners([]);
    setStats(null);
    navigate("/");
  };

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    try {
      const response = await ownerService.store(newOwner);
      const newlyCreatedOwner = response.data ? response.data : response;

      setOwners([newlyCreatedOwner, ...owners]);
      setStats((prev) => prev ? { ...prev, totalShops: (prev.totalShops || 0) + 1 } : null);
      setIsModalOpen(false);
      setNewOwner({
        name: "", email: "", password: "", phone: "",
        shop_name: "", shop_description: "", telegram_chat_id: "", plan: "trial",
      });
    } catch (err) {
      console.error("Submission backend error: ", err);
      alert("Failed to register store portal account.");
    }
  };

  const toggleStatus = async (owner) => {
    const next = owner.status === "active" ? "suspended" : "active";
    try {
      await ownerService.toggleStatus(owner.id, next);
      setOwners(owners.map((o) => (o.id === owner.id ? { ...o, status: next } : o)));
    } catch (err) {
      alert("Failed to update status. Check your connection.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8F9FD]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-indigo-600 tracking-widest uppercase">PhumYerng</p>
      </div>
    </div>
  );

  if (!token) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex h-screen bg-[#F8F9FD] text-slate-700 font-sans overflow-hidden">
      
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900">
            {currentTab === "dashboard" ? "Dashboard Overview" : "Manage Stores Feature"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search stores..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            <div className="flex items-center gap-3 bg-white p-1 pr-4 border border-slate-200 rounded-2xl">
              <img src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff" className="w-8 h-8 rounded-xl" alt="avatar" />
              <span className="text-sm font-bold text-slate-900">{user?.name || "Super Admin"}</span>
            </div>
          </div>
        </header>

        {/* 🚀 REAL DECLARATIVE ROUTE TREE CHIPS */}
        <Routes>
          <Route path="/" element={<DashboardView stats={stats} setCurrentTab={setCurrentTab} />} />
          <Route path="/stores" element={<StoresView owners={owners} toggleStatus={toggleStatus} setIsModalOpen={setIsModalOpen} />} />
        </Routes>
      </main>

      <CreateOwnerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateOwner} newOwner={newOwner} setNewOwner={setNewOwner} />
    </div>
  );
};

export default App;