from hadiths.fbauthapiviews import FBAuthListCreateAPIView, FBAuthRetrieveUpdateDestroyAPIView

from hadiths.models import Hadith, Person, HadithTag, User
from hadiths.serializers import HadithSerializer, PersonSerializer, HadithTagSerializer, UserSerializer


class PersonSetView(FBAuthListCreateAPIView):
  queryset = Person.objects.all()
  serializer_class = PersonSerializer


class PersonView(FBAuthRetrieveUpdateDestroyAPIView):
  queryset = Person.objects.all()
  serializer_class = PersonSerializer


class HadithTagSetView(FBAuthListCreateAPIView):
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer


class HadithTagView(FBAuthRetrieveUpdateDestroyAPIView):
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer


class HadithSetView(FBAuthListCreateAPIView):
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer


class HadithView(FBAuthRetrieveUpdateDestroyAPIView):
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer


class UserSetView(FBAuthListCreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer


class UserView(FBAuthRetrieveUpdateDestroyAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
