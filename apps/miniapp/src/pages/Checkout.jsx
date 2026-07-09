import React, { useState } from 'react';
import api from '../api/axios';

const Checkout = ({ cartItems, totalAmount, ownerId, clearCart, onSuccess, user }) => {
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerLocation, setCustomerLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 🎯 Read Telegram user data — works from API user object AND raw WebApp initDataUnsafe
    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    // Priority: API user name → Telegram WebApp name → fallback
    const customerName = user?.name
        || (tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : null)
        || 'Telegram Customer';

    // Priority: API user telegram_id → WebApp user id → empty
    const telegramId = user?.telegram_id
        || tgUser?.id?.toString()
        || '';

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        try {
            setSubmitting(true);

            const orderPayload = {
                phone: customerPhone || null,        // Optional — skip if empty
                location: customerLocation || null,  // Optional — skip if empty
                name: customerName,                  // Auto-filled from Telegram
                telegram_id: telegramId,             // Auto-filled from Telegram
                items: cartItems.map(item => ({
                    product_id: parseInt(item.product_id),
                    quantity: parseInt(item.quantity)
                }))
            };

            console.log("📦 Sending payload to backend:", orderPayload);

            const response = await api.post(`/shop/${ownerId}/checkout`, orderPayload, {
                headers: { 'Authorization': undefined }
            });

            if (response.status === 201 || response.status === 200) {
                localStorage.removeItem("shopping_cart");
                if (typeof clearCart === 'function') clearCart();
                if (onSuccess) onSuccess();
                return;
            }
        } catch (error) {
            console.error("❌ Checkout error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Something went wrong processing your checkout.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmitOrder} className="space-y-4 text-gray-700">

            {/* 👤 Customer Info Banner — auto-detected from Telegram */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">Ordering as</p>
                    <p className="text-sm font-bold text-blue-800">{customerName}</p>
                </div>
            </div>

            {/* 🛒 Order Ledger Box */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2">Order Items</h3>
                <div className="max-h-40 overflow-y-auto space-y-2 mb-3">
                    {cartItems.map((item) => (
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

            {/* 📞 Optional Phone Number */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase">
                    Contact Phone <span className="text-gray-300 font-normal normal-case">(optional)</span>
                </label>
                <input
                    type="tel"
                    placeholder="e.g., 012345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* 📍 Optional Location */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-400 uppercase">
                    Delivery Location / Table <span className="text-gray-300 font-normal normal-case">(optional)</span>
                </label>
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