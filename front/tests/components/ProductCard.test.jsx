// tests/components/ProductCard.test.jsx
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: '99.99',
  image: '/test-image.jpg',
  in_stock: true,
  featured: true
};

describe('ProductCard', () => {
  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toHaveAttribute('src', '/test-image.jpg');
  });

  it('shows out of stock badge when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, in_stock: false };
    render(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});