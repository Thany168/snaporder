import api from '../api/axios'; // Import your custom axios client instance

const handleCheckoutSubmit = async (checkoutData) => {
    // 🚀 1. Dynamically read the ?owner_id=XX query parameter from the URL browser window
    const urlParams = new URLSearchParams(window.location.search);
    
    // Fallback to '21' (or your latest active DB ID row) if testing locally without Telegram
    const ownerId = urlParams.get('owner_id') || '21'; 

    try {
        // 🚀 2. Inject the dynamic owner ID into the api request string!
        const response = await api.post(`/shop/${ownerId}/checkout`, checkoutData);
        
        console.log('🎉 Order processed successfully:', response.data);
        alert('Order Placed Successfully!');
        
    } catch (error) {
        console.error('❌ Checkout Failed:', error.response?.data || error.message);
    }
};