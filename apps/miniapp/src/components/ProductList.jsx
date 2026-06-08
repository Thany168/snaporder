import React from 'react';
import api from '../api/axios';

const ProductList = ({ products, onAdd, layoutType, primaryColor }) => {
    
    // 🌐 ABSOLUTE API STREAMING FORMATTER
    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300";
        
        // If it's already an absolute web URL, pass it right through
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return imagePath;
        }
        
        let cleanPath = imagePath.replace(/^\//, "");
        
        // Get your active API base URL domain mapping
        const backendRoot = api.defaults.baseURL || "https://stinging-unknowing-dry.ngrok-free.dev/api";
        const cleanBaseURL = backendRoot.endsWith('/api') ? backendRoot : `${backendRoot}/api`;

        // 🎯 THE PRODUCTION FIX: Automatically add the skip flag to the URL string natively
        return `${cleanBaseURL}/media?path=${encodeURIComponent(cleanPath)}&ngrok-skip-browser-warning=true`;
    };

    return (
        <div className={
            layoutType === 'grid' 
                ? "grid grid-cols-2 gap-4 px-3"  
                : "space-y-3 px-3"              
        }>
            {products.map(product => (
                <div 
                    key={product.id} 
                    className={`bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex ${
                        layoutType === 'grid' ? 'flex-col justify-between' : 'flex-row items-center justify-between'
                    }`}
                >
                    {/* Left/Top Content Section */}
                    <div className={`flex ${layoutType === 'grid' ? 'flex-col' : 'items-center space-x-3'} flex-1`}>
                        {/* Product Image Box */}
                        <div className={`${layoutType === 'grid' ? 'w-full h-32 mb-3' : 'w-16 h-16'} bg-gray-100 rounded-xl overflow-hidden flex-shrink-0`}>
                            <img 
                                src={getFullImageUrl(product.image_url || product.image || product.photo)} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => { 
                                    if (e.target.getAttribute('crossOrigin')) {
                                        e.target.removeAttribute('crossOrigin');
                                        const currentSrc = e.target.src;
                                        e.target.src = currentSrc + "&cors-bypass=" + Date.now();
                                    } else {
                                        e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300';
                                    }
                                }}
                            />
                        </div>

                        {/* Text Metadata Details */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                            {product.description && (
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{product.description}</p>
                            )}
                            {layoutType !== 'grid' && (
                                <span className="text-sm font-black text-gray-900 block mt-1">${parseFloat(product.price).toFixed(2)}</span>
                            )}
                        </div>
                    </div>

                    {/* Right/Bottom Price & Action Controls */}
                    <div className={`flex ${layoutType === 'grid' ? 'items-center justify-between mt-3 w-full' : 'items-center space-x-3 ml-2'}`}>
                        {layoutType === 'grid' && (
                            <span className="text-sm font-black text-gray-900">${parseFloat(product.price).toFixed(2)}</span>
                        )}
                        <button
                            onClick={() => onAdd(product)}
                            style={{ backgroundColor: primaryColor }}
                            className="text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                            + Add
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;