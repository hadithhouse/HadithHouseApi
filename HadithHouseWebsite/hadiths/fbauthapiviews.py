"""
Contain API views that facilitate dealing with Facebook authentication.
"""

from django.contrib.auth.models import AnonymousUser
from rest_framework import generics
from rest_framework.exceptions import NotAuthenticated, PermissionDenied


class APIViewPermissionMixin:
    """
    A mixin for API views that provides a method for verifying permissions
    on different request types on the API view.
    """

    @staticmethod
    def raise_auth_error() -> None:
        """
        Raise an exception that indicates the user couldn't be authenticated.
        """
        raise NotAuthenticated("Couldn't authenticate user.")

    @staticmethod
    def raise_permission_error() -> None:
        """
        Raise an exception that indicates the user doesn't have permission for
        the requested operation.
        """
        raise PermissionDenied("User doesn't have permission for this action.")

    def verify_permission(self, user, request_type):
        """
        Checks whether a user has the permission to perform a request of
        certain type on this API view.

        :param user: The user.
        :param request_type: The type of the request: post, put, etc.
        """
        perm_code = getattr(self, request_type.lower() + '_perm_code')
        if perm_code is not None:
            if user is None or isinstance(user, AnonymousUser):
                self.raise_auth_error()
            if not user.has_perm(perm_code):
                self.raise_permission_error()


class FBAuthListCreateAPIView(generics.ListCreateAPIView,
                              APIViewPermissionMixin):
    def get(self, request, *args, **kwargs):
        self.verify_permission(request.user, 'get')
        return super(FBAuthListCreateAPIView, self).get(
            request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.verify_permission(request.user, 'post')
        return super(FBAuthListCreateAPIView, self).post(
            request, *args, **kwargs)


class FBAuthRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView,
                                         APIViewPermissionMixin):
    def get(self, request, *args, **kwargs):
        self.verify_permission(request.user, 'get')
        return super(FBAuthRetrieveUpdateDestroyAPIView, self).get(
            request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.verify_permission(request.user, 'post')
        return self.put(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        self.verify_permission(request.user, 'put')
        return super(FBAuthRetrieveUpdateDestroyAPIView, self).put(
            request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        self.verify_permission(request.user, 'patch')
        return super(FBAuthRetrieveUpdateDestroyAPIView, self).patch(
            request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        self.verify_permission(request.user, 'delete')
        return super(FBAuthRetrieveUpdateDestroyAPIView, self).delete(
            request, *args, **kwargs)
