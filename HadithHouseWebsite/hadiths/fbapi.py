import json

from django.http.response import HttpResponse

import urlfetch

from hadiths.models import User

GRAPH_API_URL = 'https://graph.facebook.com'


def fb_get(path, access_token):
  url = '%(graph_url)s/%(path)s?access_token=%(access_token)s' % {
    'graph_url': GRAPH_API_URL,
    'path': path,
    'access_token': access_token
  }
  response = urlfetch.fetch(url, method='GET')
  result = json.loads(response.content.decode('utf-8'))
  if response.status_code != 200:
    raise Exception(result['error']['message'])
  return result


def get_fb_user_info(access_token):
  return fb_get('me', access_token)


def get_current_user(query_params):
  if 'fb_token' not in query_params:
    # No Facebook authentication params.
    return User.get_unregistered_user(None)
  fb_token = query_params['fb_token']
  if fb_token is None:
    # No Facebook authentication params.
    return User.get_unregistered_user(None)

  ret = get_fb_user_info(fb_token)
  fb_id = ret['id']

  # Retrieves the current user from the database.
  user = User.objects.get(fb_id=fb_id)
  if user is None:
    # User is not registered.
    user = User.get_unregistered_user(fb_id)

  return user

  # return {'fb_id': ret['id'],
  #         'name': ret['name'],
  #         'first_name': ret['first_name'],
  #         'middle_name': ret['middle_name'],
  #         'last_name': ret['last_name'],
  #         'gender': ret['gender'],
  #         'verified': ret['verified'],
  #         'has_read_perm': True,
  #         'has_write_perm': True,
  #         'has_delete_perm': False}


def get_auth_error_response():
  return HttpResponse("Couldn't authenticate user or user doesn't have permission for this action.", status=401)


def current_user_has_permission(request, permission):
  if permission is None:
    return True
  user = get_current_user(request.query_params)
  user_has_permission(user, permission)


def user_has_permission(user, permission):
  if permission is None:
    return True
  return user is not None and user.has_permission(permission)


def requires_permission(func, permission):
  """
  When this decorator is applied to a function, it adds the necessary code
  to ensure the user is logged in and has the required permission.
  :param func: The input function
  :return: The decorated function
  """

  def wrapper(self, request, *args, **kwargs):
    if not current_user_has_permission(permission):
      return get_auth_error_response()
    return func(self, request, *args, **kwargs)

  return wrapper
