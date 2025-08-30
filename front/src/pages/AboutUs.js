import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-300 mb-6">
            Welcome to our e-commerce store! We started with a simple mission: to provide high-quality products 
            with exceptional customer service. Since our founding, we've been committed to making online shopping 
            easy, secure, and enjoyable for everyone.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8">Our Mission</h2>
          <p className="text-gray-300">
            We believe in quality, affordability, and sustainability. Our team works tirelessly to source the best products 
            while maintaining competitive prices and minimizing our environmental impact.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Quality Products</h3>
            <p className="text-gray-300">
              We carefully select our products to ensure they meet our high standards for quality and durability.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Customer Satisfaction</h3>
            <p className="text-gray-300">
              Your satisfaction is our top priority. Our support team is always here to help with any questions or concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
