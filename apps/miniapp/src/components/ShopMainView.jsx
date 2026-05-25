import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useCart } from '../hooks/useCart';

// Components
import ProductList from './ProductList';
import Checkout from '../pages/Checkout';

const ShopMainView = () => {
    const { cart, addToCart, totalAmount, clearCart } = useCart();
    const [view, setView] = useState('shop'); 
    const tg = window.Telegram?.WebApp;

    const [categories, setCategories] = useState([]); // 🚀 Renamed from products to categories for clarity
    const [owner, setOwner] = useState(null); 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentShopId, setCurrentShopId] = useState(null); 

    // 🚀 STEP 1: PURE STATE EXTRACTOR FUNCTION
    const getLiveParamId = useCallback(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tgParam = tg?.initDataUnsafe?.start_param;
        const urlParam = urlParams.get('startapp') || urlParams.get('tgWebAppStartParam');
        
        return tgParam || urlParam || null;
    }, [tg]);

    // 🚀 STEP 2: RE-ROUTE WATCHER ENGINE
    useEffect(() => {
        const checkLinkSwitch = () => {
            const activeLinkId = getLiveParamId();
            
            if (activeLinkId && activeLinkId !== currentShopId) {
                console.log(`🔄 LINK SWITCH DETECTED! Changing from ${currentShopId} to ${activeLinkId}`);
                setCurrentShopId(activeLinkId);
                localStorage.setItem('phumyerng_active_shop_id', activeLinkId);
            } else if (!currentShopId) {
                const fallbackId = localStorage.getItem('phumyerng_active_shop_id') || "1";
                setCurrentShopId(fallbackId);
            }
        };

        checkLinkSwitch();

        if (tg) {
            tg.onEvent('mainButtonClicked', checkLinkSwitch); 
            window.addEventListener('focus', checkLinkSwitch);
        }

        return () => {
            if (tg) tg.offEvent('mainButtonClicked', checkLinkSwitch);
            window.removeEventListener('focus', checkLinkSwitch);
        };
    }, [currentShopId, getLiveParamId, tg]);

    // 🚀 STEP 3: DATA FETCH TRIGGER PIPELINE
    useEffect(() => {
        if (!currentShopId) return;

        const loadShopData = async () => {
            try {
                setLoading(true);
                const isTelegram = !!tg?.initData;

                // Handshake Authentication
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

                let targetId = currentShopId;
                
                if (targetId === "1" && authResponse.data.owner_id) {
                    targetId = authResponse.data.owner_id;
                    setCurrentShopId(targetId);
                }

                console.log("🔥 Triggering fresh API payload requests for Shop ID:", targetId);

                // Fetch resources matching the target ID
                const [productsRes, ownerRes] = await Promise.all([
                    api.get(`/shop/${targetId}/products`), // ⚡ This returns Category arrays with nested products!
                    api.get(`/shop/${targetId}`)
                ]);

                setCategories(productsRes.data); // Save the category groupings cleanly
                setOwner(ownerRes.data);

            } catch (error) {
                console.error("API Loader Error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadShopData();
    }, [currentShopId]); 

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
                    {/* Search Field Integration */}
                    <div className="p-2 px-4 mt-2">
                        <input 
                            type="text"
                            placeholder="Search products..."
                            className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
                            onChange={async (e) => {
                                const q = e.target.value;
                                const res = await api.get(`/shop/${currentShopId}/products?search=${q}`);
                                setCategories(res.data);
                            }}
                        />
                    </div>

                    <div className="p-2">
                        <div className="flex justify-between items-center px-2 mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">Menu</h2>
                            <span className="text-[10px] text-gray-400 font-bold">Active Shop ID: {owner?.id}</span>
                        </div>

                        {/* 🚀 FIXED: NESTED CATEGORY LOOP RENDERING BLOCK */}
                        {categories.length === 0 ? (
                            <div className="text-center text-gray-400 py-8 text-sm">No items available.</div>
                        ) : (
                            categories.map((category) => (
                                <div key={category.id} className="mb-6">
                                    {category.products && category.products.length > 0 && (
                                        <>
                                            <h3 className="text-sm font-bold text-blue-600 px-2 mb-2 uppercase tracking-wider">
                                                {category.name}
                                            </h3>
                                            {/* Pass the items array nested inside this category definition */}
                                            <ProductList products={category.products} onAdd={addToCart} />
                                        </>
                                    )}
                                </div>
                            ))
                        )}
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