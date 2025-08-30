import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR' 
    }).format(price);
  };

  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on the favorite button or add to cart button
    if (e.target.closest('button, a')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative pt-[100%] overflow-hidden">
        <img
          src={product.image || 'https://via.placeholder.com/400x300?text=No+Image+Available'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {!product.in_stock && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12 hover:underline">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{product.category_name}</p>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click handler from firing
            onAddToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1
            });
          }}
          disabled={!product.in_stock}
          className={`mt-3 w-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 ${
            product.in_stock 
              ? 'bg-black text-white hover:bg-gray-900' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
