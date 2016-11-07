from django.contrib.auth.models import User
from rest_framework.authentication import BaseAuthentication

from hadiths import fbapi
from hadiths.models import FbUser


class FacebookAuthentication(BaseAuthentication):
  """
  Authenticate requests having Facebook authentication token.
  """
  def authenticate(self, request):
    if request.method == 'GET' and request.path != '/apis/users/current':
      # We don't authenticate GET requsets since our data are open to everyone.
      # An exception to that is when we need to get the current user.
      return None
    if 'fb_token' not in request.query_params:
      return None
    fb_token = request.query_params['fb_token']
    fb_user_info = fbapi.get_current_user(fb_token)
    if fb_user_info is None:
      return None
    fb_id = fb_user_info['id']

    try:
      fb_user = FbUser.objects.get(fb_id=fb_id)
    except FbUser.DoesNotExist:
      raise None

    return fb_user.user, None


class FacebookOfflineAuthentication(BaseAuthentication):
  """
  Like FacebookAuthentication, but can be used when the developer doesn't have
  an internet connection. Obviously, it is fixed to return a certain user.
  """
  def authenticate(self, request):
    if request.method == 'GET' and request.path != '/apis/users/current':
      # We don't authenticate GET requsets since our data are open to everyone.
      # An exception to that is when we need to get the current user.
      return None
    if 'fb_token' not in request.query_params:
      return None
    return (User.objects.first(), None)

