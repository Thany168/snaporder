import React, { useState } from 'react';
import api from '../api/axios'; // Ensure this points to your standard Axios instance setup

const Checkout = ({ cartItems, totalAmount, ownerId, onSuccess }) => {
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerLocation, setCustomerLocation] = useState(''); 
    const [submitting, setSubmitting] = useState(false);

   const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    try {
        setSubmitting(true);

        // 🎯 FIXED: Added fallback parameters to completely stop backend 500 array key errors!
        const orderPayload = {
            phone: customerPhone,
            location: customerLocation,
            name: "Telegram Customer", // 🚀 Fallback if user isn't fully authenticated via WebApp sync yet
            telegram_id: "",           // 🚀 Safe empty string fallback to prevent array key undefined crashes
            items: cartItems.map(item => ({
                product_id: parseInt(item.id || item.product_id), // 🎯 MUST be product_id
                quantity: parseInt(item.quantity)
            }))
        };

        console.log("✈️ Ngrok Payload Package:", orderPayload);

        // 🎯 Match your public route signature exactly over ngrok proxy tunnel
        const response = await api.post(`/shop/${ownerId}/checkout`, orderPayload, {
            headers: {
                // 🚀 Force clear any admin/owner bearer token leftovers from active localStorage instances
                'Authorization': undefined 
            }
        });
        
        if (response.status === 201 || response.status === 200) {
            onSuccess(); // Clear cart and close modal sheet
            alert("🎉 Order placed successfully!");
        }
    } catch (error) {
        console.error("❌ Checkout component caught an error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Something went wrong processing your checkout.");
    } finally {
        setSubmitting(false);
    }
};

    return (
        <form onSubmit={handleSubmitOrder} className="space-y-4 text-gray-700">
            {/* Order Ledger Box */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2">Order Items</h3>
                <div className="max-h-40 overflow-y-auto space-y-2 mb-3">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-600">
                            <span>{item.name} <b className="text-blue-500">x{item.quantity}</b></span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-lg">
                    <span>Total Bill:</span>
                    <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
                </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Contact Phone Number</label>
                <input 
                    type="tel" 
                    required 
                    placeholder="e.g., 012345678"
                    value={customerPhone} 
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Delivery Location / Table Code</label>
                <input 
                    type="text" 
                    placeholder="e.g., Table 05 / Street 200 Room B"
                    value={customerLocation} 
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
                />
            </div>

            <button 
                type="submit" 
                disabled={submitting || cartItems.length === 0}
                className="w-full bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl text-center mt-2 transition-all shadow-md"
            >
                {submitting ? "Processing Transaction..." : `Confirm Order ($${totalAmount.toFixed(2)})`}
            </button>
        </form>
    );
};

export default Checkout;
