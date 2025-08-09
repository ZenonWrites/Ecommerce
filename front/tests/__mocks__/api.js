// tests/__mocks__/api.js
export const apiClient = {
  getFeaturedProducts: jest.fn(() =>
    Promise.resolve([{ id: 1, name: 'Test Product', price: '99.99' }])
  ),
  // Add other API methods as needed
};