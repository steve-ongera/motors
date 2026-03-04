from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from motors.views import (
    BrandViewSet, VehicleModelViewSet, VehicleViewSet,
    SellRequestViewSet, EnquiryViewSet, FAQViewSet, ContactViewSet
)

router = DefaultRouter()
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'vehicle-models', VehicleModelViewSet, basename='vehiclemodel')
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'sell-requests', SellRequestViewSet, basename='sellrequest')
router.register(r'enquiries', EnquiryViewSet, basename='enquiry')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'contact', ContactViewSet, basename='contact')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)