from django.http import HttpResponse
from django.template import loader
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


def set_all_js_hash():
  # Find the MD5 hash of all.js. This is used in index.html for cache busting.
  # TODO: Perhaps consider saving it to file to avoid re-calculating it every time the
  # application is restarted?
  # https://github.com/hadithhouse/hadithhouse/issues/307
  global all_js_hash
  if all_js_hash is None and settings.get_environment() == 'production':
    all_js_hash = md5(finders.find('hadiths/js/all.js'))


def set_all_css_hash():
  # Find the MD5 hash of all.css. This is used in index.html for cache busting.
  # TODO: Perhaps consider saving it to file to avoid re-calculating it every time the
  # application is restarted?
  # https://github.com/hadithhouse/hadithhouse/issues/307
  global all_css_hash
  if all_css_hash is None and settings.get_environment() == 'production':
    all_css_hash = md5(finders.find('hadiths/css/all.css'))


def index(request, path):
  set_all_js_hash()
  set_all_css_hash()

  context = {
    'appId': get_fb_appid(),
    'offline_mode': settings.OFFLINE_MODE,
    'environment': settings.get_environment(),
    'all_js_hash': all_js_hash,
    'all_css_hash': all_css_hash,
  }

  template = loader.get_template('hadiths/index.html')
  return HttpResponse(template.render(context))
