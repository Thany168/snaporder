import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Store, Users, DollarSign, Package } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Replace with your actual Admin API URL
        axios.get('/api/admin/dashboard-stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!stats) return <div className="p-6">Loading Dashboard...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
            <StatCard title="Total Shops" value={stats.total_shops} icon={<Store />} color="bg-blue-500" />
            <StatCard title="Active Subs" value={stats.active_subscriptions} icon={<Users />} color="bg-green-500" />
            <StatCard title="Revenue" value={`$${stats.total_revenue}`} icon={<DollarSign />} color="bg-yellow-500" />
            <StatCard title="New Orders" value={stats.recent_orders} icon={<Package />} color="bg-purple-500" />
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    </div>
);