from rest_framework import serializers
from .models import Category, Product, Order

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'category', 'image', 'category_name', 'in_stock', 'featured', 'discount']
        
    def to_representation(self, instance):
        # This will ensure the image URL is always absolute
        representation = super().to_representation(instance)
        if 'http' not in (representation['image'] or ''):
            # If the URL is relative, make it absolute using the current request
            request = self.context.get('request')
            if request and representation['image']:
                representation['image'] = request.build_absolute_uri(representation['image'])
        return representation

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['customer_name', 'customer_email', 'customer_phone', 'customer_address', 'total_amount', 'order_items']
        read_only_fields = ['status']

    def validate_order_items(self, value):
        if not value or not isinstance(value, list):
            raise serializers.ValidationError("Order must contain at least one item.")
        for item in value:
            if not all(key in item for key in ['name', 'quantity', 'price']):
                raise serializers.ValidationError("Each item must have 'name', 'quantity', and 'price'.")
        return value

    def validate_total_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Total amount must be greater than zero.")
        return value

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'