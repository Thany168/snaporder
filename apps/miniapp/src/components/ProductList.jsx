import React from 'react';

// Inside your ProductList.jsx
const ProductList = ({ products, onAdd, layoutType, primaryColor }) => {
    return (
        <div className={
            layoutType === 'grid' 
                ? "grid grid-cols-2 gap-3.5 px-2"  // 🛍️ Modern 2-Column Grid View
                : "space-y-3.5 px-2"              // 🍔 Widescreen Delivery Row List View
        }>
            {products.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={onAdd} 
                    layoutType={layoutType} 
                    primaryColor={primaryColor}
                />
            ))}
        </div>
    );
};

// This is the most important line! 
export default ProductList;