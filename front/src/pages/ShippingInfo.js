import React from 'react';

const ShippingInfo = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Shipping Information</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Shipping Policy</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-medium mb-3">Shipping Methods & Costs</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Standard Shipping</h4>
                    <p className="text-gray-300 text-sm">3-5 business days</p>
                  </div>
                  <p className="text-right">$4.99</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-600">
                  <div>
                    <h4 className="font-medium">Express Shipping</h4>
                    <p className="text-gray-300 text-sm">1-2 business days</p>
                  </div>
                  <p className="text-right">$9.99</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-600">
                  <div>
                    <h4 className="font-medium">Free Shipping</h4>
                    <p className="text-gray-300 text-sm">5-7 business days on orders over $50</p>
                  </div>
                  <p className="text-right text-green-400">FREE</p>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-medium mb-3">Processing Time</h3>
              <p className="text-gray-300">
                All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. 
                You will receive another notification when your order has shipped.
              </p>
            </div>
            
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-medium mb-3">International Shipping</h3>
              <p className="text-gray-300 mb-4">
                We currently ship to the following countries:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'UAE'].map(country => (
                  <div key={country} className="flex items-center">
                    <svg className="h-4 w-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {country}
                  </div>
                ))}
              </div>
              <p className="text-gray-300 mt-4">
                International shipping rates and delivery times vary by destination. Additional customs and taxes may apply.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3">Order Tracking</h3>
              <p className="text-gray-300 mb-4">
                Once your order has shipped, you will receive a shipping confirmation email with a tracking number and a link to track your package.
              </p>
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-300 mb-2">Having trouble with your order?</h4>
                <p className="text-sm text-blue-200">
                  If you have any questions about your order or need assistance with tracking, please contact our 
                  <a href="/contact" className="text-blue-300 hover:text-white underline ml-1">customer support team</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
