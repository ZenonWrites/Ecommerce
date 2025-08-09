/// <reference types="cypress" />

describe('E-commerce Shop', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/')
    
    // Mock API responses
    cy.intercept('GET', '/api/products*', { fixture: 'products.json' }).as('getProducts')
    cy.intercept('POST', '/api/cart', { statusCode: 201, body: { success: true } }).as('addToCart')
    cy.intercept('POST', '/api/orders', { 
      statusCode: 201, 
      body: { 
        success: true, 
        order_id: '12345',
        whatsapp_url: 'https://wa.me/1234567890?text=Order%20details'
      } 
    }).as('createOrder')
  })

  it('should allow a user to browse products and complete checkout', () => {
    // 1. Verify home page loads with featured products
    cy.get('h1').should('contain', 'Welcome to Our Store')
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0)

    // 2. Navigate to a product detail page
    cy.get('[data-testid="product-card"]').first().click()
    cy.url().should('include', '/products/')
    
    // 3. Add product to cart
    cy.get('[data-testid="add-to-cart"]').click()
    cy.wait('@addToCart').its('response.statusCode').should('eq', 201)
    
    // 4. Go to cart
    cy.get('[data-testid="cart-icon"]').click()
    cy.url().should('include', '/cart')
    
    // 5. Verify cart contents
    cy.get('[data-testid="cart-item"]').should('have.length', 1)
    cy.get('[data-testid="checkout-button"]').click()
    
    // 6. Fill out checkout form
    cy.url().should('include', '/checkout')
    cy.get('[data-testid="customer-name"]').type('John Doe')
    cy.get('[data-testid="customer-email"]').type('john@example.com')
    cy.get('[data-testid="customer-phone"]').type('1234567890')
    cy.get('[data-testid="customer-address"]').type('123 Main St, City, Country')
    
    // 7. Submit order
    cy.get('[data-testid="place-order"]').click()
    
    // 8. Verify order confirmation
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201)
    cy.url().should('include', '/order-confirmation')
    cy.get('[data-testid="order-confirmation"]').should('be.visible')
    cy.get('[data-testid="order-id"]').should('contain', '12345')
  })

  it('should display an error when product is out of stock', () => {
    // Mock an out of stock product
    cy.intercept('GET', '/api/products/out-of-stock-product', {
      statusCode: 200,
      body: {
        id: 'out-of-stock-product',
        name: 'Out of Stock Product',
        price: 99.99,
        in_stock: false
      }
    })

    // Visit out of stock product
    cy.visit('/products/out-of-stock-product')
    
    // Verify out of stock message
    cy.get('[data-testid="out-of-stock"]').should('be.visible')
    cy.get('[data-testid="add-to-cart"]').should('be.disabled')
  })
})
