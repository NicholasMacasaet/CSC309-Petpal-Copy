from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, DateTimeField
from ..models.pets import Pet

class PetSerializer(ModelSerializer):
    shelter = PrimaryKeyRelatedField(read_only=True)
    listed = DateTimeField(read_only=True)
    class Meta:
        model = Pet
        fields = '__all__'