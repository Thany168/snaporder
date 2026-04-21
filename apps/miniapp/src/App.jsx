import React, { useState, useEffect } from 'react';
import api from './api/axios';
import { useCart } from './hooks/useCart';

// Components
import ProductList from './components/ProductList';
import Checkout from './pages/Checkout';

function App() {
    const { cart, addToCart, totalAmount, clearCart } = useCart();
    
    // View state to toggle between Shop and Checkout
    const [view, setView] = useState('shop'); 
    
    // Telegram WebApp Object
    const tg = window.Telegram?.WebApp;

    // Logic for products and user
    const [products, setProducts] = useState([{ id: 1, name: "Test Product", price: 10, image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdUY6-53NESEHhJDAyfXsJigOm9_okUAsgjw&s" }]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Telegram UI
        if (tg) {
            tg.ready();
            tg.expand();
        }

        const initializeApp = async () => {
            try {
                // 1. Handle Authentication (Telegram vs Dev Mode)
                let authResponse;
                
                if (tg && tg.initData) {
                    // Real Telegram environment
                    authResponse = await api.post('/auth/telegram', {
                        init_data: tg.initData
                    });
                } else {
                    // Local Browser / Dev Mode
                    authResponse = await api.post('/auth/telegram/dev', {
                        telegram_id: "12345678",
                        name: "Sokheng Dev",
                        role: "customer"
                    });
                }
                
                // Store token for future requests
                localStorage.setItem('token', authResponse.data.token);
                setUser(authResponse.data.user);

                // 2. Fetch Products from Owner #1
                const productsResponse = await api.get('/shop/1/products');
                setProducts(productsResponse.data);

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
            {/* Header */}
            <header className="p-4 bg-white shadow-sm flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-800">Sokheng Shop</h1>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    Hi, {user?.name || 'Guest'}
                </span>
            </header>

            {view === 'shop' ? (
                <>
                    <div className="p-2">
                        <h2 className="text-lg font-semibold px-2 mt-2 text-gray-700">Available Products</h2>
                        <ProductList products={products} onAdd={addToCart} />
                    </div>

                    {/* Floating Cart Button */}
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