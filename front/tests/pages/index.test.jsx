// tests/pages/index.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    getFeaturedProducts: jest.fn(() =>
      Promise.resolve([{ id: 1, name: 'Test Product', price: '99.99' }])
    )
  }
}));

describe('HomePage', () => {
  it('displays featured products', async () => {
    render(<HomePage />);

    // Check if loading state is shown
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });
  });
});