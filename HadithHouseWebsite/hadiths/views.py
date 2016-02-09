from django.http import HttpResponse
from django.template import RequestContext, loader
from HadithHouseWebsite.server_settings import get_fb_appid

def index(request):
  template = loader.get_template('hadiths/index.html')
  context = {
    'appId': get_fb_appid()
  }
  return HttpResponse(template.render(context))

