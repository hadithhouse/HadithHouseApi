from collections import OrderedDict

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import APIException

from hadiths.models import Hadith, Book, Person, HadithTag  # , User, Permission

class AutoTrackSerializer(serializers.ModelSerializer):
  def create(self, validated_data):
    validated_data['added_by'] = self.context['request'].user
    return super(AutoTrackSerializer, self).create(validated_data)

  def update(self, instance, validated_data):
    validated_data['updated_by'] = self.context['request'].user
    return super(AutoTrackSerializer, self).update(instance, validated_data)

# NOTE: We manually specify the format of added_on and updated_on because otherwise for some
# reason the format returned by POST requests is different to the one retrieved
# by GET requests. See this for more information:
# http://stackoverflow.com/questions/31225467/generics-retrieveupdatedestroyapiview-and-generics-listcreateapiview-format-date

class PersonSerializer(AutoTrackSerializer):
  class Meta:
    model = Person
    fields = ['id', 'title', 'display_name', 'full_name', 'brief_desc',
              'birth_year', 'birth_month', 'birth_day',
              'death_year', 'death_month', 'death_day',
              'added_on', 'updated_on', 'added_by', 'updated_by']

  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')


class BookSerializer(AutoTrackSerializer):
  class Meta:
    model = Book
    fields = ['id', 'title', 'brief_desc', 'pub_year', 'added_on', 'updated_on', 'added_by', 'updated_by']

  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')


# TODO: Consider changing this class to allow the user to either send tag names
# or tag IDs by checking whether tag_id_or_name is an integer or a string. Then
# use it in the HadithTagSerializer class.
#class TagListingField(serializers.RelatedField):
#  def to_representation(self, tag):
#    return {'id': tag.id,
#            'name': tag.name}
#
#  def to_internal_value(self, tag_id_or_name):
#    try:
#      tag = HadithTag.objects.get(name=tag_id_or_name)
#      if tag is None:
#        raise APIException('Invalid tag name: ' + tag_id_or_name)
#      return tag
#    except:
#      raise APIException('Invalid tag name: ' + tag_id_or_name)


class HadithTagSerializer(AutoTrackSerializer):
  class Meta:
    model = HadithTag
    fields = ['id', 'name', 'added_on', 'updated_on', 'added_by', 'updated_by']

  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')


class HadithSerializer(AutoTrackSerializer):
  #tags = TagListingField(many=True, queryset=HadithTag.objects.all(), required=False)

  class Meta:
    model = Hadith
    fields = ['id', 'text', 'person', 'book', 'tags', 'added_on', 'updated_on', 'added_by', 'updated_by']

  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id', 'first_name', 'last_name', 'is_superuser', 'is_staff', 'username', 'date_joined']

  date_joined = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')

  def to_representation(self, instance):
    dict = super(UserSerializer, self).to_representation(instance)
    dict['permissions'] = [p[len('hadiths.'):]
                           for p in instance.get_all_permissions()
                           if p.startswith('hadiths.')]
    return dict
