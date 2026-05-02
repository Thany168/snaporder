import React, { useState, useEffect } from 'react';
import api from './api/axios';
import { useCart } from './hooks/useCart';

// Components
import ProductList from './components/ProductList';
import Checkout from './pages/Checkout';

function App() {
    const { cart, addToCart, totalAmount, clearCart } = useCart();
    const [view, setView] = useState('shop'); 
    const tg = window.Telegram?.WebApp;

    const [products, setProducts] = useState([]);
    const [owner, setOwner] = useState(null); // This holds shop name, etc.
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tg) {
            tg.ready();
            tg.expand();
        }

        const initializeApp = async () => {
            try {
                setLoading(true);

                const urlParams = new URLSearchParams(window.location.search);
                const isTelegram = !!tg?.initData;

                // 1. Authentication
                let authResponse;
                if (isTelegram) {
                    authResponse = await api.post('/auth/telegram', { init_data: tg.initData });
                } else {
                    authResponse = await api.post('/auth/telegram/dev', {
                        telegram_id: "1282406422",
                        name: "Sokheng Dev",
                        role: "owner"
                    });
                }

                setUser(authResponse.data.user);
                localStorage.setItem('token', authResponse.data.token);

                // 2. Identify target shop ID
                const targetId = 
                    tg?.initDataUnsafe?.start_param || 
                    urlParams.get('startapp') || 
                    authResponse.data.owner_id || 
                    "1";

                console.log("🚀 Current targetId:", targetId);

                // 3. Fetch BOTH Products and Shop Details in parallel
                const [productsRes, ownerRes] = await Promise.all([
                    api.get(`/shop/${targetId}/products`),
                    api.get(`/shop/${targetId}`)
                ]);

                setProducts(productsRes.data);
                setOwner(ownerRes.data); // This updates the shop details state

            } catch (error) {
                console.error("Critical Init Error:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeApp();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* --- DYNAMIC HEADER --- */}
            <header className="p-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        {/* Use the dynamic owner name, fallback to a loading string */}
                        {owner?.shop_name || 'Loading Shop...'}
                    </h1>
                    {owner?.shop_description && (
                        <p className="text-xs text-gray-500">{owner.shop_description}</p>
                    )}
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    Hi, {user?.name || 'Guest'}
                </span>
            </header>

            {view === 'shop' ? (
                <>
                    <div className="p-2">
                        <div className="flex justify-between items-center px-2 mt-2">
                            <h2 className="text-lg font-semibold text-gray-700">Available Products</h2>
                            {/* Optional: Show ID for debugging */}
                            <span className="text-[10px] text-gray-300">ID: {owner?.id}</span>
                        </div>
                        <ProductList products={products} onAdd={addToCart} />
                    </div>

                    {cart.length > 0 && (
                        <div className="fixed bottom-0 w-full p-4 bg-white border-t shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] z-20">
                            <button 
                                onClick={() => setView('checkout')}
                                className="w-full bg-blue-600 active:bg-blue-700 text-white py-4 rounded-2xl font-bold flex justify-between px-6 transition-all shadow-lg"
                            >
                                <span>View My Cart ({cart.length})</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="p-4">
                    <button 
                        onClick={() => setView('shop')} 
                        className="mb-6 flex items-center text-blue-600 font-semibold"
                    >
                        <span className="mr-2 text-xl">←</span> Back to Shop
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Order</h2>
                    
                    <Checkout 
                        cartItems={cart} 
                        totalAmount={totalAmount} 
                        ownerId={owner?.id} // Pass current shop ID to checkout
                        onSuccess={() => {
                            clearCart();
                            setView('shop');
                            if (tg) {
                                tg.showAlert("Order placed successfully!");
                            } else {
                                alert("Order placed successfully!");
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default App;