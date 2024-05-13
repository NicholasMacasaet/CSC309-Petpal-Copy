from django.db import models
from accounts.models import Shelter


class Pet(models.Model):
    GENDER_OPTIONS = [("male", "male"), ("female", "female"), ("other", "other")]
    STATUS_OPTIONS = [
        ("available", "available"),
        ("withdrawn", "withdrawn"),
        ("adopted", "adopted"),
    ]
    SIZE_OPTIONS = [("small", "small"), ("medium", "medium"), ("large", "large")]

    shelter = models.ForeignKey(Shelter, related_name="pets", on_delete=models.CASCADE)
    # shelter = models.CharField(max_length=200, blank=False, null=False)
    animal = models.CharField(max_length=200, blank=False, null=False)
    breed = models.CharField(max_length=200, blank=True, null=True)
    name = models.CharField(max_length=200, blank=False, null=False)
    vaccine_status = models.CharField(max_length=200, null=True, blank=True)
    caretaker = models.CharField(max_length=200, null=True, blank=True)
    description = models.CharField(max_length=600, null=False, blank=False)
    allow_notifs = models.BooleanField(default=True)
    birthday = models.DateField(null=True, blank=True)
    listed = models.DateTimeField(auto_now_add=True)
    size = models.CharField(
        max_length=50, null=False, blank=False, choices=SIZE_OPTIONS
    )
    gender = models.CharField(
        max_length=10, null=False, blank=False, choices=GENDER_OPTIONS
    )
    color = models.CharField(max_length=50, null=False, blank=False)
    status = models.CharField(
        max_length=10, null=False, blank=False, choices=STATUS_OPTIONS, default="listed"
    )
    profile_image = models.ImageField(upload_to="pet_profile/", null=True, blank=True)
