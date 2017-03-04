from django.http import HttpResponse
from django.template import RequestContext, loader
from django.contrib.staticfiles import finders
import hashlib

from HadithHouseWebsite import settings
from HadithHouseWebsite.server_settings import get_fb_appid

all_js_hash = None
all_css_hash = None


def md5(file_name):
  """
  Find the MD5 hash of the given file.
  Taken from: http://stackoverflow.com/questions/3431825/generating-an-md5-checksum-of-a-file

  :param file_name: The name of the file
  :return: The MD5 hash
  """
  hash_md5 = hashlib.md5()
  with open(file_name, "rb") as f:
    for chunk in iter(lambda: f.read(4096), b""):
      hash_md5.update(chunk)
  return hash_md5.hexdigest()


def index(request, path):
  if settings.OFFLINE_MODE:
    template = loader.get_template('hadiths/index_offline.html')
  else:
    template = loader.get_template('hadiths/index.html')

  # Find the MD5 hash of all.js. This is used in index.html for cache busting.
  # TODO: Perhaps consider saving it to file to avoid re-calculating it every time the
  # application is restarted?
  # https://github.com/hadithhouse/hadithhouse/issues/307
  global all_js_hash
  if all_js_hash is None:
    all_js_hash = md5(finders.find('hadiths/js/all.js'))

  # Find the MD5 hash of all.css. This is used in index.html for cache busting.
  # TODO: Perhaps consider saving it to file to avoid re-calculating it every time the
  # application is restarted?
  # https://github.com/hadithhouse/hadithhouse/issues/307
  global all_css_hash
  if all_css_hash is None:
    all_css_hash = md5(finders.find('hadiths/css/all.css'))

  context = {
    'appId': get_fb_appid(),
    'environment': settings.get_environment(),
    'all_js_hash': all_js_hash,
    'all_css_hash': all_css_hash,
  }
  return HttpResponse(template.render(context))
