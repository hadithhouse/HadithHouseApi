from django.conf.urls import patterns, url

from hadiths import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^persons$', views.persons, name='persons'),
    url(r'^hadith/(?P<hadith_id>\d+)$', views.hadith, name='hadith'),
    url(r'^hadiths$', views.hadiths, name='hadiths'),
)
