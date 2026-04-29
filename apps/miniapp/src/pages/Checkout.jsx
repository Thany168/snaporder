import React, { useState } from 'react';
import api from '../api/axios';

const Checkout = ({ cartItems, totalAmount, ownerId }) => {
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
      const orderData = {
        owner_id: ownerId, // Send the correct ID to the backend
        phone: phone,
        location: location,
        items: cartItems,
        total_amount: totalAmount,
        customer_name: "Customer Name" // You can get this from Telegram user data
      };

      // 2. Create Order
      // ✅ Use dynamic ownerId in the URL
      const orderRes = await api.post(`/shop/${ownerId}/checkout`, orderData);
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
