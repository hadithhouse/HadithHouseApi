from collections import OrderedDict

from rest_framework import serializers
from rest_framework.exceptions import APIException

from hadiths.models import Hadith, Book, Person, HadithTag, User, Permission


class PersonSerializer(serializers.ModelSerializer):
  class Meta:
    model = Person
    fields = ['id', 'title', 'display_name', 'full_name', 'ref', 'brief_desc',
              'birth_year', 'birth_month', 'birth_day',
              'death_year', 'death_month', 'death_day',
              'added_on', 'updated_on', 'added_by', 'updated_by']

  # Manually specify the format of added_on and updated_on because otherwise for some
  # reason the format returned by POST requests is different to the one retrieved
  # by GET requests. See this for more information:
  # http://stackoverflow.com/questions/31225467/generics-retrieveupdatedestroyapiview-and-generics-listcreateapiview-format-date
  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')


class BookSerializer(serializers.ModelSerializer):
  class Meta:
    model = Book
    fields = ['id', 'title', 'brief_desc', 'pub_year','added_on', 'updated_on', 'added_by', 'updated_by']

  # Manually specify the format of added_on and updated_on because otherwise for some
  # reason the format returned by POST requests is different to the one retrieved
  # by GET requests. See this for more information:
  # http://stackoverflow.com/questions/31225467/generics-retrieveupdatedestroyapiview-and-generics-listcreateapiview-format-date
  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')


class TagListingField(serializers.RelatedField):
  def to_representation(self, tag):
    return tag.name

  def to_internal_value(self, tag_name):
    try:
      tag = HadithTag.objects.get(name=tag_name)
      if tag is None:
        raise APIException('Invalid tag name: ' + tag_name)
      return tag
    except:
      raise APIException('Invalid tag name: ' + tag_name)


class HadithTagSerializer(serializers.ModelSerializer):
  class Meta:
    model = HadithTag
    fields = ['id', 'name', 'added_on', 'updated_on', 'added_by', 'updated_by']

  # Manually specify the format of added_on and updated_on because otherwise for some
  # reason the format returned by POST requests is different to the one retrieved
  # by GET requests. See this for more information:
  # http://stackoverflow.com/questions/31225467/generics-retrieveupdatedestroyapiview-and-generics-listcreateapiview-format-date
  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')


class HadithSerializer(serializers.ModelSerializer):
  tags = TagListingField(many=True, queryset=HadithTag.objects.all(), required=False)

  class Meta:
    model = Hadith
    fields = ['id', 'text', 'person', 'book', 'tags', 'added_on', 'updated_on', 'added_by', 'updated_by']

  # tags = serializers.PrimaryKeyRelatedField(many=True, queryset=HadithTag.objects.all(), required=False)
  # Manually specify the format of added_on and updated_on because otherwise for some
  # reason the format returned by POST requests is different to the one retrieved
  # by GET requests. See this for more information:
  # http://stackoverflow.com/questions/31225467/generics-retrieveupdatedestroyapiview-and-generics-listcreateapiview-format-date
  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')


class UserSerializer(serializers.Serializer):
  id = serializers.IntegerField(read_only=True)
  fb_id = serializers.IntegerField()
  permissions = serializers.DictField()

  def create(self, validated_data):
    instance = User.objects.create()
    instance.fb_id = validated_data.get('fb_id')
    permissions = validated_data.get('permissions', None)
    if permissions is not None:
      for perm in Permission.get_all():
        field_name = perm.name.lower().replace(' ', '_')
        if field_name in permissions:
          instance.set_permission(perm.code, permissions[perm.name])
    return instance

  def update(self, instance, validated_data):
    instance.fb_id = validated_data.get('fb_id', instance.fb_id)
    permissions = validated_data.get('permissions', None)
    if permissions is not None:
      for perm in Permission.get_all():
        field_name = perm.name.lower().replace(' ', '_')
        if field_name in permissions:
          instance.set_permission(perm.code, permissions[field_name])
    instance.save()
    return instance

  def to_representation(self, instance):
    ret = OrderedDict()
    ret['id'] = instance.id
    ret['fb_id'] = instance.fb_id
    ret['permissions'] = OrderedDict()
    for perm in Permission.get_all():
      field_name = perm.name.lower().replace(' ', '_')
      ret['permissions'][field_name] = instance.has_permission(perm.code)
    return ret


class PermissionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Permission
    fields = ['id', 'name', 'desc', 'code']
