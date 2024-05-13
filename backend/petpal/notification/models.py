from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from pet.models import Application
from comment.models import Comment, ApplicationComment

class Notification(models.Model):
    TYPE_CHOICES = [('comment', 'comment'), ('application', 'application'), ('application_comment', 'application_comment')]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    content = models.CharField(max_length=500, null=False, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    read_status = models.BooleanField(default=False)
    type = models.CharField(max_length=30, null=False, blank=False, default='application', choices=TYPE_CHOICES)

# shelter: message from seeker or comment on shelter, seeker: message from shelter
class CommentNotification(Notification):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='comment_notifications')

class ApplicationCommentNotification(Notification):
    application_comment = models.ForeignKey(ApplicationComment, on_delete=models.CASCADE, related_name='application_comment_notifications')

# shelter: application submitted, seeker: application status update
class ApplicationNotification(Notification):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='application_notifications')