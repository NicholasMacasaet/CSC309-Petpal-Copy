from django.db import models
from django.contrib.auth.models import User


class Seeker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200, null=False, blank=True)
    last_name = models.CharField(max_length=200, null=False, blank=True)
    email = models.EmailField()
    phone_number = models.CharField(max_length=10, null=False, blank=True)
    description = models.CharField(max_length=600, null=False, blank=True)
    address = models.CharField(max_length=200, null=False, blank=True)
    age = models.IntegerField(null=True, blank=True)
    profile_image = models.ImageField(
        upload_to="seeker_profile/", null=True, blank=True
    )

class Shelter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    shelter_name = models.CharField(max_length=128, null=False, blank=False)
    email = models.EmailField(blank=False, null=False)
    phone_number = models.CharField(max_length=10, null=False, blank=True)
    description = models.CharField(max_length=600, null=False, blank=False)
    address = models.CharField(max_length=200, null=False, blank=False)
    website = models.URLField(max_length=128, blank=True)
    rating = models.FloatField(null=False, blank=False, default=0)
    num_ratings = models.IntegerField(null=False, blank=False, default=0)
    shelter_image = models.ImageField(
        upload_to="shelter_profile/", null=True, blank=True
    )
