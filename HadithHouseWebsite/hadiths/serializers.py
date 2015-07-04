from rest_framework import serializers
from hadiths.models import Hadith, Person, HadithTag


class PersonSerializer(serializers.ModelSerializer):
  class Meta:
    model = Person
    fields = ['id', 'title', 'display_name', 'full_name', 'ref', 'brief_desc',
              'birth_year', 'birth_month', 'birth_day',
              'death_year', 'death_month', 'death_day',
              'added_on', 'updated_on']


class HadithTagSerializer(serializers.ModelSerializer):
  class Meta:
    model = HadithTag
    fields = ['name', 'added_on', 'updated_on']

  # Manually specify the format of added_on and updated_on because otherwise for some
  # reason the format returned by POST requests is different to the one retrieved
  # by GET requests. See this for more information:
  # http://stackoverflow.com/questions/31225467/generics-retrieveupdatedestroyapiview-and-generics-listcreateapiview-format-date
  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')


class HadithSerializer(serializers.ModelSerializer):
  tags = serializers.PrimaryKeyRelatedField(many=True, queryset=HadithTag.objects.all(), required=False)

  class Meta:
    model = Hadith
    fields = ['id', 'text', 'person', 'tags', 'added_on', 'updated_on']
