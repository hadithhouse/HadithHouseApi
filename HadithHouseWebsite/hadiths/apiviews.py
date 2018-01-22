"""
This module contains the API views for the different entities of the
application: hadiths, persons, etc.
"""

from random import randint

from django.db.models import ProtectedError, Count
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT

from hadiths.fbauthapiviews import FBAuthListCreateAPIView, \
    FBAuthRetrieveUpdateDestroyAPIView
from hadiths.filters import TagsFilter, IdsFilter
from hadiths.models import Hadith, Person, Book, HadithTag, User, Chain, \
    BookVolume, BookChapter, BookSection, \
    HadithTagRel
from hadiths.serializers import HadithSerializer, PersonSerializer, \
    BookSerializer, HadithTagSerializer, \
    UserSerializer, ChainSerializer, BookVolumeSerializer, \
    BookChapterSerializer, BookSectionSerializer

COMMON_FILTER_FIELDS = ('added_by', 'updated_by')
COMMON_ORDERING_FIELDS = ('added_on', 'updated_on')


# pylint: disable=too-many-ancestors
class PersonSetView(FBAuthListCreateAPIView):
    """
    API view for listing and creating persons.
    """
    lookup_field = 'id'
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    get_perm_code = None
    post_perm_code = 'add_person'
    filter_backends = (
        DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
    filter_fields = COMMON_FILTER_FIELDS + (
        'birth_day', 'birth_month', 'birth_year',
        'death_day', 'death_month', 'death_year')
    search_fields = (
        'display_name', 'simple_display_name', 'full_name', 'simple_full_name',
        'brief_desc', 'simple_brief_desc')
    ordering_fields = COMMON_ORDERING_FIELDS + (
        'display_name', 'full_name', 'birth_year', 'death_year')


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class PersonView(FBAuthRetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting persons.
    """
    lookup_field = 'id'
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    get_perm_code = None
    post_perm_code = 'add_person'
    put_perm_code = 'change_person'
    patch_perm_code = 'change_person'
    delete_perm_code = 'delete_person'

    def handle_exception(self, exc):
        """
        Special handling for the case when the user tries to delete a person
        while it is still being referenced. Instead of allowing the
        ProtectedError Django exception to propagate which might sound like
        a problem with the system, we throw a PermissionDenied exception,
        explaining why deletion cannot be done.
        """
        if isinstance(exc, ProtectedError):
            return super(PersonView, self).handle_exception(PermissionDenied(
                'Cannot delete person because it is still referenced. Delete '
                'all entities, e.g. hadiths, referencing it and try again.'))
        return super(PersonView, self).handle_exception(exc)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class BookSetView(FBAuthListCreateAPIView):
    """
    API view for listing and creating books.
    """
    lookup_field = 'id'
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    get_perm_code = None
    post_perm_code = 'add_book'
    filter_backends = (
        DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
    filter_fields = COMMON_FILTER_FIELDS + ('pub_year',)
    search_fields = ('title', 'simple_title', 'brief_desc',
                     'simple_brief_desc')
    ordering_fields = COMMON_ORDERING_FIELDS + ('title',)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class BookView(FBAuthRetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting books.
    """
    lookup_field = 'id'
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    get_perm_code = None
    post_perm_code = 'add_book'
    put_perm_code = 'change_book'
    patch_perm_code = 'change_book'
    delete_perm_code = 'delete_book'

    def handle_exception(self, exc):
        if isinstance(exc, ProtectedError):
            return super(BookView, self).handle_exception(PermissionDenied(
                'Cannot delete book because it is still referenced. Delete '
                'all entities, e.g. hadiths, referencing it and try again.'))
        return super(BookView, self).handle_exception(exc)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class BookVolumeSetView(FBAuthListCreateAPIView):
    """
    API view for listing and creating book volumes.
    """
    lookup_field = 'id'
    queryset = BookVolume.objects.all()
    serializer_class = BookVolumeSerializer
    get_perm_code = None
    post_perm_code = 'add_book'
    filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter,
                       SearchFilter)
    filter_fields = COMMON_FILTER_FIELDS + ('book', 'number')
    search_fields = ('title', 'simple_title')
    ordering_fields = COMMON_ORDERING_FIELDS + ('title', 'book', 'number')


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class BookVolumeView(FBAuthRetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting book volumes.
    """
    lookup_field = 'id'
    queryset = BookVolume.objects.all()
    serializer_class = BookVolumeSerializer
    get_perm_code = None
    post_perm_code = 'add_book'
    put_perm_code = 'change_book'
    patch_perm_code = 'change_book'
    delete_perm_code = 'delete_book'

    def handle_exception(self, exc):
        if isinstance(exc, ProtectedError):
            return super(BookVolumeView, self).handle_exception(
                PermissionDenied(
                    'Cannot delete book volume because it is still '
                    'referenced. Delete all entities, e.g. hadiths, '
                    'referencing it and try again.'))
        return super(BookVolumeView, self).handle_exception(exc)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class BookChapterSetView(FBAuthListCreateAPIView):
    """
    API view for listing and creating book chapters.
    """
    lookup_field = 'id'
    queryset = BookChapter.objects.all()
    serializer_class = BookChapterSerializer
    get_perm_code = None
    post_perm_code = 'add_book'
    filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter,
                       SearchFilter)
    filter_fields = COMMON_FILTER_FIELDS + ('book', 'number')
    search_fields = ('title', 'simple_title')
    ordering_fields = COMMON_ORDERING_FIELDS + ('title', 'book', 'number')


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class BookChapterView(FBAuthRetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and destroying book chapters.
    """
    lookup_field = 'id'
    queryset = BookChapter.objects.all()
    serializer_class = BookChapterSerializer
    get_perm_code = None
    post_perm_code = 'add_book'
    put_perm_code = 'change_book'
    patch_perm_code = 'change_book'
    delete_perm_code = 'delete_book'

    def handle_exception(self, exc):
        if isinstance(exc, ProtectedError):
            return super(BookChapterView, self).handle_exception(
                PermissionDenied(
                    'Cannot delete book chapter because it is still '
                    'referenced. Delete all entities, e.g. hadiths, '
                    'referencing it and try again.'))
        return super(BookChapterView, self).handle_exception(exc)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class BookSectionSetView(FBAuthListCreateAPIView):
    """
    API view for listing and creating book sections.
    """
    lookup_field = 'id'
    queryset = BookSection.objects.all()
    serializer_class = BookSectionSerializer
    get_perm_code = None
    post_perm_code = 'add_book'
    filter_backends = (DjangoFilterBackend, IdsFilter, OrderingFilter,
                       SearchFilter)
    filter_fields = COMMON_FILTER_FIELDS + ('book', 'number')
    search_fields = ('title', 'simple_title')
    ordering_fields = COMMON_ORDERING_FIELDS + ('title', 'book', 'number')


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class BookSectionView(FBAuthRetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and destroying book sections.
    """
    lookup_field = 'id'
    queryset = BookSection.objects.all()
    serializer_class = BookSectionSerializer
    get_perm_code = None
    post_perm_code = 'add_book'
    put_perm_code = 'change_book'
    patch_perm_code = 'change_book'
    delete_perm_code = 'delete_book'

    def handle_exception(self, exc):
        if isinstance(exc, ProtectedError):
            return super(BookSectionView, self).handle_exception(
                PermissionDenied(
                    'Cannot delete book section because it is still '
                    'referenced. Delete all entities, e.g. hadiths, '
                    'referencing it and try again.'))
        return super(BookSectionView, self).handle_exception(exc)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class HadithTagSetView(FBAuthListCreateAPIView):
    """
    API view for listing and creating hadith tags.
    """
    lookup_field = 'id'
    queryset = HadithTag.objects.all()
    serializer_class = HadithTagSerializer
    get_perm_code = None
    post_perm_code = 'add_hadithtag'
    filter_backends = (
        DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
    filter_fields = COMMON_FILTER_FIELDS
    search_fields = ('name', 'simple_name')
    ordering_fields = COMMON_ORDERING_FIELDS + ('title',)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class HadithTagView(FBAuthRetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting hadith tags.
    """
    lookup_field = 'id'
    queryset = HadithTag.objects.all()
    serializer_class = HadithTagSerializer
    get_perm_code = None
    post_perm_code = 'add_hadithtag'
    put_perm_code = 'change_hadithtag'
    patch_perm_code = 'change_hadithtag'
    delete_perm_code = 'delete_hadithtag'

    def handle_exception(self, exc):
        if isinstance(exc, ProtectedError):
            return super(HadithTagView, self).handle_exception(
                PermissionDenied(
                    'Cannot delete hadith tag because it is still referenced. '
                    'Delete all entities, e.g. hadiths, referencing '
                    'it and try again.'))
        return super(HadithTagView, self).handle_exception(exc)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class HadithSetView(FBAuthListCreateAPIView):
    """
    API view for listing and creating hadiths.
    """
    lookup_field = 'id'
    queryset = Hadith.objects.all()
    serializer_class = HadithSerializer
    get_perm_code = None
    post_perm_code = 'add_hadith'
    filter_backends = (DjangoFilterBackend, IdsFilter, TagsFilter,
                       OrderingFilter, SearchFilter)
    filter_fields = COMMON_FILTER_FIELDS + (
        'person', 'book', 'volume', 'chapter', 'section', 'number')
    search_fields = ('text', 'simple_text')
    ordering_fields = COMMON_ORDERING_FIELDS + (
        'id', 'text', 'person', 'book', 'volume', 'chapter', 'section',
        'number')


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class HadithView(FBAuthRetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting hadiths.
    """
    lookup_field = 'id'
    queryset = Hadith.objects.all()
    serializer_class = HadithSerializer
    get_perm_code = None
    post_perm_code = 'add_hadith'
    put_perm_code = 'change_hadith'
    patch_perm_code = 'change_hadith'
    delete_perm_code = 'delete_hadith'

    def get(self, request, *args, **kwargs):
        """
        Implementation of HTTP GET request.
        """
        hadith_id = kwargs['id']
        if hadith_id == 'random':
            self.verify_permission(request.user, 'get')
            count = Hadith.objects.aggregate(count=Count('id'))['count']
            random_index = randint(0, count - 1)
            random_hadith = Hadith.objects.all()[random_index]
            serializer = self.get_serializer(random_hadith)
            return Response(serializer.data)
        elif hadith_id == 'randomuntagged':
            self.verify_permission(request.user, 'get')
            query = Hadith.objects.exclude(
                id__in=HadithTagRel.objects.values_list(
                    'hadith_id', flat=True))
            count = query.aggregate(count=Count('id'))['count']
            if count == 0:
                return Response(status=HTTP_204_NO_CONTENT)
            random_index = randint(0, count - 1)
            random_untagged_hadith = query[random_index]
            serializer = self.get_serializer(random_untagged_hadith)
            return Response(serializer.data)
        else:
            return super(HadithView, self).get(request, *args, **kwargs)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class ChainSetView(FBAuthListCreateAPIView):
    """
    API view for listing and creating chains.
    """
    lookup_field = 'id'
    queryset = Chain.objects.all()
    serializer_class = ChainSerializer
    get_perm_code = None
    post_perm_code = 'add_chain'
    filter_backends = (
        DjangoFilterBackend, TagsFilter, IdsFilter, OrderingFilter,
        SearchFilter)
    filter_fields = COMMON_FILTER_FIELDS + ('hadith',)
    search_fields = ('text', 'simple_text')
    ordering_fields = COMMON_ORDERING_FIELDS + ('hadith',)


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class ChainView(FBAuthRetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting chains.
    """
    lookup_field = 'id'
    queryset = Chain.objects.all()
    serializer_class = ChainSerializer
    get_perm_code = None
    post_perm_code = 'add_chain'
    put_perm_code = 'change_chain'
    patch_perm_code = 'change_chain'
    delete_perm_code = 'delete_chain'


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class UserSetView(FBAuthListCreateAPIView):
    """
    API view for listing users. Notice that, unlike the rest of the views in
    this module, this view doesn't support adding new users, as new users
    have to be added by admins manually as we don't want to open the door
    to any one to edit the content of the application and reduce users trust
    for the content.
    """
    lookup_field = 'id'
    queryset = User.objects.all()
    serializer_class = UserSerializer
    get_perm_code = None
    filter_backends = (
        DjangoFilterBackend, IdsFilter, OrderingFilter, SearchFilter)
    filter_fields = ('first_name', 'last_name', 'username')
    search_fields = ('first_name', 'last_name', 'username')
    ordering_fields = (
        'first_name', 'last_name', 'username', 'is_supervisor', 'is_staff',
        'date_joined')
    http_method_names = ('get',)  # Only allow GET methods

    def post(self, request, *args, **kwargs):
        """
        Implementation of HTTP POST request.
        """
        raise RuntimeError(
            "Users API doesn't support adding new users. Please ask an admin "
            "to add new users.")


# pylint: enable=too-many-ancestors


# pylint: disable=too-many-ancestors
class UserView(FBAuthRetrieveUpdateDestroyAPIView):
    """
    API view for retrieving users. Notice that, unlike the rest of the views in
    this module, this view doesn't support adding new users, as new users
    have to be added by admins manually as we don't want to open the door
    to any one to edit the content of the application and reduce users trust
    for the content.
    """
    lookup_field = 'id'
    queryset = User.objects.all()
    serializer_class = UserSerializer
    get_perm_code = None
    http_method_names = ('get',)  # Only allow GET methods

    def get(self, request, *args, **kwargs):
        """
        Implementation of HTTP GET request.
        """
        user_id = kwargs['id']
        if user_id == 'current':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        return super(UserView, self).get(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Implementation of HTTP PUT request.
        """
        raise PermissionDenied(
            "Users API doesn't support updating users. Please ask an admin "
            "to make the required changes.")

    def patch(self, request, *args, **kwargs):
        """
        Implementation of HTTP PATCH request.
        """
        raise PermissionDenied(
            "Users API doesn't support updating users. Please ask an admin "
            "to make the required changes.")

    def delete(self, request, *args, **kwargs):
        """
        Implementation of HTTP DELETE request.
        """
        raise PermissionDenied(
            "Users API doesn't support deleting users. Please ask an admin "
            "to delete the user.")
# pylint: enable=too-many-ancestors
