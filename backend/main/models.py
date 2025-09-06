from django.db import models
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']  # Default ordering by name

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # Keeping image as a fallback for backward compatibility
    image = models.URLField(blank=True, null=True, help_text='Main product image URL (deprecated, use productimage_set)')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    in_stock = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    discount = models.FloatField(default=0.82, help_text='Discount multiplier (e.g., 0.82 for 18% off)')
    created_at = models.DateTimeField(auto_now_add=True)
    size = models.CharField(max_length=100, blank=True, null=True)
    flavour = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        ordering = ['name']  # Default ordering by name

    def __str__(self):
        return self.name

    @property
    def images(self):
        """Helper method to get all images for this product"""
        return self.productimage_set.all()

    @property
    def main_image(self):
        """Helper method to get the main image or first available image"""
        return self.images.first() or self.image


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.URLField(help_text='URL of the product image')
    is_primary = models.BooleanField(default=False, help_text='Set as the primary display image')
    alt_text = models.CharField(max_length=255, blank=True, help_text='Alt text for accessibility')
    order = models.PositiveIntegerField(default=0, help_text='Order in which images should be displayed')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'

    def __str__(self):
        return f"Image for {self.product.name}"

    def save(self, *args, **kwargs):
        # If this is the first image, make it primary
        if not self.pk and not ProductImage.objects.filter(product=self.product).exists():
            self.is_primary = True
        super().save(*args, **kwargs)

        # If this image is set as primary, ensure no other images are marked as primary
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product
            ).exclude(
                pk=self.pk
            ).update(is_primary=False)


class Order(models.Model):
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.IntegerField()
    customer_address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_items = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50,default='pending')

    def __str__(self):
        return f"Order {self.id} - {self.customer_name}"

    def get_order_text(self):
        text = f"🛒 *New Order #{self.id}*\n\n"
        text += f"👤 *Customer:* {self.customer_name}\n"
        text += f"📧 *Email:* {self.customer_email}\n"
        text += f"📱 *Phone:* {self.customer_phone}\n"
        text += f"📍 *Address:* {self.customer_address}\n\n"
        text += f"🛍️ *Items:*\n"

        for item in self.order_items:
            text += f". {item['name']} x{item['quantity']} - {item['price']}\n"
        text += f"\n💰 *Total Amount:* ${self.total_amount}\n"
        text += f"📅 *Order Date:* {self.created_at.strftime('%Y-%m-%d %H:%M')}"

        return text


