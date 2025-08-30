import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Heart, Truck, Shield } from 'lucide-react';
import { productApi } from '../services/api';

const ProductDetail = ({ addToCart, favorites, toggleFavorite }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productApi.getById(id);
        setProduct(productData);
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center mx-auto px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Product Section */}
          <div className="flex flex-col">
            {/* Image Section */}
            <div className="w-full p-4">
              <div className="relative h-80 md:h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                <img 
                  src={product.image || 'https://via.placeholder.com/800x800?text=No+Image+Available'} 
                  alt={product.name}
                  className="max-h-full max-w-full object-contain p-4"
                />
                {product.featured && (
                  <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Featured
                  </span>
                )}

              </div>
            </div>

            {/* Product Info Section */}
            <div className="w-full p-6 border-t border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-sm text-gray-500">
                  SKU: {product.id || 'N/A'}
                </span>
              </div>

              <div className="text-2xl font-bold text-gray-900 mb-6">
                {new Intl.NumberFormat('en-IN', { 
                  style: 'currency', 
                  currency: 'INR' 
                }).format(product.price)}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-md font-medium text-white transition-colors ${
                    product.in_stock 
                      ? 'bg-black hover:bg-gray-800' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Delivery & Returns</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Truck className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Free Delivery</h4>
                      <p className="text-xs text-gray-500">Delivered in 3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Easy Returns</h4>
                      <p className="text-xs text-gray-500">30 days return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
