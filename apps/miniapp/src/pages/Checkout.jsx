import React, { useState } from 'react';
import api from '../api/axios';

const Checkout = ({ cartItems, totalAmount }) => {
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This is your function!
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!screenshot) return alert("Please upload a payment screenshot first!");

    setIsSubmitting(true);
    try {
      // 1. Prepare Order Data
      const orderData = {
        phone: phone,
        location: location,
        items: cartItems // [{product_id: 1, quantity: 2}, ...]
      };

      // 2. Create Order
      const orderRes = await api.post('/shop/1/checkout', orderData);
      const orderId = orderRes.data.id;

      // 3. Upload Screenshot
      const formData = new FormData();
      formData.append('payment_screenshot', screenshot);

      await api.post(`/orders/${orderId}/payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Order Successful! Pending verification.");
    } catch (error) {
      console.error(error);
      alert("Checkout failed. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCheckout} className="p-4 space-y-4">
      <input 
        type="text" 
        placeholder="Phone Number" 
        className="w-full border p-2 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required 
      />
      
      <textarea 
        placeholder="Delivery Location" 
        className="w-full border p-2 rounded"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required 
      />

      <div className="border-2 border-dashed p-4 text-center">
        <label className="block mb-2 text-sm font-medium">Upload Payment Screenshot</label>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setScreenshot(e.target.files[0])}
          required 
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
      >
        {isSubmitting ? 'Processing...' : `Place Order ($${totalAmount})`}
      </button>
    </form>
  );
};

export default Checkout;
