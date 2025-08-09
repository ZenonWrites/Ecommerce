from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import ProductViewSet, OrderListView, CategoryViewSet

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'categories', views.CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/create/', views.create_order, name='create-order'),
    path('whatsapp/', views.get_whatsapp_number, name='whatsapp-number'),
]