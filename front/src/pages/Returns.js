import React from 'react';

const Returns = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Returns & Exchanges</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-200">
                  Please review our return policy below before initiating a return. Items must be returned within 30 days of delivery.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Items must be unused, unworn, and in their original packaging with all tags attached</li>
                  <li>Returns must be postmarked within 30 days of the delivery date</li>
                  <li>Final sale items are not eligible for return or exchange</li>
                  <li>Shipping costs are non-refundable</li>
                </ul>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">How to Return an Item</h2>
              <div className="bg-gray-700 rounded-lg p-4">
                <ol className="space-y-4">
                  {[
                    {
                      title: '1. Initiate Your Return',
                      description: 'Log in to your account and go to Order History to start your return. You will receive a return authorization number and instructions.'
                    },
                    {
                      title: '2. Package Your Item',
                      description: 'Securely pack the item in its original packaging. Include all parts, accessories, and documentation.'
                    },
                    {
                      title: '3. Ship Your Return',
                      description: 'Affix the provided return label to your package and drop it off at any authorized shipping location.'
                    },
                    {
                      title: '4. Track Your Return',
                      description: 'Use the tracking number provided to monitor your return shipment.'
                    },
                    {
                      title: '5. Receive Your Refund',
                      description: 'Once we receive and inspect your return, we will process your refund within 5-7 business days.'
                    }
                  ].map((step, index) => (
                    <li key={index} className="pb-4 border-b border-gray-600 last:border-0 last:pb-0">
                      <h3 className="font-medium text-lg">{step.title}</h3>
                      <p className="text-gray-300 text-sm mt-1">{step.description}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Refund Processing Time</h3>
                  <p className="text-gray-300 text-sm">
                    Please allow 5-7 business days for your return to be processed after we receive it. Refunds will be issued to the original payment method.
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Return Shipping Costs</h3>
                  <p className="text-gray-300 text-sm">
                    Customers are responsible for return shipping costs unless the return is due to our error or a defective item.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
              <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4">
                <p className="text-blue-200">
                  <strong>Need a different size or color?</strong> Please place a new order for the item you want and follow the return process to send back the original item.
                </p>
              </div>
            </section>
            
            <section className="bg-gray-700 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about our return policy or need assistance with your return, please contact our customer service team.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
              >
                Contact Us
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
