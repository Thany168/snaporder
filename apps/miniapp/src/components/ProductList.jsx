import React from 'react';

// Inside your ProductList.jsx
const ProductList = ({ products, onAdd }) => {
    // If 'products' is actually an array of Categories from your API:
    return (
        <div className="space-y-8">
            {products.map((category) => (
                <div key={category.id} className="category-section">
                    <h3 className="text-md font-bold text-blue-600 mb-3 px-2">
                        {category.name}
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {category.products && category.products.map((product) => (
                            <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-gray-800">{product.name}</h4>
                                    <p className="text-sm text-gray-500">{product.description}</p>
                                    <p className="text-blue-600 font-bold mt-1">${product.price}</p>
                                </div>
                                <button 
                                    onClick={() => onAdd(product)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
                                >
                                    + Add
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// This is the most important line! 
export default ProductList;