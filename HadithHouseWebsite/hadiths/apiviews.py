from rest_framework import generics

from hadiths.models import Hadith, Person, HadithTag
from hadiths.serializers import HadithSerializer, PersonSerializer, HadithTagSerializer


class PersonSetView(generics.ListCreateAPIView):
  queryset = Person.objects.all()
  serializer_class = PersonSerializer


class PersonView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Person.objects.all()
  serializer_class = PersonSerializer


class HadithTagSetView(generics.ListCreateAPIView):
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer


class HadithTagView(generics.RetrieveUpdateDestroyAPIView):
  queryset = HadithTag.objects.all()
  serializer_class = HadithTagSerializer


class HadithSetView(generics.ListCreateAPIView):
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer


class HadithView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Hadith.objects.all()
  serializer_class = HadithSerializer

# class HadithSetAPIView(APIView):
#   """
#   List all hadiths or create a new hadith.
#   """
#
#   def get(self, request, format=None):
#     hadiths = Hadith.objects.all()
#     serializer = HadithSerializer(hadiths, many=True)
#     return Response(serializer.data)
#
#   def post(self, request, format=None):
#     data = JSONParser().parse(request)
#     serializer = HadithSerializer(data=data)
#     if serializer.is_valid():
#       serializer.save()
#       return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
# class HadithAPIView(APIView):
#   """
#   Retrieve, update, or delete a hadith.
#   """
#
#   @staticmethod
#   def get_hadith(hadith_id):
#     try:
#       return Hadith.objects.get(id=hadith_id)
#     except Hadith.DoesNotExist:
#       return HttpResponse(status=status.HTTP_404_NOT_FOUND)
#
#   def get(self, request, hadith_id, format=None):
#     hadith = self.get_hadith(hadith_id)
#     serializer = HadithSerializer(hadith)
#     return Response(serializer.data)
#
#   def put(self, request, hadith_id, format=None):
#     hadith = self.get_hadith(hadith_id)
#     data = JSONParser().parse(request)
#     serializer = HadithSerializer(hadith, data=data)
#     if serializer.is_valid():
#       serializer.save()
#       return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#   def delete(self, request, hadith_id, format=None):
#     # Not supporting delete because we don't want to delete any hadith.
#     return HttpResponse(status=status.HTTP_501_NOT_IMPLEMENTED)
#
#     # hadith = self.get_hadith(hadith_id)
#     # hadith.delete()
#     # return HttpResponse(status=204)
