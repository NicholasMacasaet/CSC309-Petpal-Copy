from django.shortcuts import render, get_object_or_404
from rest_framework.generics import ListCreateAPIView
from .models import Seeker, Shelter
from .serializers import (
    SeekerCreateSerializer,
    ShelterCreateSerializer,
    SeekerUpdateSerializer,
    ShelterUpdateSerializer,
    ShelterSerializer,
    UserSerializer,
)
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status, generics, pagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from pet.models import Application
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication
from accounts.models import Shelter, Seeker
from accounts.serializers import SeekerSerializer, ShelterSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.views import View
from django.http import JsonResponse


class CustomError(PermissionDenied):
    def __init__(self, detail):
        self.detail = detail 


class SeekerListCreateView(generics.ListCreateAPIView):
    """Creates a seeker on POST Request, does not show a list of seekers (for any user type right now)"""
    serializer_class = SeekerCreateSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        raise CustomError('You do not have permission to access a list of Seekers')


class SeekerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Endpoint to Update a seeker object on PATCH Request, delete a seeker object on DELETE Request, and retrieve a seeker object on GET Request.

"""
    serializer_class = SeekerUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cur_seeker = get_object_or_404(Seeker, id=self.kwargs["pk"])
        cur_user = get_object_or_404(User, id=self.request.user.id)
        if hasattr(cur_user, "shelter"):
            applications = Application.objects.filter(
                seeker_id=cur_seeker.id,
                pet__shelter_id=cur_user.shelter.id,
                status="accepted",
            )
            applications2 = Application.objects.filter(
                seeker_id=cur_seeker.id,
                pet__shelter_id=cur_user.shelter.id,
                status="pending",
            )
            if applications or applications2:
                return cur_seeker
        elif hasattr(cur_user, "seeker"):
            if cur_seeker.id == cur_user.seeker.id:
                return cur_seeker
        raise CustomError(
            "You do not have permission to access this Seeker Profile"
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.user.delete()

        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)

class ShelterPagination(pagination.PageNumberPagination):
    page_size = 5

class ShelterListCreateView(generics.ListCreateAPIView):
    """Creates a shelter on POST Request, lists all shelters on GET Request

"""
    pagination_class = ShelterPagination
    queryset = Shelter.objects.all()
    serializer_class = ShelterCreateSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ShelterSerializer
        else:
            return ShelterCreateSerializer


class ShelterRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ShelterUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Shelter, id=self.kwargs["pk"])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.user.delete()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if 'access' in response.data:
            user = User.objects.get(username=request.data['username'])
            done = False
            try: 
                seeker = Seeker.objects.get(user=user)
                data = SeekerSerializer(seeker).data
                if (data['profile_image'] is not None):
                    data['profile_image'] = request.build_absolute_uri(data['profile_image'])
                user_data = {
                    'type': 'seeker',
                    'seeker': data,
                }
                done = True
            except Seeker.DoesNotExist:
                pass
            try:
                shelter = Shelter.objects.get(user=user)
                data = ShelterSerializer(shelter).data
                if (data['shelter_image'] is not None):
                    data['shelter_image'] = request.build_absolute_uri(data['shelter_image'])

                user_data = {
                    'type': 'shelter',
                    'shelter': data,
                }
                done = True
            except Shelter.DoesNotExist:
                pass
            
            if not done and user.is_staff:
                user_data = {
                    'type': 'moderator',
                    'user': UserSerializer(user).data
                }

            response.data['user'] = user_data

        return response

class GetUserView(View):
    def get(self, request, *args, **kwargs):
        user_info = {}
        user = get_object_or_404(User, id=self.kwargs["id"])
        try: 
            seeker = Seeker.objects.get(user=user)
            seeker_data = SeekerSerializer(seeker).data
            user_info = {
                'name': seeker_data['first_name'] + ' ' + seeker_data['last_name'],
                'description': seeker_data['description'],
                'profile_image': seeker_data['profile_image'],
                'user': seeker_data['user'],
                'email': seeker_data['email'],
                'phone_number': seeker_data['phone_number'],
                'address': seeker_data['address'],
            }
        except Seeker.DoesNotExist:
            pass
        try:
            shelter = Shelter.objects.get(user=user)
            shelter_data = ShelterSerializer(shelter).data
            user_info = {
                'name': shelter_data['shelter_name'],
                'description': shelter_data['description'],
                'profile_image': shelter_data['shelter_image'],
                'user': shelter_data['user'],
                'email': shelter_data['email'],
                'phone_number': shelter_data['phone_number'],
                'address': shelter_data['address'],
            }
        except Shelter.DoesNotExist:
            pass

        return JsonResponse(user_info)