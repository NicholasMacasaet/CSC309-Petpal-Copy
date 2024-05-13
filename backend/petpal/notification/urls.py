from django.urls import path
from notification.views import CreateApplicationSubmittedNotificationView, UpdateDeleteRetrieveNotificationView, ListNotificationView, CreateApplicationCommentNotificationView, CreateCommentNotificationView

urlpatterns=[ 
    path('application/<int:application_id>/', CreateApplicationSubmittedNotificationView.as_view(), name='create-application-notification-submitted'),
    path('comment/<int:comment_id>/', CreateCommentNotificationView.as_view(), name='create-comment-notification'),
    path('application_comment/<int:comment_id>/', CreateApplicationCommentNotificationView.as_view(), name='create-application-comment-notification'),
    path('pet/<int:pet_id>/', CreateApplicationSubmittedNotificationView.as_view(), name='create-application-notification-submitted'),
    path('notification/<int:pk>/', UpdateDeleteRetrieveNotificationView.as_view(), name='update-delete-retrieve-notification'),
    path('notifications/', ListNotificationView.as_view(), name='list-notification')
]