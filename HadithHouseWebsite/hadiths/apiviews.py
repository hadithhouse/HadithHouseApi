from rest_framework.response import Response

from hadiths import fbapi
from hadiths.fbauthapiviews import FBAuthListCreateAPIView, FBAuthRetrieveUpdateDestroyAPIView
from hadiths.models import Hadith, Person, HadithTag, User, Permission
from hadiths.serializers import HadithSerializer, PersonSerializer, HadithTagSerializer, UserSerializer, \
  PermissionSerializer


class PersonSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Persons')


class PersonView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Persons')
  put_perm_code = Permission.get_code_by_name('Can Edit Persons')
  patch_perm_code = Permission.get_code_by_name('Can Edit Persons')
  delete_perm_code = Permission.get_code_by_name('Can Delete Persons')


class HadithTagSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Hadith Tags')


class HadithTagView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Hadith Tags')
  put_perm_code = Permission.get_code_by_name('Can Edit Hadith Tags')
  patch_perm_code = Permission.get_code_by_name('Can Edit Hadith Tags')
  delete_perm_code = Permission.get_code_by_name('Can Delete Hadith Tags')


class HadithSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Hadiths')


class HadithView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Hadiths')
  put_perm_code = Permission.get_code_by_name('Can Edit Hadiths')
  patch_perm_code = Permission.get_code_by_name('Can Edit Hadiths')
  delete_perm_code = Permission.get_code_by_name('Can Delete Hadiths')


class UserSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = User.objects.all()
  serializer_class = UserSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Control Permissions')


class UserView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = User.objects.all()
  serializer_class = UserSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Control Permissions')
  put_perm_code = Permission.get_code_by_name('Can Control Permissions')
  patch_perm_code = Permission.get_code_by_name('Can Control Permissions')
  delete_perm_code = Permission.get_code_by_name('Can Control Permissions')

  def get(self, request, *args, **kwargs):
    id = kwargs['id']
    if id == 'current':
      user = fbapi.get_current_user(request.query_params)
      if user is None:
        return fbapi.get_auth_error_response()
      serializer = self.get_serializer(user)
      return Response(serializer.data)
    else:
      return super(UserView, self).get(request, *args, **kwargs)


class PermissionSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Permission.objects.all()
  serializer_class = PermissionSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Control Permissions')


class PermissionView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Permission.objects.all()
  serializer_class = PermissionSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Control Permissions')
  put_perm_code = Permission.get_code_by_name('Can Control Permissions')
  patch_perm_code = Permission.get_code_by_name('Can Control Permissions')
  delete_perm_code = Permission.get_code_by_name('Can Control Permissions')
