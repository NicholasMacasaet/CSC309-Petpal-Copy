from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView, CreateAPIView
from notification.models import Notification, ApplicationNotification, CommentNotification, ApplicationCommentNotification
from notification.serializers import ApplicationNotificationSerializer, CommentNotificationSerializer, NotificationSerializer, ApplicationCommentNotificationSerializer
from pet.models import Application 
from comment.models import Comment, ApplicationComment
from django.core.exceptions import PermissionDenied, BadRequest
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters, pagination
from accounts.models import Shelter, Seeker
from django.urls import reverse

# Create your views here.

class CreateApplicationSubmittedNotificationView(CreateAPIView):
    """This endpoint creates a notifcation for a submitted application when a POST request is sent"""

    serializer_class = ApplicationNotificationSerializer


    def perform_create(self, serializer):
        application = get_object_or_404(Application, id=self.kwargs['application_id'])
        if application.seeker.user == self.request.user:
            user = application.pet.shelter.user
        else:
            user = application.seeker.user

        serializer.save(application=application, user=user, type='application')

class CreateCommentNotificationView(CreateAPIView):
    """This endpoint creates a notifcation when a POST Request is sent, given a comment_id"""
    serializer_class = CommentNotificationSerializer


    def perform_create(self, serializer):
        comment = get_object_or_404(Comment, id=self.kwargs['comment_id'])
        
        if comment.commenter_id != self.request.user:
            raise PermissionDenied("Notifications can only be sent for your own comments.")
        user = comment.shelter_id.user
        serializer.save(comment=comment, user=user, type='comment')

class CreateApplicationCommentNotificationView(CreateAPIView):
    """This Endpoint creates a notification when a POST Request is sent given comment_id signifying that a new application comment was created"""
    serializer_class = ApplicationCommentNotificationSerializer


    def perform_create(self, serializer):
        comment = get_object_or_404(ApplicationComment, id=self.kwargs['comment_id'])
        
        if comment.sender != self.request.user:
            raise PermissionDenied("Notifications can only be sent for your own comments.")
        if comment.sender == comment.application.seeker.user:
            user = comment.application.pet.shelter.user
        else:
            user = comment.application.seeker.user
        serializer.save(application_comment=comment, user=user, type='application_comment')

class UpdateDeleteRetrieveNotificationView(APIView):
    """This endpoint shows a notification on GET Request and when you make a request with GET, it marks the notifcation as read. It also deletes a notification on Delete Request"""
    def get(self, request, *args, **kwargs):
        notification = get_object_or_404(Notification, id=kwargs['pk'])
        if notification.user != request.user:
            raise PermissionDenied("You do not have access to this notification.")
        if notification.type == 'application':
            notification = get_object_or_404(ApplicationNotification, id=kwargs['pk'])
            url = "/application/" + str(notification.application.pk)
            open_chat = False
        elif notification.type == 'comment':
            notification = get_object_or_404(CommentNotification, id=kwargs['pk'])
            url = "/shelter/" + str(notification.comment.shelter_id.pk)
            open_chat = True
        else:
            notification = get_object_or_404(ApplicationCommentNotification, id=kwargs['pk'])
            url = "/application/" + str(notification.application_comment.application.pk)
            open_chat = True

        notification.read_status = True
        notification.save()
        return Response({"url": url, "open_chat": open_chat}, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        notification = get_object_or_404(Notification, id=kwargs['pk'])
        if notification.user != request.user:
            raise PermissionDenied("You do not have access to update this notification.")
        notification.delete()
        return Response({"detail", "notification deleted successfully"}, status=status.HTTP_200_OK)


class NotificationPagination(pagination.PageNumberPagination):
    page_size = 5

class NotificationFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'read_status' in request.query_params:
            queryset = queryset.filter(read_status=request.query_params['read_status'])
        return queryset
class ListNotificationView(ListAPIView):
    """This endpoint lists all notifcations on GET Request"""
    serializer_class = NotificationSerializer
    ordering_fields = ['timestamp']
    filterset_fields = ['read_status']
    ordering = ['-timestamp']
    filter_backends = [NotificationFilter, filters.OrderingFilter]
    pagination_class = NotificationPagination

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user)
        return queryset 