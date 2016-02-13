from rest_framework import generics
from django.http.response import HttpResponse


def get_auth_error_response():
  return HttpResponse("Couldn't authenticate user or user doesn't have permission for this action.", status=401)


class FBAuthListCreateAPIView(generics.ListCreateAPIView):
  def get(self, request, *args, **kwargs):
    if self.get_perm_code is not None and not request.user.has_perm(self.get_perm_code):
      return get_auth_error_response()
    # if not current_user_has_permission(request, self.get_perm_code):
    #   return get_auth_error_response()
    return super(FBAuthListCreateAPIView, self).get(request, *args, **kwargs)

  def post(self, request, *args, **kwargs):
    if self.post_perm_code is not None and not request.user.has_perm(self.post_perm_code):
      return get_auth_error_response()
    # request.data['added_by'] = self.user.id
    # request.data['updated_by'] = self.user.id
    return super(FBAuthListCreateAPIView, self).post(request, *args, **kwargs)


class FBAuthRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
  def get(self, request, *args, **kwargs):
    if self.post_perm_code is not None and not request.user.has_perm(self.get_perm_code):
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).get(request, *args, **kwargs)

  def put(self, request, *args, **kwargs):
    if self.put_perm_code is not None and not request.user.has_perm(self.put_perm_code):
      return get_auth_error_response()
    # request.data['updated_by'] = user.fb_id
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).put(request, *args, **kwargs)

  def patch(self, request, *args, **kwargs):
    if self.patch_perm_code is not None and not request.user.has_perm(self.patch_perm_code):
      return get_auth_error_response()
    # request.data['updated_by'] = user.fb_id
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).patch(request, *args, **kwargs)

  def delete(self, request, *args, **kwargs):
    if self.delete_perm_code is not None and not request.user.has_perm(self.delete_perm_code):
      return get_auth_error_response()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)
