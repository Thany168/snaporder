import React, { useState } from 'react';
import api from '../api/axios';

// Add ownerId to the props
const Checkout = ({ cartItems, totalAmount, ownerId, onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // Safety check: Make sure we have an ownerId before sending
    if (!ownerId) return alert("Error: Shop ID not found.");
    if (!screenshot) return alert("Please upload a payment screenshot first!");

    setIsSubmitting(true);
    try {
      // 1. Prepare Order Data
      const orderData = {
        phone: phone,
        location: location,
        items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
        })),
        total_amount: totalAmount // Make sure this matches your Laravel validation
      };

      // 2. Create Order - Dynamic URL based on current shop owner
      // Changed from /shop/1/checkout to /shop/${ownerId}/checkout
      const orderRes = await api.post(`/shop/${ownerId}/checkout`, orderData);
      const orderId = orderRes.data.id;

      // 3. Upload Screenshot
      const formData = new FormData();
      formData.append('payment_screenshot', screenshot);

      await api.post(`/orders/${orderId}/payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Call the success callback to clear cart and show UI update
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Checkout failed.";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCheckout} className="p-4 space-y-4 bg-white rounded-2xl shadow-sm">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-600 ml-1">Contact Phone</label>
        <input 
          type="text" 
          placeholder="012 345 678" 
          className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required 
        />
      </div>
      
      <div className="space-y-1">
        <label className="text-sm font-semibold text-gray-600 ml-1">Delivery Address</label>
        <textarea 
          placeholder="Enter your house number/street..." 
          className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required 
        />
      </div>

      <div className="border-2 border-dashed border-gray-200 p-6 rounded-2xl text-center bg-gray-50">
        <label className="block mb-3 text-sm font-bold text-gray-700">Payment Screenshot (ABA/Wing)</label>
        <input 
          type="file" 
          accept="image/*"
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => setScreenshot(e.target.files[0])}
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
            isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
        }`}
      >
        {isSubmitting ? 'Processing Order...' : `Pay & Place Order ($${totalAmount.toFixed(2)})`}
      </button>
    </form>
  );
};

export default Checkout;