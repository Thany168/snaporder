import React, { useState } from 'react';
import api from '../api/axios'; 

const Checkout = ({ cartItems, totalAmount, ownerId, clearCart, onSuccess }) => {
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerLocation, setCustomerLocation] = useState(''); 
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        try {
            setSubmitting(true);

            const orderPayload = {
                phone: customerPhone,
                location: customerLocation,
                name: "Telegram Customer",
                telegram_id: "", 
                // 🎯 FIXED MAP: Direct reference to item.product_id to match useCart hook schema perfectly
                items: cartItems.map(item => ({
                    product_id: parseInt(item.product_id),
                    quantity: parseInt(item.quantity)
                }))
            };

            console.log("📦 Sending direct payload data structure to backend:", orderPayload);

            // Send order payload directly to your public backend api endpoint 
            const response = await api.post(`/shop/${ownerId}/checkout`, orderPayload, {
                headers: {
                    'Authorization': undefined // Keep request clean from any conflicting token headers
                }
            });
            
            if (response.status === 201 || response.status === 200) {
                // Wipe cache storage states instantly
                localStorage.removeItem("shopping_cart");
                
                if (typeof clearCart === 'function') {
                    clearCart(); 
                }

                if (onSuccess) {
                    onSuccess(); // Triggers the parent alert window and location reload
                }
                return; 
            }
        } catch (error) {
            console.error("❌ Checkout system error trace:", error.response?.data || error.message);
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
                        // 🎯 FIXED KEY: Using product_id as the element mapping index key
                        <div key={item.product_id} className="flex justify-between text-sm text-gray-600">
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
                    required
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