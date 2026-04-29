import React, { useState, useEffect } from 'react';
import api from './api/axios'; // Copy your axios.js to this folder's src/api/

function App() {
    const [user, setUser] = useState(null);
    const [shopLink, setShopLink] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeOwnerApp = async () => {
            try {
                // 1. Log in the owner (In Dev, use your loginDev)
                const authResponse = await api.post('/auth/telegram/dev', {
                    telegram_id: "1282406422", 
                    name: "Sokheng Owner",
                    role: "owner" // Important: Role must be 'owner'
                });

                setUser(authResponse.data.user);
                localStorage.setItem('token', authResponse.data.token);

                // 2. Fetch the unique shop link we created in Laravel
                const linkResponse = await api.get('/owner/my-link');
                setShopLink(linkResponse.data.link);

            } catch (error) {
                console.error("Dashboard failed to load:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeOwnerApp();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {user?.name}</p>
                </div>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
                <h2 className="font-semibold text-blue-800 mb-2">Your Shop's Telegram Link:</h2>
                <div className="flex items-center gap-4">
                    <code className="bg-blue-50 p-3 rounded-lg flex-1 text-blue-600 font-mono">
                        {shopLink}
                    </code>
                    <button 
                        onClick={() => navigator.clipboard.writeText(shopLink)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Copy Link
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                    Give this link to customers or print it as a QR code for your tables.
                </p>
            </div>
        </div>
    );
}

export default App;