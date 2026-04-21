import React from 'react';

const ProductList = ({ products, onAdd }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {products && products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="border rounded-lg p-2 shadow-sm bg-white">
            <img 
              src={product.image_url || 'https://via.placeholder.com/150'} 
              alt={product.name} 
              className="w-full h-32 object-cover rounded" 
            />
            <h3 className="font-bold mt-2 text-sm">{product.name}</h3>
            <p className="text-blue-600 font-bold">${product.price}</p>
            <button 
              onClick={() => onAdd(product)}
              className="w-full bg-blue-500 text-white mt-2 py-2 rounded-lg text-sm active:scale-95 transition-transform"
            >
              + Add to Cart
            </button>
          </div>
        ))
      ) : (
        <p className="col-span-2 text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
};

// This is the most important line! 
export default ProductList;