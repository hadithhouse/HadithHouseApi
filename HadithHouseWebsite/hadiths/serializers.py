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
    fields = ['id', 'name', 'added_on', 'updated_on']


class HadithSerializer(serializers.ModelSerializer):
  class Meta:
    model = Hadith
    fields = ['id', 'text', 'person', 'tags', 'added_on', 'updated_on']
  # id = serializers.IntegerField(read_only=True)
  # text = serializers.CharField(required=True)
  # added_on = serializers.DateTimeField(required=False, read_only=True)
  # updated_on = serializers.DateTimeField(required=False, read_only=True)
  #
  # def create(self, validated_data):
  #   return Hadith.objects.create(**validated_data)
  #
  # def update(self, instance, validated_data):
  #   instance.text = validated_data.get('text', instance.text)
  #   return Hadith.objects.create(**validated_data)
