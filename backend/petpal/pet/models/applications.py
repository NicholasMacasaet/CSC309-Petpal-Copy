from django.db import models
from accounts.models import Seeker
from pet.models import Pet

# Create your models here.
class Application(models.Model):

    CONTACT_OPTIONS = [('email', 'Email'), ('phone', 'Phone')]
    STATUS_OPTIONS = [('accepted', 'accepted'), ('pending', 'pending'), ('denied', 'denied'), ('withdrawn', 'withdrawn')]

    seeker = models.ForeignKey(Seeker, on_delete=models.CASCADE, null=False, blank=False)
    preferred_contact = models.CharField(max_length=50, null=False, blank=False, choices=CONTACT_OPTIONS)
    description = models.CharField(max_length=600)
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, null=False, blank=False)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, null=False, blank=False, choices=STATUS_OPTIONS, default='pending')