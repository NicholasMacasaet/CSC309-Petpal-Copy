from django.contrib import admin
from .models import Notification, CommentNotification, ApplicationNotification, ApplicationCommentNotification
# Register your models here.
admin.site.register(Notification)
admin.site.register(CommentNotification)
admin.site.register(ApplicationNotification)
admin.site.register(ApplicationCommentNotification)