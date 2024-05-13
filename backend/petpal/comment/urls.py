from django.urls import path
from comment import views

urlpatterns=[
    path('review/<int:shelter_id>/', views.ShelterCommentCreate.as_view(), name='comment_create'),
    path('application/<int:application_id>/', views.ApplicationCommentCreate.as_view(), name='application_comment_create'),

    path('specific_review/<int:comment_id>/', views.ReviewRetreive.as_view(), name='specific-comment'),
    path('specific_application/<int:comment_id>/', views.ApplicationCommentRetreive.as_view(), name='specific-application-comment'),

    path('report/<int:comment_id>/', views.ReportCommentCreate.as_view(), name='report_comment_create'),
    path('report/all/', views.ReportCommentList.as_view(), name='report_comment_list'),
    path('report/dissmissed_report/<int:report_id>/', views.DissmissReportComment.as_view(), name='report_comment_dismiss'),
    path('report/deleted_report/<int:report_id>/', views.DeleteReportComment.as_view(), name='report_comment_delete'),
]