from django.shortcuts import render
from rest_framework import generics, filters, pagination, status
from rest_framework.response import Response
from ..models import Pet, Application
from .. serializers import ApplicationSerializer
from rest_framework.generics import CreateAPIView, ListAPIView,ListCreateAPIView, RetrieveUpdateAPIView
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied, ValidationError

# Create your views here.

# Create
class ApplicationCreateView(CreateAPIView):
    """Creates an application for a given pet (pet_id) (must be a seeker)
    
    Send perferred_contact (email or phone) and description fields
    """
    serializer_class = ApplicationSerializer

    def perform_create(self, serializer):
        # check if seeker
        if not hasattr(self.request.user, 'seeker'):
            # TODO: raise different error??
            raise PermissionDenied('Only seekers can submit applications.')
        
        # check if application already submtitted
        seeker = self.request.user.seeker
        pet = get_object_or_404(Pet, id=self.kwargs['pet_id'])
        if Application.objects.filter(seeker=seeker, pet=pet).exists():
            raise ValidationError({'error': 'Application for this pet already submitted.'}, code=status.HTTP_400_BAD_REQUEST)

        # Can only create applications for a pet listing that is "available"
        pet_status = pet.status
        if pet_status == 'available':
            serializer.save(pet=pet, seeker=seeker)
        else:
            raise ValidationError({'error': 'Pet is not available for adoption.'}, code=status.HTTP_400_BAD_REQUEST)
        

class ApplicationPagination(pagination.PageNumberPagination):
    page_size = 2

# List 
class ApplicationListView(ListAPIView):
    """
    List all applications for current user (shelter)

    Sort can be done on "created_date", "modified_date" e.g. ordering=created_date

    Filter can be done on status e.g. status=accepted 
        
    Pagination of 5 pets per page, can be paged using page=1, page=2 ...
    """
    serializer_class = ApplicationSerializer
    pagination_class = ApplicationPagination

    def get_queryset(self):
        # Filter applications by status (2 marks)
        # STATUS_OPTIONS = [('A', 'accepted'), ('P', 'pending'), ('D', 'denied'), ('W', 'withdrawn')]
        # Sort application by creation time and last update time (4 marks)
        # When an application receives a new comment, its "last update time" should be changed.
        # Pagination support (1 mark)

        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            # pet__shelter to traverse from pet -> shelter
            query = Application.objects.filter(pet__shelter=shelter)

            # filter
            application_status = self.request.GET.get('status')
            if application_status:
                query = query.filter(status=application_status)

            pet = self.request.GET.get('pet')
            if pet:
                query = query.filter(pet=pet)

            # sort
            sort_by = self.request.GET.get('sort')
            print(sort_by)
            # default to modified date (most recent)
            if not sort_by:
                sort_by = '-modified_date'
            query = query.order_by(sort_by)

            return query
        elif hasattr(self.request.user, 'seeker'):
            curSeeker = self.request.user.seeker

            query = Application.objects.filter(seeker=curSeeker)
            
            # filter
            application_status = self.request.GET.get('status')
            if application_status:
                query = query.filter(status=application_status)

            # sort
            sort_by = self.request.GET.get('sort')
            print(sort_by)
            # default to modified date (most recent)
            if not sort_by:
                sort_by = '-modified_date'
            query = query.order_by(sort_by)

            return query
        else:
            raise PermissionDenied("Only shelters can view list of applications.")
        

class ApplicationRetrieveUpdateView(RetrieveUpdateAPIView):
    """Retrieves and updates an application

    retrieve (GET) gets the application (pk) for a specific pet for this user (usable by seeker or shelter involved in this application)

    update (PUT/PATCH) can only update the status of an application.
    """
    serializer_class = ApplicationSerializer

    def get_object(self):
        # TODO: permissions for who can view an application? -- only seeker / shelter involved?
        print(self.request.user)
        application = get_object_or_404(Application, id=self.kwargs['pk'])
        # check if seeker or shelter is authorized to view this application
        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            if application.pet.shelter != shelter:
                raise PermissionDenied('Unauthorized to view or edit this application.')
        elif hasattr(self.request.user, 'seeker'):
            seeker = self.request.user.seeker
            if application.seeker != seeker:
                raise PermissionDenied('Unauthorized to view or edit this application.')
        return get_object_or_404(Application, id=self.kwargs['pk'])
        

    # Details of an application cannot be updated once submitted/created, except for its status (see below).
    def perform_update(self, serializer):
        application = serializer.instance

        data = serializer.validated_data
        new_status = data.get('status')
        current_status = application.status

        # Shelter can only update the status of an application from pending to accepted or denied.
        if hasattr(self.request.user, 'shelter'):
            # shelter = self.request.user.shelter
            if current_status != 'pending' or (new_status != 'accepted' and new_status != 'denied'):
                raise ValidationError({'error': 'Invalid status update.'}, code=status.HTTP_400_BAD_REQUEST)
        # Pet seeker can only update the status of an application from pending or accepted to withdrawn.
        elif hasattr(self.request.user, 'seeker'):
            print(new_status)
            if (current_status != 'pending' and current_status != 'accepted') or new_status != 'withdrawn':
                raise ValidationError({'error': 'Invalid status update.'}, code=status.HTTP_400_BAD_REQUEST)

        # don't let users change description or contact method even if sent in request body
        serializer.save(description=application.description, preferred_contact=application.preferred_contact)

