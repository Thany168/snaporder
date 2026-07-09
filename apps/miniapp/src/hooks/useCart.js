import { useState, useEffect } from 'react';

// 🔑 SESSION KEY: sessionStorage is automatically cleared when the Telegram Mini App closes.
// On next open, no session key exists → stale cart is wiped automatically.
const SESSION_KEY = 'cart_session_active';
const CART_KEY = 'shopping_cart';

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    // 🎯 AUTO-CLEAR STALE CART: If no active session exists, this is a fresh open → clear old cart
    const hasActiveSession = sessionStorage.getItem(SESSION_KEY);

    if (!hasActiveSession) {
      // Fresh open (app was closed and reopened) — wipe any pending/abandoned cart
      localStorage.removeItem(CART_KEY);
      // Mark this session as active
      sessionStorage.setItem(SESSION_KEY, '1');
      return [];
    }

    // Same session still open (e.g. page refresh) — restore cart as-is
    const savedCart = localStorage.getItem(CART_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    setCart([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return { cart, addToCart, removeFromCart, clearCart, totalAmount };
};