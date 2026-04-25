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
    const [owner, setOwner] = useState(null); // Track the current shop owner
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tg) {
            tg.ready();
            tg.expand();
        }

        const initializeApp = async () => {
            try {
                // 1. Get Owner ID from Telegram start_param or URL
                // Default to 1 if no parameter is found
                const urlParams = new URLSearchParams(window.location.search);
                const ownerId = tg?.initDataUnsafe?.start_param || urlParams.get('startapp') || "1";

                // 2. Handle Authentication
                let authResponse;
                if (tg && tg.initData) {
                    authResponse = await api.post('/auth/telegram', {
                        init_data: tg.initData
                    });
                } else {
                    authResponse = await api.post('/auth/telegram/dev', {
                        telegram_id: "1282406422",
                        name: "Sokheng Dev",
                        role: "customer"
                    });
                }
                
                localStorage.setItem('token', authResponse.data.token);
                setUser(authResponse.data.user);

                // 3. Fetch Shop Info & Products dynamically using the ownerId
                // We fetch the products from the specific owner path you created in Laravel
                const productsResponse = await api.get(`/shop/${ownerId}/products`);
                setProducts(productsResponse.data);

                // 4. (Optional) Fetch Owner details to show the Shop Name
                // If your backend returns categories in a list, we can find the owner info there
                // or call your /api/shop/{owner} route
                const shopResponse = await api.get(`/shop/${ownerId}`);
                setOwner(shopResponse.data);

            } catch (error) {
                console.error("Initialization failed:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeApp();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header - Now dynamic! */}
            <header className="p-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        {owner?.shop_name || 'My Shop'}
                    </h1>
                    <p className="text-xs text-gray-500">{owner?.shop_description}</p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    Hi, {user?.name || 'Guest'}
                </span>
            </header>

            {view === 'shop' ? (
                <>
                    <div className="p-2">
                        <h2 className="text-lg font-semibold px-2 mt-2 text-gray-700">Available Menu</h2>
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
                        <span className="mr-2 text-xl">←</span> Back to Menu
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Order</h2>
                    
                    <Checkout 
                        cartItems={cart} 
                        totalAmount={totalAmount} 
                        ownerId={owner?.id} // Pass the dynamic owner ID to Checkout
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