from rest_framework import generics, filters, pagination
from ..models.pets import Pet
from ..serializers.pets import PetSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Case, Value, When
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny

class CreatePetView(generics.CreateAPIView):
    """Takes information on a new pet to be listed as "available" under the current user who must be a shelter. 
    Creates and returns the listing that was creted for this pet. 
    """
    serializer_class = PetSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'shelter'):
            raise PermissionDenied('Must be a shelter to list a pet.')
        serializer.save(status="available", shelter=user.shelter)
    
class UpdateDeleteRetrievePetView(generics.RetrieveUpdateDestroyAPIView):
    """Updates (PUT/PATCH), deletes (DELETE), and retrieves (GET) a pet listing. 

    Update takes in a new pet to overwrite the corresponding fields of pet that the current user (a shelter) owns.

    Delete removes the pet listing, must be the owner of this pet (a shelter). 

    Get retrieves the listing and returns the pet's information.
    """
    serializer_class = PetSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        pet = get_object_or_404(Pet, id=self.kwargs['pk'])
        if self.request.method != "GET" and ((not hasattr(self.request.user, 'shelter') or pet.shelter != self.request.user.shelter)): 
            raise PermissionDenied('Unauthorized access to pet.')
        else:
            return pet

class SearchPetsPagination(pagination.PageNumberPagination):
    page_size = 5

class SizeOrderingFilter(filters.OrderingFilter):
    size_order = Case(
        When(size="small", then=Value(1)),
        When(size="medium", then=Value(2)),
        When(size="large", then=Value(3)),
    )

    ordering_mapping = {
        'size': size_order,
        '-size': size_order.desc(),
        'name': 'name',
        '-name': '-name',
        'birthday': 'birthday',
        '-birthday': '-birthday',
        'listed': 'listed',
        '-listed': '-listed',
    }
    
    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)

        for field in ordering:
            if field in self.ordering_mapping:
                queryset = queryset.order_by(self.ordering_mapping[field])

        return queryset
    

class PetFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'shelter' in request.query_params:
            queryset = queryset.filter(shelter__in=request.query_params['shelter'].split(','))
        if 'status' in request.query_params:
            queryset = queryset.filter(status__in=request.query_params['status'].split(','))
        if 'animal' in request.query_params:
            queryset = queryset.filter(animal__in=request.query_params['animal'].split(','))
        if 'size' in request.query_params:
            queryset = queryset.filter(size__in=request.query_params['size'].split(','))
        if 'color' in request.query_params:
            queryset = queryset.filter(color__in=request.query_params['color'].split(','))
        if 'gender' in request.query_params:
            queryset = queryset.filter(gender__in=request.query_params['gender'].split(','))
        return queryset

class SearchPetsView(generics.ListAPIView):
    """Search for all pets.

    By default shows only "available" pets if a "status" filter is not provided. 
    
    Search parameter searches "name" and "animal" fields. e.g. search=charlie

    Ordering can be done on "size", "listed", or "name" e.g. ordering=size

    Filtering can be done on "shelter", "seeker", "breed", "size", "color", or "gender". e.g. color=red

    Pagination of 10 pets per page, can be paged using page=1, page=2 ...
    """
    serializer_class = PetSerializer
    search_fields = ['name', 'animal']
    ordering_fields = ['name', 'size', 'listed']
    filterset_fields = ['shelter', 'status', 'breed', 'size', 'color', 'gender']
    ordering = ['-listed']
    filter_backends = [PetFilter, filters.SearchFilter, SizeOrderingFilter]
    pagination_class = SearchPetsPagination
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Pet.objects.all()
        if 'status' not in self.request.query_params:
            queryset = queryset.filter(status='available')
        return queryset 