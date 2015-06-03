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
          'has_write_perm': False,
          'has_delete_perm': False}

def get_auth_error_response():
  return HttpResponse("Couldn't authenticate user or user doesn't have permission for this action.", status=401)


class FBAuthListCreateAPIView(generics.ListCreateAPIView):
  def get(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if user is None or not user['has_read_perm']:
      return get_auth_error_response()
    return super(FBAuthListCreateAPIView, self).get(self, request, *args, **kwargs)

  def post(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if user is None or not user['has_write_perm']:
      return get_auth_error_response()
    return super(FBAuthListCreateAPIView, self).post(self, request, *args, **kwargs)


class FBAuthRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
  def get(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if user is None or not user['has_read_perm']:
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).get(self, request, *args, **kwargs)

  def put(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if user is None or not user['has_write_perm']:
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).put(self, request, *args, **kwargs)

  def patch(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if user is None or not user['has_write_perm']:
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).patch(self, request, *args, **kwargs)

  def delete(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if user is None or not user['has_delete_perm']:
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).delete(self, request, *args, **kwargs)

