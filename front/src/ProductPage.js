import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Star, Phone, X, Plus, Minus, Trash2, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { productApi, whatsappApi } from './services/api';

// Use a more reliable placeholder image URL
const DEFAULT_PRODUCT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgNDAwIDMwMCIgZmlsbD0iI2VlZSI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2UgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

// UI Components
const Button = ({ children, className = '', variant = 'default', size = 'default', onClick, disabled, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    default: 'bg-black text-white hover:bg-gray-900',
    outline: 'border border-black bg-white text-black hover:bg-gray-100',
    ghost: 'hover:bg-gray-100 text-black',
    destructive: 'bg-black text-white hover:bg-gray-900'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

const ProductPage = ({ favorites, toggleFavorite }) => {
  // Initialize cart state
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add state for the currently selected image
  const [selectedImage, setSelectedImage] = useState(0);

  // Helper function to handle image error
  const handleImageError = (e) => {
    e.target.src = DEFAULT_PRODUCT_IMAGE;
  };

  const updateCartTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const item_count = items.reduce((count, item) => count + item.quantity, 0);
    return { total, item_count };
  };

  const saveCartToStorage = (cartData) => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  const addToCart = (product) => {
    try {
      const existingItem = cart.items.find(item => item.product_id === product.id);
      let newItems;

      if (existingItem) {
        newItems = cart.items.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...cart.items, {
          product_id: product.id,
          name: product.name,
          price: parseFloat(product.price), // Ensure price is a number
          quantity: 1,
          image_url: product.image || DEFAULT_PRODUCT_IMAGE
        }];
      }

      const { total, item_count } = updateCartTotal(newItems);
      const newCart = {
        items: newItems,
        total,
        item_count
      };

      setCart(newCart);
      saveCartToStorage(newCart);
      setCartOpen(true);

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

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

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.product_id !== productId),
      item_count: prevCart.item_count - 1
    }));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      );
      
      const total = updatedItems.reduce((sum, item) => sum + (item.originalPrice * 0.82 * item.quantity), 0);
      
      return {
        items: updatedItems,
        total,
        item_count: updatedItems.reduce((count, item) => count + item.quantity, 0)
      };
    });
  };

  const proceedToWhatsApp = async () => {
    if (cart.items.length === 0) return;
    
    setCheckingOut(true);
    try {
      const orderDetails = cart.items.map(item => 
        `${item.quantity}x ${item.name} - ${formatPrice(item.price)}`
      ).join('\n');
      
      const total = formatPrice(cart.total);
      const message = `Hello, I'd like to buy the following items\n\nItems:\n${orderDetails}\n\nTotal: ${total}\n\nKindly proceed to the payment and shipping section.`;
      
      const whatsappUrl = `https://wa.me/${whatsappApi.getNumber()}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      // Clear cart after successful order
      setCart({ items: [], total: 0, item_count: 0 });
      setCartOpen(false);
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setCheckingOut(false);
    }
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/trecentsblackfontnobg.png"
                  alt="Logo"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCartOpen(!cartOpen)}
                className="relative border-black hover:bg-blue-100"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span className="font-medium">Cart</span>
                {cart?.item_count > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                    {cart.item_count}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
            {/* Left Column - Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white rounded-lg overflow-hidden border flex items-center justify-center" style={{ width: '500px', height: '500px' }}>
                <img
                  src={product.images && product.images[selectedImage] ? product.images[selectedImage].image : DEFAULT_PRODUCT_IMAGE}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-4"
                  onError={handleImageError}
                  style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
                />
              </div>
              
              {/* Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, index) => (
                    <div 
                      key={img.id || index}
                      className={`flex-shrink-0 w-20 h-20 border rounded-md overflow-hidden cursor-pointer hover:border-gray-400 ${
                        selectedImage === index ? 'border-black' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img 
                        src={img.image || DEFAULT_PRODUCT_IMAGE}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex-shrink-0 w-20 h-20 border rounded-md overflow-hidden">
                    <img 
                      src={DEFAULT_PRODUCT_IMAGE}
                      alt="No images available"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="py-2">
              {/* Brand and Title */}
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-500">{product.brand || 'Brand'}</span>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${
                        star <= Math.round(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.rating_count || 0} reviews)</span>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price * product.discount )}
                  </span>
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">Save {formatPrice(product.price * (1 - product.discount))}</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button 
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50"
                    onClick={() => updateQuantity(product.id, (product.quantity || 1) - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300">
                    {product.quantity || 1}
                  </div>
                  <button 
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50"
                    onClick={() => updateQuantity(product.id, (product.quantity || 0) + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className={`flex-1 flex items-center justify-center px-8 py-4 rounded-md font-medium text-white transition-colors ${
                    product.in_stock 
                      ? 'bg-black hover:bg-gray-800' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-4 rounded-md border ${
                    favorites.has(product.id)
                      ? 'text-red-500 border-red-200 bg-red-50'
                      : 'text-gray-400 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Heart 
                    className={`w-5 h-5 ${favorites.has(product.id) ? 'fill-current' : ''}`} 
                  />
                </button>
              </div>

              {/* Delivery & Returns */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <Truck className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Free Delivery</h4>
                      <p className="text-sm text-gray-500">On all orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <ShieldCheck className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Authentic Products</h4>
                      <p className="text-sm text-gray-500">100% genuine products</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Easy Returns</h4>
                      <p className="text-sm text-gray-500">30 days return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="border-t border-gray-200 px-8 py-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Size</h3>
                  <p className="mt-1 text-sm text-gray-900">{product.size || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Flavour</h3>
                  <p className="mt-1 text-sm text-gray-900">{product.flavour || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500"></h3>
                  <p className="mt-1 text-sm text-gray-900"></p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500"></h3>
                  <p className="mt-1 text-sm text-gray-900"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img
                src="/trecentswhitefontnobg.png"
                alt="Logo"
                className="h-8 w-auto mb-4"
                style={{ height: '32px' }}
              />
              <p className="text-gray-400">
                Your trusted partner for premium products
              </p>
            </div>
            <ul>
              <li className="hover:text-white cursor-pointer transition-colors">Shipping Info</li>
              <li className="hover:text-white cursor-pointer transition-colors">Returns</li>
            </ul>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Trècénts. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Cart Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
      <div className="flex bg-black justify-between items-center p-6 border-b">
        <h3 className="text-xl text-white font-semibold">Shopping Cart</h3>
        <Button variant="ghost" size="md" onClick={() => setCartOpen(false)} className="h-8 w-8 p-0 hover:bg-transparent">
          <X className="w-12 h-12 text-white text-xl" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 cart-scroll-container" style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        <form action="/cart" id="CartDrawer-Form" className="cart__contents cart-drawer__form" method="post">
          <div id="CartDrawer-CartItems" className="drawer__contents js-contents">
            <div className="drawer__cart-items-wrapper">
              <div className="cart-items w-full">
                {cart.items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <div key={item.product_id} className="cart-item flex items-start pl-0 pr-4 py-4 gap-8">
                        <div className="flex-shrink-0">
                          <a href={`/products/${item.product_id}`} tabIndex="-1" aria-hidden="true">
                            <img
                              className="w-20 h-20 object-cover rounded"
                              src={item.image_url || 'https://via.placeholder.com/400x300?text=No+Image+Available'}
                              alt={item.name}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
                              }}
                            />
                          </a>
                        </div>

                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-900">
                                <a href={`/products/${item.product_id}`} className="hover:underline">
                                  {item.name}
                                </a>
                              </h3>
                              <p className="text-sm text-gray-500">Size: {item.size || 'One Size'}</p>
                            </div>
                            <div className="text-right space-y-1">
                              <span className="font-bold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              <p className="text-xs text-gray-500">
                                {formatPrice(item.price)} each
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                className="px-2 py-1 hover:bg-gray-100 focus:outline-none"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="px-2 py-1 text-sm w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                className="px-2 py-1 hover:bg-gray-100 focus:outline-none"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product_id)}
                              className="text-gray-500 hover:text-red-600 focus:outline-none"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p id="CartDrawer-LiveRegionText" className="visually-hidden" role="status"></p>
          </div>
          <div id="CartDrawer-CartErrors" role="alert"></div>
        </form>
      </div>
      
      {cart.items.length > 0 && (
        <div className="cart-drawer__footer p-6 border-t border-gray-200 bg-white">
          <small className="text-xs text-gray-500 block mb-4">
            Taxes included. Discounts and shipping calculated at checkout.
          </small>
          <div className="cart__ctas">
            <Button
              onClick={proceedToWhatsApp}
              disabled={checkingOut}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {checkingOut ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Check out
                </div>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              You'll be redirected to WhatsApp to complete your order
            </p>
          </div>
        </div>
      )}
    </div>

      {/* Cart Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setCartOpen(false)}
        />
      )}
    </div>
  );
};

const styles = `
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .cart-scroll-container::-webkit-scrollbar {
    display: none;
  }
`;

// Add styles to the document head
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default ProductPage;