from django.contrib.auth.models import AnonymousUser
from rest_framework import generics
from rest_framework.exceptions import NotAuthenticated, PermissionDenied


def raise_auth_error():
  raise NotAuthenticated("Couldn't authenticate user.")


def raise_permission_error():
  raise PermissionDenied("User doesn't have permission for this action.")


class FBAuthListCreateAPIView(generics.ListCreateAPIView):
  def get(self, request, *args, **kwargs):
    return super(FBAuthListCreateAPIView, self).get(request, *args, **kwargs)

  def post(self, request, *args, **kwargs):
    if self.post_perm_code is not None and (request.user is None or isinstance(request.user, AnonymousUser)):
      raise_auth_error()
    if self.post_perm_code is not None and not request.user.has_perm(self.post_perm_code):
      raise_permission_error()
    return super(FBAuthListCreateAPIView, self).post(request, *args, **kwargs)


class FBAuthRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
  def get(self, request, *args, **kwargs):
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).get(request, *args, **kwargs)

  def post(self, request, *args, **kwargs):
    if self.post_perm_code is not None and (request.user is None or isinstance(request.user, AnonymousUser)):
      raise_auth_error()
    if self.post_perm_code is not None and not request.user.has_perm(self.post_perm_code):
      raise_permission_error()
    return self.put(request, *args, **kwargs)

  def put(self, request, *args, **kwargs):
    if self.put_perm_code is not None and (request.user is None or isinstance(request.user, AnonymousUser)):
      raise_auth_error()
    if self.put_perm_code is not None and not request.user.has_perm(self.put_perm_code):
      raise_permission_error()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).put(request, *args, **kwargs)

  def patch(self, request, *args, **kwargs):
    if self.patch_perm_code is not None and (request.user is None or isinstance(request.user, AnonymousUser)):
      raise_auth_error()
    if self.patch_perm_code is not None and not request.user.has_perm(self.patch_perm_code):
      raise_permission_error()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).patch(request, *args, **kwargs)

  def delete(self, request, *args, **kwargs):
    if self.delete_perm_code is not None and (request.user is None or isinstance(request.user, AnonymousUser)):
      raise_auth_error()
    if self.delete_perm_code is not None and not request.user.has_perm(self.delete_perm_code):
      raise_permission_error()
    return super(FBAuthRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)
