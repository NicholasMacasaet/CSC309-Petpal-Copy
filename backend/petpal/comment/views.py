from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView, CreateAPIView, ListAPIView, DestroyAPIView
from rest_framework.permissions import IsAdminUser
from comment.models import Comment, ApplicationComment 
from comment.serializers import CommentSerializer, AdminCommentSerializer, ApplicationCommentSerializer, ReportCommentSerializer
from accounts.models import Shelter, Seeker
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import User
from rest_framework import permissions, pagination
from pet.models import Application
from rest_framework.exceptions import PermissionDenied
from comment.models import ReportComment


from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class CommentPagination(pagination.PageNumberPagination):
    page_size = 5

class IsNotShelter(permissions.BasePermission):
    message = "You do not have permission to comment on your own shelter"
    def has_object_permission(self, request, view, shelter):
        # comment = obj
        # print(shelter.user, request.user)
        return shelter.user != request.user

class ShelterCommentCreate(ListCreateAPIView):
    """This endpoint creates a shelter comment (or review) on POST Request given a shelter_id

"""
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsNotShelter]
    pagination_class = CommentPagination
    def get_queryset(self):
        return Comment.objects.filter(shelter_id=self.kwargs['shelter_id']).order_by('-date')
    # only get the comments for the specific shelter

    def perform_create(self, serializer):
        shelter = get_object_or_404(Shelter, pk=self.kwargs['shelter_id'])
        commenter = self.request.user
        # print(self.request.user.id, shelter.user_id)
        self.check_object_permissions(self.request, shelter)
        # im not sure why you need to explicitly check permissions here but it wont work without it
        new_comment = serializer.save(shelter_id=shelter, commenter_id=commenter)
        shelter.rating = (shelter.rating * shelter.num_ratings + new_comment.rating) / (shelter.num_ratings + 1)
        shelter.num_ratings += 1
        shelter.save()
        # set the shelter_id of the comment to the shelter object

class CantDoThisLmao(PermissionDenied):
    def __init__(self, detail):
        self.detail = detail 
        

class ApplicationCommentCreate(ListCreateAPIView):
    """Creates an Application Comment on POST Request, given application_id

"""
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination
    def get_queryset(self):
        application = get_object_or_404(Application, pk=self.kwargs['application_id'])
        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            if application.pet.shelter != shelter:
                raise CantDoThisLmao('You are not the shelter for this pet.')
        elif hasattr(self.request.user, 'seeker'):
            seeker = self.request.user.seeker
            if application.seeker != seeker:
                raise CantDoThisLmao('You are not the applicant for this pet')
        comments_set = ApplicationComment.objects.filter(application = self.kwargs['application_id']).order_by('-date')
        return comments_set
    #yes
    
    def perform_create(self, serializer):
        sender = get_object_or_404(User, pk=self.request.user.id)
        application = get_object_or_404(Application, pk=self.kwargs['application_id'])
        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            if application.pet.shelter != shelter:
                raise CantDoThisLmao('You are not the shelter for this pet.')
        elif hasattr(self.request.user, 'seeker'):
            seeker = self.request.user.seeker
            if application.seeker != seeker:
                raise CantDoThisLmao('You are not the applicant for this pet')
        serializer.save(sender=sender, application=application)
        # set the shelter_id of the comment to the shelter object

# review id 

class ReviewRetreive(RetrieveAPIView):
    """This Endpoint shows a Comment from a shelter on a GET Request given comment_id

"""
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return get_object_or_404(Comment, pk=self.kwargs['comment_id'])
    

class ApplicationCommentRetreive(RetrieveAPIView):
    """This Endpoint shows a Comment from an application on a GET Request given comment_id

"""
    serializer_class = ApplicationCommentSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        application_comment = get_object_or_404(ApplicationComment, pk=self.kwargs['comment_id'])
        application = get_object_or_404(Application, pk=application_comment.application.id)
        if hasattr(self.request.user, 'shelter'):
            shelter = self.request.user.shelter
            if application.pet.shelter != shelter:
                raise CantDoThisLmao('You are not the shelter for this pet.')
        elif hasattr(self.request.user, 'seeker'):
            seeker = self.request.user.seeker
            if application.seeker != seeker:
                raise CantDoThisLmao('You are not the applicant for this pet')
        return application_comment
    


class ReportCommentPagination(pagination.PageNumberPagination):
    page_size = 10



class ReportCommentCreate(CreateAPIView):
    """This Endpoint creates a Report Comment on a POST Request given comment_id

"""
    serializer_class = ReportCommentSerializer
    permission_classes = [IsAuthenticated]
    # anyone can create a report comment
    def perform_create(self, serializer):
        comment = get_object_or_404(Comment, pk=self.kwargs['comment_id'])
        reporter = self.request.user
        reported_user_id = comment.commenter_id.id
        
        reported_user = get_object_or_404(User, pk=reported_user_id)

        print("reported user",reporter)
        serializer.save(comment=comment, reporter=reporter, reported_user=reported_user)

class ReportCommentList(ListAPIView):
    """This Endpoint returns a list of all Report Comments on a GET Request

"""
    serializer_class = ReportCommentSerializer
    permission_classes = [IsAdminUser]
    pagination_class = ReportCommentPagination
    # only admins can see the report comment listed
    def get_queryset(self):
        return ReportComment.objects.filter()
    


class DissmissReportComment(DestroyAPIView):
    """This Endpoint deletes a Report Comment on a DELETE Request given report_id

"""

    serializer_class = ReportCommentSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        return get_object_or_404(ReportComment, pk=self.kwargs['report_id'])



class DeleteReportComment(DestroyAPIView):
    """This Endpoint deletes a Report Comment on a DELETE Request given report_id

    and also any other ReportCommetns that have the same comment_id, then sets the comment to reported
    """
    serializer_class = ReportCommentSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        return get_object_or_404(ReportComment, pk=self.kwargs['report_id'])
    

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
    
        report_comment_comment_id = instance.comment.id
        instance.delete()
        ReportComment.objects.filter(comment_id=report_comment_comment_id).delete()


        comment = get_object_or_404(Comment, pk=report_comment_comment_id)
        comment.reported= True
        comment.save()
        return Response(status=status.HTTP_204_NO_CONTENT)