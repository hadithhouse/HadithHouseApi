from rest_framework import generics
from hadiths.fbauthapiviews import FBAuthListCreateAPIView, FBAuthRetrieveUpdateDestroyAPIView

from hadiths.models import Hadith, Person, HadithTag
from hadiths.serializers import HadithSerializer, PersonSerializer, HadithTagSerializer


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
