from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, Order, ProductImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ['preview']
    
    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image)
        return "(No image)"
    preview.short_description = 'Preview'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'in_stock', 'featured', 'created_at', 'image_count']
    list_filter = ['category', 'in_stock', 'featured']
    search_fields = ['name', 'description']
    list_editable = ['in_stock', 'featured']
    inlines = [ProductImageInline]
    
    def image_count(self, obj):
        return obj.images.count()
    image_count.short_description = 'Images'

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'product', 'is_primary', 'order', 'preview']
    list_filter = ['is_primary', 'product__category']
    search_fields = ['product__name', 'alt_text']
    list_editable = ['is_primary', 'order']
    readonly_fields = ['preview']
    
    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 200px; max-width: 200px;" />', obj.image)
        return "(No image)"
    preview.short_description = 'Preview'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','customer_name','customer_email','total_amount', 'status', 'created_at']
    list_filter = ['status','created_at']
    search_fields = ['customer_name','customer_email']
    readonly_fields = ['created_at']

