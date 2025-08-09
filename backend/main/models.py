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
    image = models.URLField(blank=True, null=True, help_text='Direct URL to the product image')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    in_stock = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']  # Default ordering by name

    def __str__(self):
        return self.name

    # Image URL is now handled directly by the image field


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


