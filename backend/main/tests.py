from django.test import TestCase, RequestFactory
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.test import force_authenticate
from django.contrib.auth.models import User
from .models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderCreateSerializer
from django.conf import settings
from unittest.mock import patch


class CategoryModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics")

    def test_category_creation(self):
        self.assertEqual(str(self.category), "Electronics")
        self.assertTrue(isinstance(self.category, Category))
        self.assertEqual(self.category.name, "Electronics")


class ProductModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics")
        self.product = Product.objects.create(
            name="Laptop",
            description="High performance laptop",
            price=999.99,
            category=self.category,
            in_stock=True,
            featured=True
        )

    def test_product_creation(self):
        self.assertEqual(str(self.product), "Laptop")
        self.assertEqual(self.product.category.name, "Electronics")
        self.assertTrue(self.product.in_stock)
        self.assertTrue(self.product.featured)


class OrderModelTest(TestCase):
    def setUp(self):
        self.order = Order.objects.create(
            customer_name="John Doe",
            customer_email="john@example.com",
            customer_phone=1234567890,
            customer_address="123 Main St",
            total_amount=199.98,
            order_items=[
                {"name": "Laptop", "quantity": 1, "price": "999.99"},
                {"name": "Mouse", "quantity": 2, "price": "49.99"}
            ]
        )

    def test_order_creation(self):
        self.assertEqual(str(self.order), f"Order {self.order.id} - John Doe")
        self.assertEqual(len(self.order.order_items), 2)
        self.assertEqual(self.order.status, "pending")


class CategoryViewSetTest(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics")
        self.url = '/api/categories/'
        self.detail_url = f'/api/categories/{self.category.id}/'

    def test_get_categories(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        categories = response.data['results'] if 'results' in response.data else response.data
        self.assertTrue(any(cat['name'] == 'Electronics' for cat in categories))

    def test_get_category_detail(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Electronics')


class ProductViewSetTest(APITestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.category = Category.objects.create(name="Electronics")
        self.product = Product.objects.create(
            name="Laptop",
            description="High performance laptop",
            price=999.99,
            category=self.category,
            in_stock=True
        )
        self.url = '/api/products/'
        self.detail_url = f'/api/products/{self.product.id}/'

    def test_get_products(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        products = response.data['results'] if 'results' in response.data else response.data
        self.assertTrue(any(p['name'] == 'Laptop' for p in products))

    def test_get_product_detail(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Laptop')

    def test_filter_products_by_category(self):
        other_category = Category.objects.create(name="Other")
        other_product = Product.objects.create(
            name="Not in category",
            price=10.00,
            category=other_category
        )
        
        response = self.client.get(f"{self.url}?category={self.category.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        products = response.data['results'] if 'results' in response.data else response.data
        
        for product in products:
            self.assertEqual(product['category'], self.category.id)

    def test_filter_featured_products(self):
        response = self.client.get(f"{self.url}?featured=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class OrderAPITest(APITestCase):
    def setUp(self):
        self.url = '/api/orders/'
        self.create_url = '/api/orders/create/'
        self.whatsapp_url = '/api/whatsapp/'
        self.valid_payload = {
            "customer_name": "John Doe",
            "customer_email": "john@example.com",
            "customer_phone": "1234567890",
            "customer_address": "123 Main St",
            "total_amount": "199.98",
            "order_items": [
                {"name": "Laptop", "quantity": 1, "price": "999.99"},
                {"name": "Mouse", "quantity": 2, "price": "49.99"}
            ]
        }

    @patch('main.views.settings.WHATSAPP_NUMBER', '+1234567890')
    def test_create_order(self):
        response = self.client.post(
            self.create_url,
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('whatsapp_url' in response.data)
        self.assertEqual(Order.objects.count(), 1)

    def test_create_order_invalid_data(self):
        invalid_payload = {
            "customer_name": "",  # Invalid: empty name
            "customer_email": "invalid-email",
            "customer_phone": "not-a-phone",
            "total_amount": "-100",  # Invalid: negative amount
            "order_items": []  # Invalid: empty items
        }
        response = self.client.post(
            self.create_url,
            data=invalid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('customer_name', response.data['errors'])
        self.assertIn('customer_email', response.data['errors'])
        self.assertIn('customer_phone', response.data['errors'])
        self.assertIn('total_amount', response.data['errors'])
        self.assertIn('order_items', response.data['errors'])

    def test_get_whatsapp_number(self):
        with self.settings(WHATSAPP_NUMBER='+1234567890'):
            response = self.client.get(self.whatsapp_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['whatsapp_number'], '+1234567890')


class SecurityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.category = Category.objects.create(name="Test Category")
        self.product = Product.objects.create(
            name="Test Product",
            description="Test Description",
            price=100.00,
            category=self.category
        )

    def test_unauthorized_access(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        response = self.client.post('/api/products/', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        response = self.client.get('/api/orders/')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])


class SerializerTests(TestCase):
    def test_category_serializer(self):
        category = Category.objects.create(name="Test Category")
        serializer = CategorySerializer(category)
        self.assertEqual(serializer.data['name'], "Test Category")

    def test_product_serializer(self):
        category = Category.objects.create(name="Test Category")
        product = Product.objects.create(
            name="Test Product",
            description="Test Description",
            price=100.00,
            category=category
        )
        serializer = ProductSerializer(product)
        self.assertEqual(serializer.data['name'], "Test Product")
        self.assertEqual(serializer.data['category_name'], "Test Category")

    def test_order_serializer(self):
        order_data = {
            "customer_name": "John Doe",
            "customer_email": "john@example.com",
            "customer_phone": "1234567890",
            "customer_address": "123 Main St",
            "total_amount": "199.98",
            "order_items": [
                {"name": "Laptop", "quantity": 1, "price": "999.99"}
            ]
        }
        serializer = OrderCreateSerializer(data=order_data)
        self.assertTrue(serializer.is_valid())