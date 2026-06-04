import React from 'react';
import api from '../api/axios'; // 🎯 CRITICAL: Importing your custom axios setup to grab the backend server domain

const ProductList = ({ products, onAdd, layoutType, primaryColor }) => {
    
    // 🌐 BASE PATH FORMATTER: Dynamically prefixes your Laravel domain name to relative storage paths
   const getFullImageUrl = (imagePath) => {
        if (!imagePath) return "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300";
        
        // 🎯 FIX: Force secure HTTPS wrapper protocol for your ngrok tunnel paths
        let securePath = imagePath;
        if (securePath.startsWith("http://")) {
            securePath = securePath.replace("http://", "https://");
        }
        
        if (securePath.startsWith("https://")) {
            return securePath;
        }
        
        const backendRoot = api.defaults.baseURL?.replace("/api", "") || "https://stinging-unknowing-dry.ngrok-free.dev";
        return `${backendRoot.replace("http://", "https://")}/${securePath.replace(/^\//, "")}`;
    };

    return (
        <div className={
            layoutType === 'grid' 
                ? "grid grid-cols-2 gap-4 px-3"  // 🛍️ Clean 2-Column Grid View
                : "space-y-3 px-3"              // 🍔 Standard List View Rows
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
                                src={getFullImageUrl(product.image_url)} // 🎯 UPDATED: Wrapped with absolute formatter pipeline
                                alt={product.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => { 
                                    // Safe production network hiccup fallback image
                                    e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600'; 
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