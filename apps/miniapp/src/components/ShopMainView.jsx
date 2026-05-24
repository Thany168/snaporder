import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../hooks/useCart';

// Components
import ProductList from './ProductList';
import Checkout from '../pages/Checkout';

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

                // 🚀 1. INTRODUCE A 150ms MICRO-DELAY FOR COLD BOOTS
                // This gives the mobile Telegram container time to inject initDataUnsafe onto window!
                await new Promise((resolve) => setTimeout(resolve, 150));

                const urlParams = new URLSearchParams(window.location.search);
                const isTelegram = !!tg?.initData;

                // 🚀 2. STRICT LINK PARAMETER RESOLUTION (HIGHEST PRIORITY)
                const tgStartParam = tg?.initDataUnsafe?.start_param;
                const urlStartParam = urlParams.get('startapp');
                const incomingParam = tgStartParam || urlStartParam;
                
                let targetId;
                
                if (incomingParam) {
                    targetId = incomingParam;
                    // Force save the new target link to localStorage immediately
                    localStorage.setItem('phumyerng_active_shop_id', targetId);
                } else {
                    // Check local storage memory next, or fallback to default
                    targetId = localStorage.getItem('phumyerng_active_shop_id') || "1";
                }

                console.log("🎯 Evaluated targetId for backend calls:", targetId);

                // 🚀 3. HANDSHAKE AUTHENTICATION PIPELINE
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

                // 🚀 4. LAST-RESORT RE-VERIFICATION
                // Only use the owner_id from auth payload if there was ABSOLUTELY NO incoming link param
                if (!incomingParam && authResponse.data.owner_id) {
                    targetId = authResponse.data.owner_id;
                    localStorage.setItem('phumyerng_active_shop_id', targetId);
                }

                console.log("🔥 Final API Trigger Dispatching for ID:", targetId);

                // 🚀 5. FETCH BOTH TARGET SHOP RESOURCES IN PARALLEL
                const [productsRes, ownerRes] = await Promise.all([
                    api.get(`/shop/${targetId}/products`),
                    api.get(`/shop/${targetId}`)
                ]);

                setProducts(productsRes.data);
                setOwner(ownerRes.data); 

            } catch (error) {
                console.error("Critical Mini App Component Init Error:", error);
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
                            <span className="text-[10px] text-gray-400 font-bold">Shop ID: {owner?.id}</span>
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