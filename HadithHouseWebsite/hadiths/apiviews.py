from rest_framework.filters import DjangoFilterBackend, SearchFilter
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from hadiths import fbapi
from hadiths.fbauthapiviews import FBAuthListCreateAPIView, FBAuthRetrieveUpdateDestroyAPIView
from hadiths.filters import TagsFilter
from hadiths.models import Hadith, Person, Book, HadithTag, User, Permission
from hadiths.serializers import HadithSerializer, PersonSerializer, BookSerializer, HadithTagSerializer, \
  UserSerializer, PermissionSerializer

common_filter_fields = ('added_by', 'updated_by')
common_ordering_fields = ('added_on', 'updated_on')


class PersonSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Persons')
  filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('birth_day', 'birth_month', 'birth_year',
                                          'death_day', 'death_month', 'death_year')
  search_fields = ('display_name', 'full_name')
  ordering_fields = common_ordering_fields + ('display_name', 'full_name', 'birth_year', 'death_year')


class PersonView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Persons')
  put_perm_code = Permission.get_code_by_name('Can Edit Persons')
  patch_perm_code = Permission.get_code_by_name('Can Edit Persons')
  delete_perm_code = Permission.get_code_by_name('Can Delete Persons')


class BookSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Book.objects.all()
  serializer_class = BookSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Books')
  filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('pub_year', )
  search_fields = ('title',)
  ordering_fields = common_ordering_fields + ('title', )


class BookView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Book.objects.all()
  serializer_class = BookSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Books')
  put_perm_code = Permission.get_code_by_name('Can Edit Books')
  patch_perm_code = Permission.get_code_by_name('Can Edit Books')
  delete_perm_code = Permission.get_code_by_name('Can Delete Books')


class HadithTagSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Add Hadith Tags')
  filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields
  search_fields = ('name',)
  ordering_fields = common_ordering_fields + ('title',)


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
  filter_backends = (DjangoFilterBackend, TagsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('person', 'book')
  search_fields = ('text',)
  ordering_fields = common_ordering_fields + ('text', 'person', 'book')


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
  # Permissions are not that many and so pagination is not necessary.
  pagination_class = None


class PermissionView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Permission.objects.all()
  serializer_class = PermissionSerializer
  get_perm_code = None
  post_perm_code = Permission.get_code_by_name('Can Control Permissions')
  put_perm_code = Permission.get_code_by_name('Can Control Permissions')
  patch_perm_code = Permission.get_code_by_name('Can Control Permissions')
  delete_perm_code = Permission.get_code_by_name('Can Control Permissions')
