from django.conf.urls import patterns, url

from hadiths import views
from hadiths import apiviews

urlpatterns = [
  url(r'^$', views.index, name='index'),
  # Converting to SPA, so removing those URLs.
  # url(r'^persons$', views.persons, name='persons'),
  # url(r'^hadith/(?P<hadith_id>\d+)$', views.hadith, name='hadith'),
  # url(r'^hadiths$', views.hadiths, name='hadiths'),
  # APIs
  url(r'^apis/books/$', apiviews.BookSetView.as_view()),
  url(r'^apis/books/(?P<id>[0-9]+)$', apiviews.BookView.as_view()),
  url(r'^apis/persons/$', apiviews.PersonSetView.as_view()),
  url(r'^apis/persons/(?P<id>[0-9]+)$', apiviews.PersonView.as_view()),
  url(r'^apis/hadithtags/$', apiviews.HadithTagSetView.as_view()),
  url(r'^apis/hadithtags/(?P<id>\w+)$', apiviews.HadithTagView.as_view()),
  url(r'^apis/hadiths/$', apiviews.HadithSetView.as_view()),
  url(r'^apis/hadiths/(?P<id>[0-9]+)$', apiviews.HadithView.as_view()),
  url(r'^apis/users/$', apiviews.UserSetView.as_view()),
  url(r'^apis/users/(?P<id>([0-9]+|current))$', apiviews.UserView.as_view()),
  url(r'^apis/permissions/$', apiviews.PermissionSetView.as_view()),
  url(r'^apis/permissions/(?P<id>([0-9]+|current))$', apiviews.PermissionView.as_view())
]
