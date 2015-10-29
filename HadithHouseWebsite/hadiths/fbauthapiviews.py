from rest_framework import generics

from hadiths.fbapi import requires_permission, current_user_has_permission, get_auth_error_response


# TODO: Raise a clear exception if the fields get_permission, post_permission, etc., are not set.

class FBAuthListCreateAPIView(generics.ListCreateAPIView):
  def get(self, request, *args, **kwargs):
    if not current_user_has_permission(request, self.get_permission):
      return get_auth_error_response()
    return super(FBAuthListCreateAPIView, self).get(request, *args, **kwargs)

  def post(self, request, *args, **kwargs):
    if not current_user_has_permission(request, self.post_permission):
      return get_auth_error_response()
    return super(FBAuthListCreateAPIView, self).post(request, *args, **kwargs)


class FBAuthRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
  def get(self, request, *args, **kwargs):
    if not current_user_has_permission(request, self.get_permission):
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).get(request, *args, **kwargs)

  def put(self, request, *args, **kwargs):
    if not current_user_has_permission(request, self.put_permission):
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).put(request, *args, **kwargs)

  def patch(self, request, *args, **kwargs):
    if not current_user_has_permission(request, self.patch_permission):
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).patch(request, *args, **kwargs)

  def delete(self, request, *args, **kwargs):
    if not current_user_has_permission(request, self.delete_permission):
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)


