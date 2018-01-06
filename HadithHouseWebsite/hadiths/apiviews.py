from random import randint

from django.db.models import ProtectedError, Count
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT

from hadiths.fbauthapiviews import FBAuthListCreateAPIView, FBAuthRetrieveUpdateDestroyAPIView
from hadiths.filters import TagsFilter, IdsFilter
from hadiths.models import Hadith, Person, Book, HadithTag, User, Chain, BookVolume, BookChapter, BookSection, \
  HadithTagRel
from hadiths.serializers import HadithSerializer, PersonSerializer, BookSerializer, HadithTagSerializer, \
  UserSerializer, ChainSerializer, BookVolumeSerializer, BookChapterSerializer, BookSectionSerializer

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
      return super(PersonView, self).handle_exception(PermissionDenied(
        'Cannot delete person because it is still referenced. Delete '
        'all entities, e.g. hadiths, referencing it and try again.'))
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
      return super(BookView, self).handle_exception(PermissionDenied(
        'Cannot delete book because it is still referenced. Delete '
        'all entities, e.g. hadiths, referencing it and try again.'))
    return super(BookView, self).handle_exception(ex)


class BookVolumeSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = BookVolume.objects.all()
  serializer_class = BookVolumeSerializer
  get_perm_code = None
  post_perm_code = 'add_book'
  filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('book', 'number')
  search_fields = ('title', 'simple_title')
  ordering_fields = common_ordering_fields + ('title', 'book', 'number')


class BookVolumeView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = BookVolume.objects.all()
  serializer_class = BookVolumeSerializer
  get_perm_code = None
  post_perm_code = 'add_book'
  put_perm_code = 'change_book'
  patch_perm_code = 'change_book'
  delete_perm_code = 'delete_book'

  def handle_exception(self, ex):
    if isinstance(ex, ProtectedError):
      return super(BookVolumeView, self).handle_exception(PermissionDenied(
        'Cannot delete book volume because it is still referenced. Delete '
        'all entities, e.g. hadiths, referencing it and try again.'))
    return super(BookVolumeView, self).handle_exception(ex)


class BookChapterSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = BookChapter.objects.all()
  serializer_class = BookChapterSerializer
  get_perm_code = None
  post_perm_code = 'add_book'
  filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('book', 'number')
  search_fields = ('title', 'simple_title')
  ordering_fields = common_ordering_fields + ('title', 'book', 'number')


class BookChapterView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = BookChapter.objects.all()
  serializer_class = BookChapterSerializer
  get_perm_code = None
  post_perm_code = 'add_book'
  put_perm_code = 'change_book'
  patch_perm_code = 'change_book'
  delete_perm_code = 'delete_book'

  def handle_exception(self, ex):
    if isinstance(ex, ProtectedError):
      return super(BookChapterView, self).handle_exception(PermissionDenied(
        'Cannot delete book chapter because it is still referenced. Delete '
        'all entities, e.g. hadiths, referencing it and try again.'))
    return super(BookChapterView, self).handle_exception(ex)


class BookSectionSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = BookSection.objects.all()
  serializer_class = BookSectionSerializer
  get_perm_code = None
  post_perm_code = 'add_book'
  filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('book', 'number')
  search_fields = ('title', 'simple_title')
  ordering_fields = common_ordering_fields + ('title', 'book', 'number')


class BookSectionView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = BookSection.objects.all()
  serializer_class = BookSectionSerializer
  get_perm_code = None
  post_perm_code = 'add_book'
  put_perm_code = 'change_book'
  patch_perm_code = 'change_book'
  delete_perm_code = 'delete_book'

  def handle_exception(self, ex):
    if isinstance(ex, ProtectedError):
      return super(BookSectionView, self).handle_exception(PermissionDenied(
        'Cannot delete book section because it is still referenced. Delete '
        'all entities, e.g. hadiths, referencing it and try again.'))
    return super(BookSectionView, self).handle_exception(ex)


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

  def handle_exception(self, ex):
    if isinstance(ex, ProtectedError):
      return super(HadithTagView, self).handle_exception(PermissionDenied(
        'Cannot delete hadith tag because it is still referenced. Delete '
        'all entities, e.g. hadiths, referencing it and try again.'))
    return super(HadithTagView, self).handle_exception(ex)


class HadithSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer
  get_perm_code = None
  post_perm_code = 'add_hadith'
  filter_backends = (DjangoFilterBackend, IdsFilter, TagsFilter, OrderingFilter, SearchFilter)
  filter_fields = common_filter_fields + ('person', 'book', 'volume', 'chapter', 'section', 'number')
  search_fields = ('text', 'simple_text')
  ordering_fields = common_ordering_fields + ('id', 'text', 'person', 'book', 'volume', 'chapter', 'section', 'number')


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
    elif id == 'randomuntagged':
      query = Hadith.objects.exclude(id__in = HadithTagRel.objects.values_list('hadith_id', flat=True))
      count = query.aggregate(count=Count('id'))['count']
      if count == 0:
        return Response(status=HTTP_204_NO_CONTENT)
      random_index = randint(0, count - 1)
      random_untagged_hadith = query[random_index]
      serializer = self.get_serializer(random_untagged_hadith)
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
  http_method_names = ('get',)  # Only allow GET methods

  def post(self, request, *args, **kwargs):
    raise RuntimeError("Users API doesn't support adding new users. Please ask an admin to add new users.")


class UserView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = User.objects.all()
  serializer_class = UserSerializer
  get_perm_code = None
  http_method_names = ('get',)  # Only allow GET methods

  def get(self, request, *args, **kwargs):
    id = kwargs['id']
    if id == 'current':
      serializer = self.get_serializer(request.user)
      return Response(serializer.data)
    else:
      return super(UserView, self).get(request, *args, **kwargs)

  def put(self, request, *args, **kwargs):
    raise PermissionDenied(
      "Users API doesn't support updating users. Please ask an admin to make the required changes.")

  def patch(self, request, *args, **kwargs):
    raise PermissionDenied(
      "Users API doesn't support updating users. Please ask an admin to make the required changes.")

  def delete(self, request, *args, **kwargs):
    raise PermissionDenied("Users API doesn't support deleting users. Please ask an admin to delete the user.")
