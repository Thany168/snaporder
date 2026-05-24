import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../hooks/useCart';

// Components
import ProductList from '../components/ProductList';
import Checkout from './Checkout';

const ShopMainView = () => {
    const { cart, addToCart, totalAmount, clearCart } = useCart();
    const [view, setView] = useState('shop'); 
    const tg = window.Telegram?.WebApp;

    const [products, setProducts] = useState([]);
    const [owner, setOwner] = useState(null); 
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

                // 1. Handshake Authentication
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

                // 🚀 2. BULLETPROOF ID SELECTION: Give direct link parameters highest priority!
                // This stops the app from defaulting back to old database owners profiles!
                const incomingParam = tg?.initDataUnsafe?.start_param || urlParams.get('startapp');
                
                let targetId;
                if (incomingParam) {
                    targetId = incomingParam;
                    // Cache it locally so page navigation clicks don't break session context
                    localStorage.setItem('active_tg_shop_id', targetId);
                } else {
                    targetId = localStorage.getItem('active_tg_shop_id') || authResponse.data.owner_id || "1";
                }

                console.log("🎯 Dynamic Target Shop ID Loaded:", targetId);

                // 3. Run parallel tenant resource load sequences
                const [productsRes, ownerRes] = await Promise.all([
                    api.get(`/shop/${targetId}/products`),
                    api.get(`/shop/${targetId}`)
                ]);

                setProducts(productsRes.data);
                setOwner(ownerRes.data);

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
            <header className="p-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
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
                        ownerId={owner?.id} 
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
};

export default ShopMainView;