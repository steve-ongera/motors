from rest_framework import serializers
from .models import Brand, VehicleModel, Vehicle, VehicleImage, SellRequest, Enquiry, FAQ, ContactMessage


class BrandSerializer(serializers.ModelSerializer):
    vehicle_count = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'vehicle_count']

    def get_vehicle_count(self, obj):
        return obj.vehicles.filter(availability='available').count()


class VehicleModelSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)

    class Meta:
        model = VehicleModel
        fields = ['id', 'name', 'slug', 'brand', 'brand_name']


class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['id', 'image', 'is_primary', 'order']


class VehicleListSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    model_name = serializers.CharField(source='model.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'slug', 'vehicle_type', 'brand_name', 'model_name', 'year',
            'condition', 'condition_display', 'listing_type', 'engine_size',
            'transmission', 'price', 'currency', 'title', 'description',
            'availability', 'condition_score', 'is_featured', 'primary_image',
            'location', 'created_at',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(img.image.url)
        return None


class VehicleDetailSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    model_name = serializers.CharField(source='model.name', read_only=True)
    images = VehicleImageSerializer(many=True, read_only=True)
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    fuel_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    features_list = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = [
            'id', 'slug', 'vehicle_type', 'brand_name', 'model_name', 'year',
            'condition', 'condition_display', 'listing_type', 'engine_size',
            'fuel_type', 'fuel_display', 'transmission', 'drive', 'mileage',
            'horse_power', 'torque', 'acceleration', 'color', 'price', 'currency',
            'title', 'description', 'features', 'features_list', 'location',
            'availability', 'condition_score', 'is_featured', 'views_count',
            'images', 'created_at', 'updated_at',
        ]

    def get_features_list(self, obj):
        if obj.features:
            return [f.strip() for f in obj.features.split(',') if f.strip()]
        return []


class SellRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellRequest
        fields = [
            'id', 'full_name', 'email', 'phone', 'brand', 'model', 'year',
            'mileage', 'condition', 'asking_price', 'currency', 'description',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = ['id', 'vehicle', 'full_name', 'email', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'order']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'full_name', 'email', 'phone', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']