from django.http.response import HttpResponse
from rest_framework import generics

from hadiths import fbapi


class FBAuthException(Exception):
  pass


def get_current_user(query_params):
  if 'fb_token' not in query_params:
    return None
  fb_token = query_params['fb_token']
  if fb_token is None:
    return None
  ret = fbapi.get_user_info(fb_token)
  return {'fb_id': ret['id'],
          'name': ret['name'],
          'first_name': ret['first_name'],
          'middle_name': ret['middle_name'],
          'last_name': ret['last_name'],
          'gender': ret['gender'],
          'verified': ret['verified'],
          'has_read_perm': True,
          'has_write_perm': True,
          'has_delete_perm': False}

def get_auth_error_response():
  return HttpResponse("Couldn't authenticate user or user doesn't have permission for this action.", status=401)

def requires_read_perm(func):
  """
  When this decorator is applied to a function, it adds the necessary code
  to ensure the user is logged in and has read permission.
  :param func: The input function
  :return: The decorated function
  """
  def wrapper(self, request, *args, **kwargs):
    # TODO: Read permission is given to all.
    #user = get_current_user(request.query_params)
    #if user is None or not user['has_read_perm']:
    #  return get_auth_error_response()
    return func(self, request, *args, **kwargs)
  return wrapper

def requires_write_perm(func):
  """
  When this decorator is applied to a function, it adds the necessary code
  to ensure the user is logged in and has write permission.
  :param func: The input function
  :return: The decorated function
  """
  def wrapper(self, request, *args, **kwargs):
    # FIXME: Temporarily allow write permissions to all.
    #user = get_current_user(request.query_params)
    #if user is None or not user['has_write_perm']:
    #  return get_auth_error_response()
    return func(self, request, *args, **kwargs)
  return wrapper


class FBAuthListCreateAPIView(generics.ListCreateAPIView):
  @requires_read_perm
  def get(self, request, *args, **kwargs):
    return super(FBAuthListCreateAPIView, self).get(request, *args, **kwargs)

  @requires_write_perm
  def post(self, request, *args, **kwargs):
    return super(FBAuthListCreateAPIView, self).post(request, *args, **kwargs)


class FBAuthRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
  @requires_read_perm
  def get(self, request, *args, **kwargs):
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).get(request, *args, **kwargs)

  @requires_write_perm
  def put(self, request, *args, **kwargs):
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).put(request, *args, **kwargs)

  @requires_write_perm
  def patch(self, request, *args, **kwargs):
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).patch(request, *args, **kwargs)

  @requires_write_perm
  def delete(self, request, *args, **kwargs):
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)

