from rest_framework import generics

from hadiths.fbapi import requires_permission, current_user_has_permission, get_auth_error_response, get_current_user, \
  user_has_permission


# TODO: Raise a clear exception if the fields get_perm_code, post_perm_code, etc., are not set.


class FBAuthListCreateAPIView(generics.ListCreateAPIView):
  def get(self, request, *args, **kwargs):
    if not current_user_has_permission(request, self.get_perm_code):
      return get_auth_error_response()
    return super(FBAuthListCreateAPIView, self).get(request, *args, **kwargs)

  def post(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if not user_has_permission(user, self.post_perm_code):
      return get_auth_error_response()
    request.data['added_by'] = user.fb_id
    request.data['updated_by'] = user.fb_id
    return super(FBAuthListCreateAPIView, self).post(request, *args, **kwargs)


class FBAuthRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
  def get(self, request, *args, **kwargs):
    if not current_user_has_permission(request, self.get_perm_code):
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).get(request, *args, **kwargs)

  def put(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if not user_has_permission(user, self.put_perm_code):
      return get_auth_error_response()
    request.data['updated_by'] = user.fb_id
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).put(request, *args, **kwargs)

  def patch(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if not user_has_permission(user, self.patch_perm_code):
      return get_auth_error_response()
    request.data['updated_by'] = user.fb_id
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).patch(request, *args, **kwargs)

  def delete(self, request, *args, **kwargs):
    user = get_current_user(request.query_params)
    if not user_has_permission(user, self.delete_perm_code):
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)

