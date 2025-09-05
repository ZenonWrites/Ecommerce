import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Phone, Star, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { productApi, categoryApi, orderApi, whatsappApi } from './services/api';
import ProductDetail from './components/ProductDetail';
import ProductCard from './components/ProductCard';
import { HeroCarousel } from './components/HeroCarousel';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// Default product image in case none is provided from the backend
const DEFAULT_PRODUCT_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image+Available';

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

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

const Card = ({ children, className = '', ...props }) => (
  <div className={`rounded-lg border border-gray-200 bg-white text-black shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-black text-white',
    secondary: 'bg-gray-200 text-black',
    destructive: 'bg-black text-white',
    outline: 'text-black border border-black'
  };

  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

function App() {
  const [products, setProducts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({ items: [], total: 0, item_count: 0 });
  const [cartOpen, setCartOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const proceedToWhatsApp = async () => {
    if (cart.items.length === 0) return;
    
    setCheckingOut(true);
    try {
      // Format the order details for WhatsApp
      const orderDetails = cart.items.map(item => 
        `${item.quantity}x ${item.name} - ${formatPrice(item.price)}`
      ).join('\n');
      
      const total = formatPrice(cart.total);
      const message = `Hello,I'd like to buy the following items\n\nItems:\n${orderDetails}\n\nTotal: ${total}\n\nKindly proceed to the payment and shipping section.`;
      
      // Encode the message for URL
      const encodedMessage = encodeURIComponent(message);
      
      // Create WhatsApp URL with the order details
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Clear the cart after successful checkout
      setCart({ items: [], total: 0, item_count: 0 });
      localStorage.removeItem('cart');
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setCheckingOut(false);
      setCartOpen(false);
    }
  };

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        setIsLoading(true);
        console.log('Starting to fetch data from API...');
        
        // Fetch products with detailed logging
        console.log('Fetching products...');
        let productsResponse;
        try {
          productsResponse = await productApi.getAll();
          console.log('Raw products response:', productsResponse);
          console.log('Type of products response:', typeof productsResponse);
          if (Array.isArray(productsResponse)) {
            console.log('Products is an array with length:', productsResponse.length);
          } else if (productsResponse && typeof productsResponse === 'object') {
            console.log('Products is an object. Keys:', Object.keys(productsResponse));
            // If the response is an object with a 'results' or 'data' array, use that
            if (Array.isArray(productsResponse.results)) {
              console.log('Using products.results array');
              productsResponse = productsResponse.results;
            } else if (Array.isArray(productsResponse.data)) {
              console.log('Using products.data array');
              productsResponse = productsResponse.data;
            }
          }
          // Ensure products is always an array
          productsResponse = Array.isArray(productsResponse) ? productsResponse : [];
        } catch (productsError) {
          console.error('Error fetching products:', productsError);
          productsResponse = [];
        }

        // Fetch categories
        console.log('Fetching categories...');
        let categoriesResponse = [];
        try {
          categoriesResponse = await categoryApi.getAll();
          console.log('Categories response:', categoriesResponse);
        } catch (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        }

        // Fetch WhatsApp number
        console.log('Fetching WhatsApp number...');
        let whatsappResponse = { number: '' };
        try {
          whatsappResponse = await whatsappApi.getNumber();
          console.log('WhatsApp response:', whatsappResponse);
        } catch (whatsappError) {
          console.error('Error fetching WhatsApp number:', whatsappError);
        }
        
        // Set the final state
        console.log('Final products data to set:', productsResponse);
        console.log('Final categories data to set:', categoriesResponse);
        
        setProducts(Array.isArray(productsResponse) ? productsResponse : []);
        setCategories(Array.isArray(categoriesResponse) ? categoriesResponse : []);
        setWhatsappNumber(whatsappResponse?.whatsapp_number || '');
        setIsInitialized(true);
        
        // Load cart from localStorage with validation
        try {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            // Validate cart structure
            if (parsedCart && Array.isArray(parsedCart.items)) {
              setCart(parsedCart);
            } else {
              console.warn('Invalid cart structure in localStorage');
              // Reset to empty cart
              setCart({ items: [], total: 0, item_count: 0 });
            }
          }
        } catch (e) {
          console.error('Error loading cart from localStorage:', e);
          // Reset to empty cart on error
          setCart({ items: [], total: 0, item_count: 0 });
        }
        
      } catch (err) {
        console.error('Unexpected error in fetchAppData:', err);
        setError('Failed to load application data. Please refresh the page to try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppData();
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Calculate cart total and item count
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

  const removeFromCart = (productId) => {
    try {
      const newItems = cart.items.filter(item => item.product_id !== productId);
      const { total, item_count } = updateCartTotal(newItems);
      setCart({
        items: newItems,
        total,
        item_count
      });
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        removeFromCart(productId);
        return false;
      }

      const newItems = cart.items.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      
      const { total, item_count } = updateCartTotal(newItems);
      setCart({
        items: newItems,
        total,
        item_count
      });
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;

    try {
      // Prepare order data for the backend
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        total: cart.total,
        status: 'pending'
      };

      // Send order to backend
      const order = await orderApi.create(orderData);
      
      if (order) {
        // Clear cart on successful order
        setCart({ items: [], total: 0, item_count: 0 });
        localStorage.removeItem('cart');
        
        // Redirect to order confirmation or show success message
        alert(`Order #${order.id} placed successfully!`);
        setCartOpen(false);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const toggleFavorite = (productId) => {
    try {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      setFavorites(newFavorites);
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      </Router>
    );
  }

  const renderProductListing = () => (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-3xl font-bold text-center text-black mb-12">
        Featured Products
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm" style={{ borderBottomWidth: '1px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/">
                  <img
                    src="/trecentsblackfontnobg.png"
                    alt="Logo"
                    className="h-8 w-auto cursor-pointer"
                    style={{ height: '32px' }}
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
                  {cart.item_count > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                      {cart.item_count}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <HeroCarousel />

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                !isInitialized ? (
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                  </div>
                ) : error ? (
                  <div className="container mx-auto px-4 py-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  </div>
                ) : (
                  renderProductListing()
                )
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetail
                  addToCart={addToCart}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              }
            />
          </Routes>
        </main>

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
                          {cart.items.map((item, index) => (
                            <div key={item.product_id} className="cart-item flex items-start pl-0 pr-4 py-4 gap-8">
                              {/* Product Image */}
                              <div className="flex-shrink-0">
                                <a href={`/products/${item.product_id}`} tabIndex="-1" aria-hidden="true">
                                  <img
                                    className="w-20 h-20 object-cover rounded"
                                    src={item.image_url}
                                    alt={item.name}
                                    loading="lazy"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
                                    }}
                                  />
                                </a>
                              </div>

                              {/* Product Details and Price */}
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
                                      Rs. {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                      Rs. {item.price.toFixed(2)} each
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
                  <div className="totals text-right mb-2">
                    <h2 className="text-sm font-medium text-gray-700">Estimated total</h2>
                    <p className="text-lg font-bold">{formatPrice(cart.total)}</p>
                  </div>
                  
                  <small className="text-xs text-gray-500 block mb-4">
                    Taxes included. Discounts and shipping calculated at checkout.
                  </small>
          </div>)} {/* Close cart-scroll-container */}
          {cart.items.length > 0 && (
            <div className="cart-drawer__footer p-6 border-t border-gray-200 bg-white">
              <div className="totals text-right mb-2">
                <h2 className="text-sm font-medium text-gray-700">Estimated total</h2>
                <p className="text-lg font-bold">{formatPrice(cart.total)}</p>
              </div>
              
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
                  You'll be redirected to WhatsApp to complete your order </p>p
                </div>
              </div>)}
          )
        </div>
      {/* Cart Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-12">
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

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .cart-badge-animate {
          animation: bounce-in 0.3s ease-out;
        }
        
        .product-image:hover {
          transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
          .cart-sidebar {
            width: 100vw;
          }
        }
      `}</style>
      </div>
    </Router>
  );
}

export default App;
