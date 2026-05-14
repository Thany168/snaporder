import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage so it doesn't disappear on refresh
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
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

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return { cart, addToCart, removeFromCart, clearCart, totalAmount };
};