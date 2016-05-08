from collections import OrderedDict, Counter

from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import APIException
from rest_framework.serializers import Serializer

from hadiths.models import Hadith, Book, Person, HadithTag, ChainPersonRel, Chain, HadithTagRel  # , User, Permission


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
# class TagListingField(serializers.RelatedField):
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
  class Meta:
    model = Hadith
    fields = ['id', 'text', 'person', 'book', 'tags', 'added_on', 'updated_on', 'added_by', 'updated_by']
    read_only_fields = ['added_on', 'updated_on', 'added_by', 'updated_by']

  tags = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=HadithTag.objects.all()))
  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')

  def create(self, validated_data):
    with transaction.atomic():
      instance = Hadith()
      instance.text = validated_data['text']
      instance.person = validated_data['person']
      instance.book = validated_data['book']
      instance.added_by = self.context['request'].user
      instance.save()
      for tag in validated_data['tags']:
        HadithTagRel.objects.create(hadith=instance, tag=tag, added_by=self.context['request'].user)
    return instance

  def update(self, instance, validated_data):
    with transaction.atomic():
      instance.text = validated_data['text']
      instance.person = validated_data['person']
      instance.book = validated_data['book']
      instance.updated_by = self.context['request'].user
      # Delete relations for those persons who are not in the updated person list.
      updated_tag_ids = list(t.id for t in validated_data['tags'])
      instance.tag_rels.exclude(tag_id__in=updated_tag_ids).delete()
      tag_ids_to_keep = instance.tag_rels.values_list('tag_id', flat=True)
      # Make the necessary changes to the existing relations.
      for tag in [t for t in validated_data['tags'] if t.id not in tag_ids_to_keep]:
        HadithTagRel.objects.create(hadith=instance, tag=tag, added_by=self.context['request'].user)
      instance.save()
    return instance

  def to_representation(self, instance):
    expand = self.context['request'].query_params.get('expand', 'false').lower() == 'true'
    ret = OrderedDict()
    ret['id'] = instance.id
    ret['text'] = instance.text
    ret['book'] = instance.book_id if not expand else \
      BookSerializer(instance.book, context=self.context).to_representation(instance.book)
    if instance.person_id is not None:
      ret['person'] = instance.person_id if not expand else \
        PersonSerializer(instance.person, context=self.context).to_representation(instance.person)
    else:
      ret['person'] = None
    ret['tags'] = instance.tag_rels.values_list('tag_id', flat=True) if not expand \
      else [HadithTagSerializer(t.tag, self.context).to_representation(t.tag) for t in instance.tag_rels.all()]
    ret['added_on'] = instance.added_on
    ret['updated_on'] = instance.updated_on
    ret['added_by'] = instance.added_by_id
    ret['updated_by'] = instance.updated_by_id
    return ret


class ChainSerializer(serializers.ModelSerializer):
  """
  A serializer for chains which makes it easy to retrieve or update the
  persons in the chain as if they were an array inside the chains table.
  The serializer takes the persons array and creates the necessary
  relations between chains and persons. In case of updating an existing chain,
  it will find the changes that need to be made to the existing links and make
  the necessary creations and deletion for the end result to match what the
  user sends.
  """

  class Meta:
    model = Chain
    fields = ['id', 'hadith', 'persons', 'added_on', 'updated_on', 'added_by', 'updated_by']
    read_only_fields = ['added_on', 'updated_on', 'added_by', 'updated_by']

  persons = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=Person.objects.all()))
  added_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')
  updated_on = serializers.DateTimeField(read_only=True, format='%Y-%m-%dT%H:%M:%SZ')

  def create(self, validated_data):
    with transaction.atomic():
      instance = Chain()
      instance.hadith = validated_data['hadith']
      instance.added_by = self.context['request'].user
      instance.save()
      for i, person in enumerate(validated_data['persons']):
        rel = ChainPersonRel(chain=instance, person=person, order=i + 1)
        rel.save()
    return instance

  def update(self, instance, validated_data):
    with transaction.atomic():
      # TODO: Do we want to enable changing the hadith a certain chain is
      # attached to? Does this have a valid use case?
      instance.hadith = validated_data['hadith']
      instance.updated_by = self.context['request'].user
      # Delete relations for those persons who are not in the updated person list.
      updated_person_ids = list(p.id for p in validated_data['persons'])
      instance.person_rels.exclude(person_id__in=updated_person_ids).delete()
      # Make the necessary changes to the existing relations.
      for i, person in enumerate(validated_data['persons']):
        rel = ChainPersonRel.objects.filter(chain=instance, person=person).first()
        if rel is None:
          ChainPersonRel.objects.create(chain=instance, person=person, order=i + 1)
        elif rel.order != i + 1:
          rel.order = i + 1
          rel.save()
      instance.save()
    return instance

  def validate_persons(self, persons):
    person_ids = [p.id for p in persons]
    rep_ids = [id for id, cnt in Counter(person_ids).items() if cnt > 1]
    if rep_ids:
      raise serializers.ValidationError(
        'The same person cannot appear twice in a chain. The following ID(s) '
        'appeared more than once in the chain: ' + ', '.join(map(str, rep_ids)))
    return persons

  def to_representation(self, instance):
    expand = self.context['request'].query_params.get('expand', 'false').lower() == 'true'
    ret = OrderedDict()
    ret['id'] = instance.id
    ret['hadith'] = instance.hadith_id if not expand else \
      HadithSerializer(instance.hadith, context=self.context).to_representation(instance.hadith)
    ret['persons'] = instance.person_rels.values_list('person_id', flat=True).order_by('order') if not expand \
      else [PersonSerializer(p.person, context=self.context).to_representation(p.person) for p in
            instance.person_rels.order_by('order').all()]
    ret['added_on'] = instance.added_on
    ret['updated_on'] = instance.updated_on
    ret['added_by'] = instance.added_by_id
    ret['updated_by'] = instance.updated_by_id
    return ret


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
