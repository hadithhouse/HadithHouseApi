from rest_framework import generics
from rest_framework.response import Response

from hadiths import fbapi
from hadiths.fbauthapiviews import FBAuthListCreateAPIView, FBAuthRetrieveUpdateDestroyAPIView
from hadiths.models import Hadith, Person, HadithTag, User
from hadiths.serializers import HadithSerializer, PersonSerializer, HadithTagSerializer, UserSerializer
from models import \
  PERMISSION_CAN_ADD_USER, \
  PERMISSION_CAN_EDIT_USER, \
  PERMISSION_CAN_DELETE_USER, \
  PERMISSION_CAN_ADD_HADITH, \
  PERMISSION_CAN_EDIT_HADITH, \
  PERMISSION_CAN_DELETE_HADITH, \
  PERMISSION_CAN_ADD_PERSON, \
  PERMISSION_CAN_EDIT_PERSON, \
  PERMISSION_CAN_DELETE_PERSON, \
  PERMISSION_CAN_ADD_TAG, \
  PERMISSION_CAN_EDIT_TAG, \
  PERMISSION_CAN_DELETE_TAG


class PersonSetView(FBAuthListCreateAPIView):
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_permission = None
  post_permission = PERMISSION_CAN_ADD_PERSON


class PersonView(FBAuthRetrieveUpdateDestroyAPIView):
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_permission = None
  post_permission = PERMISSION_CAN_ADD_PERSON
  patch_permission = PERMISSION_CAN_EDIT_PERSON
  delete_permission = PERMISSION_CAN_DELETE_PERSON


class HadithTagSetView(FBAuthListCreateAPIView):
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer
  get_permission = None
  post_permission = PERMISSION_CAN_ADD_TAG


class HadithTagView(FBAuthRetrieveUpdateDestroyAPIView):
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer
  get_permission = None
  post_permission = PERMISSION_CAN_ADD_TAG
  patch_permission = PERMISSION_CAN_EDIT_TAG
  delete_permission = PERMISSION_CAN_DELETE_TAG


class HadithSetView(FBAuthListCreateAPIView):
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer
  get_permission = None
  post_permission = PERMISSION_CAN_ADD_HADITH


class HadithView(FBAuthRetrieveUpdateDestroyAPIView):
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer
  get_permission = None
  post_permission = PERMISSION_CAN_ADD_HADITH
  patch_permission = PERMISSION_CAN_EDIT_HADITH
  delete_permission = PERMISSION_CAN_DELETE_HADITH


class UserSetView(FBAuthListCreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  get_permission = None
  post_permission = PERMISSION_CAN_ADD_USER


class UserView(FBAuthRetrieveUpdateDestroyAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  get_permission = None
  post_permission = PERMISSION_CAN_ADD_USER
  patch_permission = PERMISSION_CAN_EDIT_USER
  delete_permission = PERMISSION_CAN_DELETE_USER


class CurrentUserView(generics.RetrieveAPIView):
  serializer_class = UserSerializer

  def get(self, request, *args, **kwargs):
    user = fbapi.get_current_user(request.query_params)
    if user is None:
      return fbapi.get_auth_error_response()
    serializer = self.get_serializer(user)
    return Response(serializer.data)
