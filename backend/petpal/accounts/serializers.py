from rest_framework.serializers import ModelSerializer
from .models import Seeker, Shelter
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "is_staff"]

class SeekerSerializer(ModelSerializer):
    class Meta:
        model = Seeker
        fields = "__all__"


class ShelterSerializer(ModelSerializer):
    class Meta:
        model = Shelter
        fields = [
            "shelter_name",
            "email",
            "phone_number",
            "description",
            "address",
            "website",
            "shelter_image",
            "id",
            "user",
        ]


class SeekerCreateSerializer(ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    confirm_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    class Meta:
        model = Seeker
        fields = [
            "username",
            "password",
            "confirm_password",
            "email",
            "phone_number",
            "address",
        ]

    def validate(self, data):
        # Validate that passwords match
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError("Username is already taken.")

        try:
            validate_email(data["email"])
        except ValidationError:
            raise serializers.ValidationError("Invalid email address.")
        try:
            validate_password(data["password"], self.instance)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)

        return data

    def create(self, validated_data):
        user_data = {
            "username": validated_data.pop("username"),
            "password": validated_data.pop("password"),
        }
        validated_data.pop("confirm_password", None)

        # Create a new user
        user = User.objects.create_user(**user_data)

        seeker = Seeker.objects.create(user=user, **validated_data)

        return seeker


class SeekerUpdateSerializer(ModelSerializer):
    class Meta:
        model = Seeker
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "description",
            "address",
            "age",
            "profile_image",
        ]


class ShelterUpdateSerializer(ModelSerializer):
    class Meta:
        model = Shelter
        fields = [
            "shelter_name",
            "email",
            "phone_number",
            "description",
            "address",
            "website",
            "shelter_image",
            "id",
            "num_ratings",
            "rating",
        ]


class ShelterCreateSerializer(ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})
    confirm_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}
    )

    class Meta:
        model = Shelter
        fields = [
            "username",
            "password",
            "confirm_password",
            "shelter_name",
            "email",
            "phone_number",
            "address",
        ]

    def validate(self, data):
        # Validate that passwords match
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError("Username is already taken.")

        try:
            validate_email(data["email"])
        except ValidationError:
            raise serializers.ValidationError("Invalid email address.")
        try:
            validate_password(data["password"], self.instance)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)

        return data

    def create(self, validated_data):
        user_data = {
            "username": validated_data.pop("username"),
            "password": validated_data.pop("password"),
        }
        validated_data.pop("confirm_password", None)
        # Create a new user
        user = User.objects.create_user(**user_data)

        shelter = Shelter.objects.create(user=user, **validated_data)

        return shelter
