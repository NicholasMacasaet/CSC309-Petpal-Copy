from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField, CharField, Serializer

from notification.models import Notification, CommentNotification, ApplicationNotification, ApplicationCommentNotification


class NotificationSerializer(ModelSerializer):
    timestamp = DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    user = PrimaryKeyRelatedField(read_only=True)

    class Meta: 
        model = Notification
        fields = '__all__'

class CommentNotificationSerializer(NotificationSerializer):
    comment = PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = CommentNotification
        fields = '__all__'


class ApplicationCommentNotificationSerializer(NotificationSerializer):
    application_comment = PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = ApplicationCommentNotification
        fields = '__all__'

class ApplicationNotificationSerializer(NotificationSerializer):
    # application = HyperlinkedRelatedField(
    #     view_name='application-details',
    #     lookup_field='pk',
    #     read_only=True
    # )
    application = PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = ApplicationNotification
        fields = '__all__'