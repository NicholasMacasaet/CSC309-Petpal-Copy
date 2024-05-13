from rest_framework.serializers import ModelSerializer, DateTimeField, ListField, \
    PrimaryKeyRelatedField, HyperlinkedRelatedField, BooleanField

from comment.models import Comment, ApplicationComment, ReportComment

class CommentSerializer(ModelSerializer):
    date = DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    shelter_id = PrimaryKeyRelatedField(read_only=True)
    commenter_id = PrimaryKeyRelatedField(read_only=True)
    reported = BooleanField(read_only=True)
    # format checking for date
    class Meta:
        model = Comment
        fields = '__all__'
        # serialize the comment model as json

class ApplicationCommentSerializer(ModelSerializer):
    date = DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    application = PrimaryKeyRelatedField(read_only=True)
    sender = PrimaryKeyRelatedField(read_only=True)
    class Meta: 
        model = ApplicationComment
        fields = '__all__' 

class AdminCommentSerializer(CommentSerializer):
    pass




class ReportCommentSerializer(ModelSerializer):
    reported_user = PrimaryKeyRelatedField(read_only=True)
    reporter = PrimaryKeyRelatedField(read_only=True)
    comment = PrimaryKeyRelatedField(read_only=True)
    class Meta: 
        model = ReportComment
        fields = '__all__'
