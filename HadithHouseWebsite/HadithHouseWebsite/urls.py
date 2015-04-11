from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^$', 'HadithHouseWebsite.views.index', name='index'),
    url(r'^admin/', include(admin.site.urls)),
)
