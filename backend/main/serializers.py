from rest_framework import serializers
from .models import Category, Product, Order, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'alt_text', 'order']
        read_only_fields = ['id', 'is_primary', 'order']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ensure the image URL is absolute
        if 'http' not in (representation['image'] or ''):
            request = self.context.get('request')
            if request and representation['image']:
                representation['image'] = request.build_absolute_uri(representation['image'])
        return representation

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'category', 'category_name', 
            'in_stock', 'featured', 'discount', 'images', 'size', 'flavour'
        ]
    
    def get_images(self, obj):
        # Get all images for the product, ordered by 'order' and 'created_at'
        images = obj.images.all()
        # If no images exist but there's a legacy image, include it
        if not images.exists() and obj.image:
            return [
                {
                    'id': 0,
                    'image': self._get_absolute_url(obj.image),
                    'is_primary': True,
                    'alt_text': obj.name,
                    'order': 0
                }
            ]
        # Serialize the images
        return ProductImageSerializer(
            images, 
            many=True, 
            context=self.context
        ).data
    
    def _get_absolute_url(self, url):
        """Helper method to convert relative URLs to absolute"""
        if not url or url.startswith(('http://', 'https://')):
            return url
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(url)
        return url

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