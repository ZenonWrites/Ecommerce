from django.core.serializers import serialize
from pyexpat import features

from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view
from django.conf import settings
from urllib.parse import quote
from django.shortcuts import render
from rest_framework.response import Response
from unicodedata import category

from .models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderCreateSerializer, OrderSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    http_method_names = ['get']  # Only allow GET requests

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        featured = self.request.query_params.get('featured', None)

        if category is not None:
            queryset = queryset.filter(category_id=category)

        if featured is not None:
            queryset = queryset.filter(featured=True)

        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

from rest_framework.permissions import IsAuthenticated

class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
def create_order(request):
    serializer = OrderCreateSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        #Whatsapp
        message = order.get_order_text()
        whatsapp_url = f"https://wa.me/{settings.WHATSAPP_NUMBER.replace('+','')}?text={quote(message)}"

        return Response({
            'success': True,
            'order_id': order.id,
            'whatsapp_url': whatsapp_url,
            'message': 'Order created successfully'
        }, status=status.HTTP_201_CREATED)

    return Response({
        'success': False,
        'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_whatsapp_number(request):
    return Response({
        'whatsapp_number': settings.WHATSAPP_NUMBER
    })
@api_view(['POST'])
def init_products(request):
    # Initialize sample products
    return Response({'success': True})

@api_view(['GET'])
def get_cart(request, session_id='default'):
    # Return cart data
    return Response({
        'items': [],
        'total': 0,
        'item_count': 0
    })

@api_view(['POST'])
def add_to_cart(request):
    # Add item to cart logic
    return Response({'success': True})
