from django.urls import path
from .views import (
    SeekerListCreateView,
    SeekerRetrieveUpdateDestroyView,
    ShelterListCreateView,
    ShelterRetrieveUpdateDestroyView,
    GetUserView,
    CustomTokenObtainPairView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib.auth.models import User
from accounts.models import Shelter, Seeker
from accounts.serializers import SeekerSerializer, ShelterSerializer

urlpatterns = [
    path("seekers/", SeekerListCreateView.as_view(), name="seeker-list-create"),
    path(
        "seekers/<int:pk>/",
        SeekerRetrieveUpdateDestroyView.as_view(),
        name="seeker-retrieve-update-destroy",
    ),
    path("shelters/", ShelterListCreateView.as_view(), name="shelter-list-create"),
    path(
        "shelters/<int:pk>/",
        ShelterRetrieveUpdateDestroyView.as_view(),
        name="shelter-retrieve-update-destroy",
    ),
    path("user/<int:id>/", GetUserView.as_view(), name="get_user"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
