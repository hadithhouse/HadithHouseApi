from django.conf.urls import patterns, include, url
#from django.contrib import admin

urlpatterns = patterns(
  '', # No prefix
  url(r'^', include('hadiths.urls'))
  #url(r'^admin/', include(admin.site.urls)),
)
