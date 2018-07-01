"""
Contains the serialization classes for use with the API views.
"""

from collections import OrderedDict, Counter

from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers

from hadiths.models import Hadith, Book, Person, HadithTag, ChainPersonRel, \
    Chain, HadithTagRel, \
    BookVolume, BookChapter, BookSection  # , User, Permission


class AutoTrackSerializer(serializers.ModelSerializer):
    """
    Serializer for automatically setting the added_by and updated_by fields
    of an entity whenever a POST or PUT request is made.
    """

    def create(self, validated_data):
        validated_data['added_by'] = self.context['request'].user
        return super(AutoTrackSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super(AutoTrackSerializer, self).update(instance, validated_data)


def get_entity_repr(serialization_context, serializer_cls, entity):
    """
    Retrieves the dictionary representation of an entity.
    :param serialization_context: The context used for serialization. This
    is useful because it contains the request context, which in turns contain
    the user who made the request, if any.
    :param serializer_cls: The class for serializing the related entity.
    :param entity: The entity to make a representation for.
    :return:
    """
    if entity is None:
        return entity
    return serializer_cls(
        entity, context=serialization_context).to_representation(entity)


# NOTE: We manually specify the format of added_on and updated_on because
# otherwise, for some reason, the format returned by POST requests is
# different to the one retrieved by GET requests. See this for more
# information:
# http://stackoverflow.com/q/31225467

class PersonSerializer(AutoTrackSerializer):
    """
    Serializer for person entities.
    """

    class Meta:  # pylint: disable=missing-docstring
        model = Person
        fields = ['id', 'title', 'display_name', 'full_name', 'brief_desc',
                  'birth_year', 'birth_month', 'birth_day',
                  'death_year', 'death_month', 'death_day',
                  'added_on', 'updated_on', 'added_by', 'updated_by']

    added_on = serializers.DateTimeField(read_only=True,
                                         format='%Y-%m-%dT%H:%M:%SZ')
    updated_on = serializers.DateTimeField(read_only=True,
                                           format='%Y-%m-%dT%H:%M:%SZ')


class BookSerializer(AutoTrackSerializer):
    """
    Serializer for book entities.
    """

    class Meta:  # pylint: disable=missing-docstring
        model = Book
        fields = ['id', 'title', 'brief_desc', 'pub_year', 'added_on',
                  'updated_on', 'added_by', 'updated_by']

    added_on = serializers.DateTimeField(read_only=True,
                                         format='%Y-%m-%dT%H:%M:%SZ')
    updated_on = serializers.DateTimeField(read_only=True,
                                           format='%Y-%m-%dT%H:%M:%SZ')


class BookVolumeSerializer(AutoTrackSerializer):
    """
    Serializer for book volume entities.
    """

    class Meta:  # pylint: disable=missing-docstring
        model = BookVolume
        fields = ['id', 'title', 'number', 'book', 'added_on', 'updated_on',
                  'added_by', 'updated_by']

    added_on = serializers.DateTimeField(read_only=True,
                                         format='%Y-%m-%dT%H:%M:%SZ')
    updated_on = serializers.DateTimeField(read_only=True,
                                           format='%Y-%m-%dT%H:%M:%SZ')


class BookChapterSerializer(AutoTrackSerializer):
    """
    Serializer for book chapter entities.
    """

    class Meta:  # pylint: disable=missing-docstring
        model = BookChapter
        fields = ['id', 'title', 'number', 'book', 'volume', 'added_on',
                  'updated_on', 'added_by', 'updated_by']

    added_on = serializers.DateTimeField(read_only=True,
                                         format='%Y-%m-%dT%H:%M:%SZ')
    updated_on = serializers.DateTimeField(read_only=True,
                                           format='%Y-%m-%dT%H:%M:%SZ')


class BookSectionSerializer(AutoTrackSerializer):
    """
    Serializer for book section entities.
    """

    class Meta:  # pylint: disable=missing-docstring
        model = BookSection
        fields = ['id', 'title', 'number', 'book', 'chapter', 'added_on',
                  'updated_on', 'added_by', 'updated_by']

    added_on = serializers.DateTimeField(read_only=True,
                                         format='%Y-%m-%dT%H:%M:%SZ')
    updated_on = serializers.DateTimeField(read_only=True,
                                           format='%Y-%m-%dT%H:%M:%SZ')


# pylint: disable=fixme
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
# pylint: enable=fixme


class HadithTagSerializer(AutoTrackSerializer):
    """
    Serializer for hadith tag entities.
    """

    class Meta:  # pylint: disable=missing-docstring
        model = HadithTag
        fields = ['id', 'name', 'added_on', 'updated_on', 'added_by',
                  'updated_by']

    added_on = serializers.DateTimeField(read_only=True,
                                         format='%Y-%m-%dT%H:%M:%SZ')
    updated_on = serializers.DateTimeField(read_only=True,
                                           format='%Y-%m-%dT%H:%M:%SZ')


class HadithSerializer(AutoTrackSerializer):
    """
    Serializer for hadith entities.
    """

    class Meta:  # pylint: disable=missing-docstring
        model = Hadith
        fields = ['id', 'text', 'person', 'book', 'tags', 'added_on',
                  'updated_on', 'added_by', 'updated_by']
        read_only_fields = ['added_on', 'updated_on', 'added_by', 'updated_by']

    tags = serializers.ListField(child=serializers.PrimaryKeyRelatedField(
        queryset=HadithTag.objects.all()))
    added_on = serializers.DateTimeField(read_only=True,
                                         format='%Y-%m-%dT%H:%M:%SZ')
    updated_on = serializers.DateTimeField(read_only=True,
                                           format='%Y-%m-%dT%H:%M:%SZ')

    def create(self, validated_data):
        with transaction.atomic():
            instance = Hadith()
            instance.text = validated_data['text']
            instance.person = validated_data[
                'person'] if 'person' in validated_data else None
            instance.book = validated_data[
                'book'] if 'book' in validated_data else None
            instance.volume = validated_data[
                'volume'] if 'volume' in validated_data else None
            instance.chapter = validated_data[
                'chapter'] if 'chapter' in validated_data else None
            instance.section = validated_data[
                'section'] if 'section' in validated_data else None
            instance.number = validated_data[
                'number'] if 'number' in validated_data else None
            instance.added_by = self.context['request'].user
            instance.save()
            for tag in validated_data['tags']:
                HadithTagRel.objects.create(hadith=instance, tag=tag,
                                            added_by=self.context[
                                                'request'].user)
        return instance

    def update(self, instance, validated_data):
        with transaction.atomic():
            if self.partial:
                self.__partial_update(instance, validated_data)
            else:
                self.__full_update(instance, validated_data)
            instance.save()
        return instance

    def __full_update(self, instance, validated_data):
        instance.text = validated_data['text']
        instance.person = validated_data[
            'person'] if 'person' in validated_data else None
        instance.book = validated_data[
            'book'] if 'book' in validated_data else None
        instance.volume = validated_data[
            'volume'] if 'volume' in validated_data else None
        instance.chapter = validated_data[
            'chapter'] if 'chapter' in validated_data else None
        instance.section = validated_data[
            'section'] if 'section' in validated_data else None
        instance.number = validated_data[
            'number'] if 'number' in validated_data else None
        instance.updated_by = self.context['request'].user
        # Delete relations for those persons who are not in the updated
        # person list.
        updated_tag_ids = list(t.id for t in validated_data['tags'])
        instance.tag_rels.exclude(tag_id__in=updated_tag_ids).delete()
        tag_ids_to_keep = instance.tag_rels.values_list('tag_id', flat=True)
        # Make the necessary changes to the existing relations.
        for tag in [t for t in validated_data['tags'] if
                    t.id not in tag_ids_to_keep]:
            HadithTagRel.objects.create(hadith=instance, tag=tag,
                                        added_by=self.context['request'].user)

    def __partial_update(self, instance, validated_data):
        if 'text' in validated_data:
            instance.text = validated_data['text']
        if 'person' in validated_data:
            instance.person = validated_data['person']
        if 'book' in validated_data:
            instance.book = validated_data['book']
        if 'volume' in validated_data:
            instance.volume = validated_data['volume']
        if 'chapter' in validated_data:
            instance.chapter = validated_data['chapter']
        if 'section' in validated_data:
            instance.section = validated_data['section']
        if 'number' in validated_data:
            instance.number = validated_data['number']
        instance.updated_by = self.context['request'].user
        # Delete relations for those persons who are not in the updated
        # person list.
        if 'tags' in validated_data:
            updated_tag_ids = list(t.id for t in validated_data['tags'])
            instance.tag_rels.exclude(tag_id__in=updated_tag_ids).delete()
            tag_ids_to_keep = instance.tag_rels.values_list('tag_id', flat=True)
            # Make the necessary changes to the existing relations.
            for tag in [t for t in validated_data['tags'] if
                        t.id not in tag_ids_to_keep]:
                HadithTagRel.objects.create(hadith=instance, tag=tag,
                                            added_by=self.context[
                                                'request'].user)

    def to_representation(self, instance):
        context = self.context
        expand = context['request'].query_params.get(
            'expand', 'false').lower() == 'true'
        ret = OrderedDict()
        ret['id'] = instance.id
        ret['text'] = instance.text
        ret['book'] = instance.book_id if not expand else \
            get_entity_repr(context, BookSerializer, instance.book)
        ret['volume'] = instance.volume_id if not expand else \
            get_entity_repr(context, BookVolumeSerializer, instance.volume)
        ret['chapter'] = instance.chapter_id if not expand else \
            get_entity_repr(context, BookChapterSerializer, instance.chapter)
        ret['section'] = instance.section_id if not expand else \
            get_entity_repr(context, BookSectionSerializer, instance.section)
        ret['number'] = instance.number
        if instance.person_id is not None:
            ret['person'] = instance.person_id if not expand else \
                get_entity_repr(context, PersonSerializer, instance.person)
        else:
            ret['person'] = None
        if not expand:
            ret['tags'] = instance.tag_rels.values_list('tag_id', flat=True)
        else:
            ret['tags'] = [
                get_entity_repr(context, HadithTagSerializer, t.tag)
                for t in instance.tag_rels.all()]
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
    relations between chains and persons. In case of updating an existing
    chain, it will find the changes that need to be made to the existing links
    and make the necessary creations and deletion for the end result to match
    what the user sends.
    """

    class Meta:  # pylint: disable=missing-docstring
        model = Chain
        fields = ['id', 'hadith', 'persons', 'added_on', 'updated_on',
                  'added_by', 'updated_by']
        read_only_fields = ['added_on', 'updated_on', 'added_by', 'updated_by']

    persons = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Person.objects.all()))
    added_on = serializers.DateTimeField(read_only=True,
                                         format='%Y-%m-%dT%H:%M:%SZ')
    updated_on = serializers.DateTimeField(read_only=True,
                                           format='%Y-%m-%dT%H:%M:%SZ')

    # pylint: disable=missing-docstring
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

    # pylint: enable=missing-docstring

    # pylint: disable=missing-docstring
    def update(self, instance, validated_data):
        with transaction.atomic():
            # pylint: disable=fixme
            # TODO: Do we want to enable changing the hadith a certain chain is
            # attached to? Does this have a valid use case?
            # pylint: enable=fixme
            instance.hadith = validated_data['hadith']
            instance.updated_by = self.context['request'].user
            # Delete relations for those persons who are not in the updated
            # person list.
            updated_person_ids = list(p.id for p in validated_data['persons'])
            instance.person_rels.exclude(
                person_id__in=updated_person_ids).delete()
            # Make the necessary changes to the existing relations.
            for i, person in enumerate(validated_data['persons']):
                rel = ChainPersonRel.objects.filter(chain=instance,
                                                    person=person).first()
                if rel is None:
                    ChainPersonRel.objects.create(chain=instance,
                                                  person=person, order=i + 1)
                elif rel.order != i + 1:
                    rel.order = i + 1
                    rel.save()
            instance.save()
        return instance

    # pylint: enable=missing-docstring

    # pylint: disable=missing-docstring,no-self-use
    def validate_persons(self, persons):
        person_ids = [p.id for p in persons]
        rep_ids = [id for id, cnt in Counter(person_ids).items() if cnt > 1]
        if rep_ids:
            raise serializers.ValidationError(
                'The same person cannot appear twice in a chain. The '
                'following ID(s) appeared more than once in the chain: ' +
                ', '.join(map(str, rep_ids)))
        return persons

    # pylint: disable=missing-docstring
    def to_representation(self, instance):
        expand = self.context['request'].query_params.get(
            'expand', 'false').lower() == 'true'
        ret = OrderedDict()
        ret['id'] = instance.id
        ret['hadith'] = instance.hadith_id if not expand else \
            get_entity_repr(self.context, HadithSerializer, instance.hadith)
        if not expand:
            ret['persons'] = instance.person_rels.values_list(
                'person_id', flat=True).order_by('order')
        else:
            ret['persons'] = []
            for person in instance.person_rels.order_by('order').all():
                ret['persons'].push(get_entity_repr(
                    self.context, PersonSerializer, person.person))
        ret['added_on'] = instance.added_on
        ret['updated_on'] = instance.updated_on
        ret['added_by'] = instance.added_by_id
        ret['updated_by'] = instance.updated_by_id
        return ret
    # pylint: enable=missing-docstring


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user entities.
    """

    class Meta:  # pylint: disable=missing-docstring
        model = User
        fields = ['id', 'first_name', 'last_name', 'is_superuser', 'is_staff',
                  'username', 'date_joined']

    date_joined = serializers.DateTimeField(read_only=True,
                                            format='%Y-%m-%dT%H:%M:%SZ')

    # pylint: disable=missing-docstring
    def to_representation(self, instance):
        ret = super(UserSerializer, self).to_representation(instance)
        ret['permissions'] = [p[len('hadiths.'):]
                              for p in instance.get_all_permissions()
                              if p.startswith('hadiths.')]
        return ret
    # pylint: enable=missing-docstring
