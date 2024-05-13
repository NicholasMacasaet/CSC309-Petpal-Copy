from django.urls import path
from .views.pets import CreatePetView, UpdateDeleteRetrievePetView, SearchPetsView
from .views import ApplicationCreateView, ApplicationListView, ApplicationRetrieveUpdateView

urlpatterns=[
    # pets
    path('pet/', CreatePetView.as_view(), name='create-pet'),
    path('pet/<int:pk>/', UpdateDeleteRetrievePetView.as_view(), name='pet-details'),
    path('pets/', SearchPetsView.as_view(), name='search-pets'),
    # applications
    path('<int:pet_id>/applications/', ApplicationCreateView.as_view(), name='create-application'),
    path('applications/', ApplicationListView.as_view(), name='all-applications'),
    path('application/<int:pk>/', ApplicationRetrieveUpdateView.as_view(), name='application-details'),
]