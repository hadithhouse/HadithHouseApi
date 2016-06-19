from django.http import HttpResponse
from django.template import RequestContext, loader

from HadithHouseWebsite import settings
from HadithHouseWebsite.server_settings import get_fb_appid

def index(request):
  if settings.OFFLINE_MODE:
    template = loader.get_template('hadiths/index_offline.html')
  else:
    template = loader.get_template('hadiths/index.html')
  context = {
    'appId': get_fb_appid(),
    'environment': settings.get_environment()
  }
  return HttpResponse(template.render(context))

