from rest_framework import generics
from rest_framework.response import Response

from hadiths import fbapi
from hadiths.fbauthapiviews import FBAuthListCreateAPIView, FBAuthRetrieveUpdateDestroyAPIView
from hadiths.models import Hadith, Person, HadithTag, User
from hadiths.serializers import HadithSerializer, PersonSerializer, HadithTagSerializer, UserSerializer
from models import PERMISSIONS


class PersonSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_permission = None
  post_permission = PERMISSIONS['CAN_ADD_PERSON']


class PersonView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Person.objects.all()
  serializer_class = PersonSerializer
  get_permission = None
  post_permission = PERMISSIONS['CAN_ADD_PERSON']
  put_permission = PERMISSIONS['CAN_EDIT_PERSON']
  patch_permission = PERMISSIONS['CAN_EDIT_PERSON']
  delete_permission = PERMISSIONS['CAN_DELETE_PERSON']


class HadithTagSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer
  get_permission = None
  post_permission = PERMISSIONS['CAN_ADD_TAG']


class HadithTagView(FBAuthRetrieveUpdateDestroyAPIView):
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer
  get_permission = None
  post_permission = PERMISSIONS['CAN_ADD_TAG']
  put_permission = PERMISSIONS['CAN_EDIT_TAG']
  patch_permission = PERMISSIONS['CAN_EDIT_TAG']
  delete_permission = PERMISSIONS['CAN_DELETE_TAG']


class HadithSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer
  get_permission = None
  post_permission = PERMISSIONS['CAN_ADD_HADITH']


class HadithView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer
  get_permission = None
  post_permission = PERMISSIONS['CAN_ADD_HADITH']
  put_permission = PERMISSIONS['CAN_EDIT_HADITH']
  patch_permission = PERMISSIONS['CAN_EDIT_HADITH']
  delete_permission = PERMISSIONS['CAN_DELETE_HADITH']


class UserSetView(FBAuthListCreateAPIView):
  lookup_field = 'id'
  queryset = User.objects.all()
  serializer_class = UserSerializer
  get_permission = None
  post_permission = PERMISSIONS['CAN_ADD_USER']


class UserView(FBAuthRetrieveUpdateDestroyAPIView):
  lookup_field = 'id'
  queryset = User.objects.all()
  serializer_class = UserSerializer
  get_permission = None
  post_permission = PERMISSIONS['CAN_ADD_USER']
  put_permission = PERMISSIONS['CAN_EDIT_USER']
  patch_permission = PERMISSIONS['CAN_EDIT_USER']
  delete_permission = PERMISSIONS['CAN_DELETE_USER']

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
