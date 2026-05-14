import { useNavigate } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";

import {
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineCube,
  HiOutlineEye,
  HiOutlineCog,
  HiOutlineCreditCard,
  HiOutlinePlus,
} from "react-icons/hi";

const recentOrders = [
  {
    id: 1024,
    customer: "Test Customer",
    status: "pending",
    total: 11.0,
    time: "10 min ago",
  },
  {
    id: 1023,
    customer: "Sokha Chan",
    status: "confirmed",
    total: 7.5,
    time: "25 min ago",
  },
  {
    id: 1022,
    customer: "Dara Pich",
    status: "delivered",
    total: 5.0,
    time: "1 hr ago",
  },
  {
    id: 1021,
    customer: "Maly Keo",
    status: "rejected",
    total: 3.0,
    time: "2 hr ago",
  },
  {
    id: 1020,
    customer: "Piseth Rith",
    status: "delivered",
    total: 8.5,
    time: "3 hr ago",
  },
];

const topProducts = [
  { name: "Iced Coffee", sold: 24, revenue: 84.0 },
  { name: "Fried Rice", sold: 18, revenue: 90.0 },
  { name: "Lemon Tea", sold: 15, revenue: 30.0 },
  { name: "Spring Rolls", sold: 9, revenue: 27.0 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Orders today"
          value="12"
          sub="↑ 3 from yesterday"
          subColor="text-green-500"
          icon={HiOutlineClipboardList}
        />
        <StatCard
          label="Pending"
          value="3"
          sub="Needs action"
          subColor="text-yellow-500"
          icon={HiOutlineClock}
        />
        <StatCard
          label="Revenue today"
          value="$84"
          sub="↑ 12% this week"
          subColor="text-green-500"
          icon={HiOutlineCurrencyDollar}
        />
        <StatCard
          label="Products"
          value="4"
          sub="2 categories"
          subColor="text-gray-400"
          icon={HiOutlineCube}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-100 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent orders
            </h2>
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <HiOutlineEye className="text-sm" />
              View all
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900">
                      #{order.id}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {order.customer}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{order.time}</p>
                </div>

                <Badge status={order.status} />

                <span className="text-xs font-semibold text-gray-900 min-w-[60px] text-right">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-100 rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Top products
            </h2>
            <button
              onClick={() => navigate("/products")}
              className="text-xs text-blue-600 hover:underline"
            >
              Manage →
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3">
                <span className="text-gray-300 text-xs w-4">{i + 1}</span>

                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <HiOutlineCube className="text-blue-600 text-lg" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sold} sold</p>
                </div>

                <span className="text-sm font-semibold text-gray-900">
                  ${p.revenue.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Quick actions
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/products/new")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <HiOutlinePlus className="text-sm" />
            Add product
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            <HiOutlineClipboardList className="text-sm" />
            Orders
          </button>

          <button
            onClick={() => navigate("/payments")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            <HiOutlineCreditCard className="text-sm" />
            Payments
          </button>

          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            <HiOutlineCog className="text-sm" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import api from './api/axios'; // Copy your axios.js to this folder's src/api/

// function App() {
//     const [user, setUser] = useState(null);
//     const [shopLink, setShopLink] = useState('');
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const initializeOwnerApp = async () => {
//             try {
//                 // 1. Log in the owner (In Dev, use your loginDev)
//                 const authResponse = await api.post('/auth/telegram/dev', {
//                     telegram_id: "1282406422",
//                     name: "Sokheng Owner",
//                     role: "owner" // Important: Role must be 'owner'
//                 });

//                 setUser(authResponse.data.user);
//                 localStorage.setItem('token', authResponse.data.token);

//                 // 2. Fetch the unique shop link we created in Laravel
//                 const linkResponse = await api.get('/owner/my-link');
//                 setShopLink(linkResponse.data.link);

//             } catch (error) {
//                 console.error("Dashboard failed to load:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         initializeOwnerApp();
//     }, []);

//     if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
//                     <p className="text-gray-500">Welcome back, {user?.name}</p>
//                 </div>
//             </header>

//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
//                 <h2 className="font-semibold text-blue-800 mb-2">Your Shop's Telegram Link:</h2>
//                 <div className="flex items-center gap-4">
//                     <code className="bg-blue-50 p-3 rounded-lg flex-1 text-blue-600 font-mono">
//                         {shopLink}
//                     </code>
//                     <button
//                         onClick={() => navigator.clipboard.writeText(shopLink)}
//                         className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
//                     >
//                         Copy Link
//                     </button>
//                 </div>
//                 <p className="text-xs text-gray-400 mt-4">
//                     Give this link to customers or print it as a QR code for your tables.
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default App;
