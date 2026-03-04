from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Brand, VehicleModel, Vehicle, SellRequest, Enquiry, FAQ, ContactMessage
from .serializers import (
    BrandSerializer, VehicleModelSerializer, VehicleListSerializer,
    VehicleDetailSerializer, SellRequestSerializer, EnquirySerializer,
    FAQSerializer, ContactMessageSerializer
)
import django_filters


class VehicleFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_year = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    max_year = django_filters.NumberFilter(field_name='year', lookup_expr='lte')
    min_engine = django_filters.NumberFilter(field_name='engine_size', lookup_expr='gte')
    max_engine = django_filters.NumberFilter(field_name='engine_size', lookup_expr='lte')
    brand_slug = django_filters.CharFilter(field_name='brand__slug')
    model_slug = django_filters.CharFilter(field_name='model__slug')

    class Meta:
        model = Vehicle
        fields = [
            'vehicle_type', 'brand', 'model', 'condition', 'listing_type',
            'fuel_type', 'transmission', 'drive', 'availability', 'currency',
            'brand_slug', 'model_slug', 'min_price', 'max_price',
            'min_year', 'max_year',
        ]


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def models(self, request, slug=None):
        brand = self.get_object()
        models = VehicleModel.objects.filter(brand=brand)
        serializer = VehicleModelSerializer(models, many=True)
        return Response(serializer.data)


class VehicleModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VehicleModel.objects.select_related('brand').all()
    serializer_class = VehicleModelSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['brand', 'brand__slug']


class VehicleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Vehicle.objects.select_related('brand', 'model').prefetch_related('images').filter(availability='available')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = VehicleFilter
    search_fields = ['title', 'description', 'brand__name', 'model__name']
    ordering_fields = ['price', 'year', 'created_at', 'views_count']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return VehicleDetailSerializer
        return VehicleListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = self.get_queryset().filter(is_featured=True)[:8]
        serializer = VehicleListSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Vehicle.objects.filter(availability='available').count()
        cars = Vehicle.objects.filter(availability='available', vehicle_type='car').count()
        motorcycles = Vehicle.objects.filter(availability='available', vehicle_type='motorcycle').count()
        brands = Brand.objects.count()
        return Response({
            'total_vehicles': total,
            'cars': cars,
            'motorcycles': motorcycles,
            'brands': brands,
        })

    @action(detail=True, methods=['get'])
    def similar(self, request, slug=None):
        vehicle = self.get_object()
        similar = Vehicle.objects.filter(
            availability='available',
            brand=vehicle.brand,
        ).exclude(id=vehicle.id)[:4]
        if similar.count() < 4:
            similar = Vehicle.objects.filter(
                availability='available',
                vehicle_type=vehicle.vehicle_type,
            ).exclude(id=vehicle.id)[:4]
        serializer = VehicleListSerializer(similar, many=True, context={'request': request})
        return Response(serializer.data)


class SellRequestViewSet(viewsets.ModelViewSet):
    queryset = SellRequest.objects.all()
    serializer_class = SellRequestSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post', 'get']


class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']


class ContactViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']