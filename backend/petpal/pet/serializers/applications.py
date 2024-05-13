from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, DateTimeField
from ..models import Application

class ApplicationSerializer(ModelSerializer):
    seeker = PrimaryKeyRelatedField(read_only=True)
    pet = PrimaryKeyRelatedField(read_only=True)
    created_date = DateTimeField(read_only=True)
    modified_date = DateTimeField(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'