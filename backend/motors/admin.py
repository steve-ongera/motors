from django.contrib import admin
from .models import Brand, VehicleModel, Vehicle, VehicleImage, SellRequest, Enquiry, FAQ, ContactMessage


class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 3


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(VehicleModel)
class VehicleModelAdmin(admin.ModelAdmin):
    list_display = ['brand', 'name', 'slug']
    list_filter = ['brand']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['title', 'brand', 'model', 'year', 'price', 'currency', 'availability', 'is_featured']
    list_filter = ['vehicle_type', 'brand', 'condition', 'availability', 'is_featured', 'listing_type']
    search_fields = ['title', 'description', 'brand__name', 'model__name']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [VehicleImageInline]
    list_editable = ['availability', 'is_featured']


@admin.register(SellRequest)
class SellRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'brand', 'model', 'year', 'asking_price', 'status', 'created_at']
    list_filter = ['status']
    list_editable = ['status']


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'vehicle', 'phone', 'created_at']
    list_filter = ['created_at']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['category', 'is_active']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'subject', 'email', 'is_read', 'created_at']
    list_editable = ['is_read']