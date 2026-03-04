from django.db import models
from django.utils.text import slugify
import uuid


class Brand(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class VehicleModel(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)
    slug = models.SlugField()

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.brand.name}-{self.name}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.brand.name} {self.name}"

    class Meta:
        unique_together = ['brand', 'name']
        ordering = ['name']


class Vehicle(models.Model):
    CONDITION_CHOICES = [
        ('kenyan_used', 'Kenyan Used'),
        ('foreign_used', 'Foreign Used'),
        ('new', 'New'),
    ]
    FUEL_CHOICES = [
        ('petrol', 'Petrol'),
        ('diesel', 'Diesel'),
        ('hybrid', 'Hybrid'),
        ('electric', 'Electric'),
    ]
    TRANSMISSION_CHOICES = [
        ('automatic', 'Automatic'),
        ('manual', 'Manual'),
    ]
    DRIVE_CHOICES = [
        ('2wd', '2WD'),
        ('4wd', '4WD'),
        ('awd', 'AWD'),
    ]
    CURRENCY_CHOICES = [
        ('KES', 'KES'),
        ('USD', 'USD'),
        ('EUR', 'EUR'),
    ]
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('reserved', 'Reserved'),
    ]
    LISTING_TYPE_CHOICES = [
        ('private_seller', 'Private Seller'),
        ('direct_import', 'Direct Import'),
    ]
    VEHICLE_TYPE_CHOICES = [
        ('car', 'Car'),
        ('motorcycle', 'Motorcycle'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True, max_length=200)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES, default='car')
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name='vehicles')
    model = models.ForeignKey(VehicleModel, on_delete=models.PROTECT, related_name='vehicles')
    year = models.PositiveIntegerField()
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    listing_type = models.CharField(max_length=20, choices=LISTING_TYPE_CHOICES, default='private_seller')

    # Specs
    engine_size = models.PositiveIntegerField(help_text='Engine size in CC', blank=True, null=True)
    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES, blank=True)
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES, default='automatic')
    drive = models.CharField(max_length=10, choices=DRIVE_CHOICES, blank=True)
    mileage = models.PositiveIntegerField(help_text='Mileage in km', blank=True, null=True)
    horse_power = models.PositiveIntegerField(blank=True, null=True)
    torque = models.PositiveIntegerField(help_text='Torque in Nm', blank=True, null=True)
    acceleration = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True, help_text='0-100 kph in seconds')
    color = models.CharField(max_length=50, blank=True)

    # Pricing
    price = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=5, choices=CURRENCY_CHOICES, default='KES')

    # Description
    title = models.CharField(max_length=200)
    description = models.TextField()
    features = models.TextField(blank=True, help_text='Comma-separated features')

    # Meta
    location = models.CharField(max_length=100, default='Nairobi, Kenya')
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='available')
    condition_score = models.PositiveIntegerField(default=5, help_text='Score out of 5')
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.brand.name}-{self.model.name}-{self.year}")
            slug = base_slug
            n = 1
            while Vehicle.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.year} {self.brand.name} {self.model.name}"

    class Meta:
        ordering = ['-created_at']


class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='vehicles/')
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class SellRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('contacted', 'Contacted'),
        ('listed', 'Listed'),
        ('sold', 'Sold'),
        ('rejected', 'Rejected'),
    ]

    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    mileage = models.PositiveIntegerField()
    condition = models.CharField(max_length=50)
    asking_price = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=5, default='KES')
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.year} {self.brand} {self.model}"


class Enquiry(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='enquiries')
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} enquiry on {self.vehicle}"

    class Meta:
        ordering = ['-created_at']


class FAQ(models.Model):
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.question

    class Meta:
        ordering = ['order']


class ContactMessage(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} - {self.subject}"

    class Meta:
        ordering = ['-created_at']