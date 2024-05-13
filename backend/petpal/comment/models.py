from django.db import models
from accounts.models import Shelter, Seeker
from django.core.validators import MaxValueValidator, MinValueValidator
# from django.contrib.contenttypes.fields import GenericForeignKey
# from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from pet.models import Application

# assuming that the shelter model is already created in the accounts app
# Create your models here.


class Comment(models.Model):
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    # content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    # object_id = models.PositiveIntegerField()
    # commenter_id= GenericForeignKey('content_type', 'object_id')
    commenter_id = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(
        default=1,
        validators=[MaxValueValidator(5), MinValueValidator(1)],
        blank=False,
        null=False,
    )
    content = models.TextField(default="")
    date = models.DateTimeField(auto_now_add=True)
    reported = models.BooleanField(default=False)
    # def __str__(self):
    #     return f"{self.name}"

class ApplicationComment(models.Model):
    # techincally this is a message/chat
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    content = models.TextField(default="", blank=False, null=False)
    date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # if self.sender == self.application.seeker.user:
        #     raise PermissionDenied
        self.application.save()
        super().save(*args, **kwargs)



class ReportComment(models.Model):
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE)
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reporter")
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    reason= models.TextField(default="", blank=False, null=False)
