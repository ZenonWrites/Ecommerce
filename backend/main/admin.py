from django.contrib import admin
from .models import Category, Product, Order

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'in_stock','featured','created_at']
    list_filter = ['category','in_stock','featured']
    search_fields = ['name' ,'description']
    list_editable = ['in_stock','featured']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','customer_name','customer_email','total_amount', 'status', 'created_at']
    list_filter = ['status','created_at']
    search_fields = ['customer_name','customer_email']
    readonly_fields = ['created_at']

