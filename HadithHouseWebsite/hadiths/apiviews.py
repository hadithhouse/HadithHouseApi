from random import randint

from django.db.models import ProtectedError, Count
from rest_framework.filters import DjangoFilterBackend, SearchFilter
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN

from hadiths.fbauthapiviews import FBAuthListCreateAPIView, FBAuthRetrieveUpdateDestroyAPIView
from hadiths.filters import TagsFilter, IdsFilter
from hadiths.models import Hadith, Person, Book, HadithTag, User, Chain
from hadiths.serializers import HadithSerializer, PersonSerializer, BookSerializer, HadithTagSerializer, \
  UserSerializer, ChainSerializer

common_filter_fields = ('added_by', 'updated_by')
common_ordering_fields = ('added_on', 'updated_on')


class PersonSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_perm_code = None
  post_perm_code = 'add_person'
  filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('birth_day', 'birth_month', 'birth_year',
                                          'death_day', 'death_month', 'death_year')
  search_fields = ('display_name', 'simple_display_name', 'full_name', 'simple_full_name',
                   'brief_desc', 'simple_brief_desc')
  ordering_fields = common_ordering_fields + ('display_name', 'full_name', 'birth_year', 'death_year')


class PersonView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_perm_code = None
  post_perm_code = 'add_person'
  put_perm_code = 'change_person'
  patch_perm_code = 'change_person'
  delete_perm_code = 'delete_person'

  def handle_exception(self, ex):
    if isinstance(ex, ProtectedError):
      return Response({
        'detail': 'Cannot delete person because it is still referenced. Delete '
                  'all entities, e.g. hadiths, referencing it and try again.',
      }, status=HTTP_403_FORBIDDEN, exception=True)
    return super(PersonView, self).handle_exception(ex)


class BookSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Book.objects.all()
  serializer_class = BookSerializer
  get_perm_code = None
  post_perm_code = 'add_book'
  filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('pub_year',)
  search_fields = ('title', 'simple_title', 'brief_desc', 'simple_brief_desc')
  ordering_fields = common_ordering_fields + ('title',)


class BookView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Book.objects.all()
  serializer_class = BookSerializer
  get_perm_code = None
  post_perm_code = 'add_book'
  put_perm_code = 'change_book'
  patch_perm_code = 'change_book'
  delete_perm_code = 'delete_book'

  def handle_exception(self, ex):
    if isinstance(ex, ProtectedError):
      return Response({
        'detail': 'Cannot delete book because it is still referenced. Delete '
                  'all entities, e.g. hadiths, referencing it and try again.',
      }, status=HTTP_403_FORBIDDEN, exception=True)
    return super(BookView, self).handle_exception(ex)


class HadithTagSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer
  get_perm_code = None
  post_perm_code = 'add_hadithtag'
  filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields
  search_fields = ('name', 'simple_name')
  ordering_fields = common_ordering_fields + ('title',)


class HadithTagView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer
  get_perm_code = None
  post_perm_code = 'add_hadithtag'
  put_perm_code = 'change_hadithtag'
  patch_perm_code = 'change_hadithtag'
  delete_perm_code = 'delete_hadithtag'


class HadithSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer
  get_perm_code = None
  post_perm_code = 'add_hadith'
  filter_backends = (DjangoFilterBackend, IdsFilter, TagsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('person', 'book')
  search_fields = ('text', 'simple_text')
  ordering_fields = common_ordering_fields + ('text', 'person', 'book')


class HadithView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer
  get_perm_code = None
  post_perm_code = 'add_hadith'
  put_perm_code = 'change_hadith'
  patch_perm_code = 'change_hadith'
  delete_perm_code = 'delete_hadith'

  def get(self, request, *args, **kwargs):
    id = kwargs['id']
    if id == 'random':
      count = Hadith.objects.aggregate(count=Count('id'))['count']
      random_index = randint(0, count - 1)
      random_hadith = Hadith.objects.all()[random_index]
      serializer = self.get_serializer(random_hadith)
      return Response(serializer.data)
    else:
      return super(HadithView, self).get(request, *args, **kwargs)


class ChainSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Chain.objects.all()
  serializer_class = ChainSerializer
  get_perm_code = None
  post_perm_code = 'add_chain'
  filter_backends = (DjangoFilterBackend, TagsFilter, IdsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('hadith',)
  search_fields = ('text', 'simple_text')
  ordering_fields = common_ordering_fields + ('hadith',)


class ChainView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Chain.objects.all()
  serializer_class = ChainSerializer
  get_perm_code = None
  post_perm_code = 'add_chain'
  put_perm_code = 'change_chain'
  patch_perm_code = 'change_chain'
  delete_perm_code = 'delete_chain'


class UserSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = User.objects.all()
  serializer_class = UserSerializer
  get_perm_code = None
  filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
  filter_fields = ('first_name', 'last_name', 'username')
  search_fields = ('first_name', 'last_name', 'username')
  ordering_fields = ('first_name', 'last_name', 'username', 'is_supervisor', 'is_staff', 'date_joined')
  http_method_names = ('get',) # Only allow GET methods

  def post(self, request, *args, **kwargs):
    raise RuntimeError("Users API doesn't support adding new users. Please ask an admin to add new users.")

class UserView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = User.objects.all()
  serializer_class = UserSerializer
  get_perm_code = None
  http_method_names = ('get',) # Only allow GET methods

  def get(self, request, *args, **kwargs):
    id = kwargs['id']
    if id == 'current':
      serializer = self.get_serializer(request.user)
      return Response(serializer.data)
    else:
      return super(UserView, self).get(request, *args, **kwargs)

  def put(self, request, *args, **kwargs):
    raise RuntimeError("Users API doesn't support updating users. Please ask an admin to make the required changes.")

  def patch(self, request, *args, **kwargs):
    raise RuntimeError("Users API doesn't support updating users. Please ask an admin to make the required changes.")

  def delete(self, request, *args, **kwargs):
    raise RuntimeError("Users API doesn't support deleting users. Please ask an admin to delete the user.")
