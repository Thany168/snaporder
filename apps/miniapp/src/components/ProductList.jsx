import React from 'react';
// 🎯 CRITICAL FIX: Ensure ProductCard is imported correctly with exact filename casing!
import ProductCard from './ProductCard'; 

const ProductList = ({ products, onAdd, layoutType, primaryColor }) => {
    return (
        <div className={
            layoutType === 'grid' 
                ? "grid grid-cols-2 gap-3.5 px-2"  
                : "space-y-3.5 px-2"              
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

export default ProductList;