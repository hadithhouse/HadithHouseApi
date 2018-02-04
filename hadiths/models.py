"""
This module contains the database models (Django models) representing the
different entities making up the database (hadiths, persons, etc.)
"""

# pylint: disable=too-few-public-methods
# pylint: disable=missing-docstring
# pylint: disable=fixme

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from textprocessing.arabic import simplify_arabic_text


# NOTE: Django automatically index foreign keys, but we still add db_index=True
# to make it clear to the reader.

# NOTE: We don't use DateField in birth and death information of the Person
# model because it doesn't allow us to set as null some parts of the date
# if they are unknown.

# NOTE: Birth and death related fields in the Person model are not indexed
# because I don't think they will be frequently used for filtering.

# TODO: Should we index the added_on and updated_on fields below?


class Person(models.Model):
    """
    A model representing a person.
    """

    class Meta:
        db_table = 'persons'
        default_permissions = ('add', 'change', 'delete')

    title = models.CharField(max_length=16, null=True, blank=True)
    display_name = models.CharField(max_length=128, unique=True, null=True,
                                    blank=True)
    simple_display_name = models.CharField(max_length=128, unique=True,
                                           null=True, blank=True)
    full_name = models.CharField(max_length=255, unique=True)
    simple_full_name = models.CharField(max_length=255, default='')
    brief_desc = models.CharField(max_length=512, null=True, blank=True)
    simple_brief_desc = models.CharField(max_length=512, null=True, blank=True)
    birth_year = models.SmallIntegerField(null=True, blank=True)
    birth_month = models.SmallIntegerField(null=True, blank=True)
    birth_day = models.SmallIntegerField(null=True, blank=True)
    death_year = models.SmallIntegerField(null=True, blank=True)
    death_month = models.SmallIntegerField(null=True, blank=True)
    death_day = models.SmallIntegerField(null=True, blank=True)
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(User, db_index=True,
                                 on_delete=models.SET_NULL, null=True,
                                 blank=True, related_name='persons_added')
    updated_by = models.ForeignKey(User, db_index=True,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='+')

    def __str__(self):
        return self.display_name or self.full_name


class Book(models.Model):
    """
    A model representing a book.
    """

    class Meta:
        db_table = 'books'
        default_permissions = ('add', 'change', 'delete')

    title = models.CharField(max_length=128, unique=True)
    simple_title = models.CharField(max_length=128, default='')
    brief_desc = models.CharField(max_length=256, null=True, blank=True)
    simple_brief_desc = models.CharField(max_length=256, null=True, blank=True)
    pub_year = models.SmallIntegerField(null=True, blank=True, db_index=True)
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                                 null=True, blank=True,
                                 related_name='books_added')
    updated_by = models.ForeignKey(User, db_index=True,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='+')

    def __str__(self):
        return self.title[:50] + '...' if len(self.title) > 50 else self.title


class BookVolume(models.Model):
    """
    A model representing a book volume.
    """

    class Meta:
        db_table = 'bookvolumes'
        default_permissions = ('add', 'change', 'delete')

    title = models.CharField(max_length=128)
    simple_title = models.CharField(max_length=128)
    number = models.SmallIntegerField()
    book = models.ForeignKey(Book, null=True, blank=True,
                             related_name='volumes', db_index=True,
                             on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                                 null=True, blank=True,
                                 related_name='bookvolumes_added')
    updated_by = models.ForeignKey(User, db_index=True,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='+')


class BookChapter(models.Model):
    """
    A model representing a book chapter.
    """

    class Meta:
        db_table = 'bookchapters'
        default_permissions = ('add', 'change', 'delete')

    title = models.CharField(max_length=128)
    simple_title = models.CharField(max_length=128)
    number = models.SmallIntegerField()
    book = models.ForeignKey(Book, null=True, blank=True,
                             related_name='chapters', db_index=True,
                             on_delete=models.CASCADE)
    volume = models.ForeignKey(BookVolume, null=True, blank=True,
                               related_name='chapters', db_index=True,
                               on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(User, db_index=True,
                                 on_delete=models.SET_NULL, null=True,
                                 blank=True, related_name='bookchapters_added')
    updated_by = models.ForeignKey(User, db_index=True,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='+')


class BookSection(models.Model):
    """
    A model representing a book section.
    """

    class Meta:
        db_table = 'booksections'
        default_permissions = ('add', 'change', 'delete')

    title = models.CharField(max_length=128)
    simple_title = models.CharField(max_length=128)
    number = models.SmallIntegerField()
    book = models.ForeignKey(Book, null=True, blank=True,
                             related_name='sections', db_index=True,
                             on_delete=models.CASCADE)
    chapter = models.ForeignKey(BookChapter, null=True, blank=True,
                                related_name='sections', db_index=True,
                                on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                                 null=True, blank=True,
                                 related_name='booksections_added')
    updated_by = models.ForeignKey(User, db_index=True,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='+')


class HadithTag(models.Model):
    """
    A model representing a hadith tag.
    """

    class Meta:
        db_table = 'hadithtags'
        default_permissions = ('add', 'change', 'delete')

    name = models.CharField(max_length=32, unique=True)
    simple_name = models.CharField(max_length=32, default='')

    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                                 null=True, blank=True,
                                 related_name='hadithtags_added')
    updated_by = models.ForeignKey(User, db_index=True,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='+')

    def __str__(self):
        return self.name


# pylint: disable=too-many-instance-attributes
class Hadith(models.Model):
    """
    A model representing a hadith.
    """

    class Meta:
        db_table = 'hadiths'
        default_permissions = ('add', 'change', 'delete')

    text = models.TextField()
    simple_text = models.TextField(default='')
    person = models.ForeignKey(Person, null=True, blank=True,
                               related_name='hadiths', db_index=True,
                               on_delete=models.PROTECT)
    book = models.ForeignKey(Book, null=True, blank=True,
                             related_name='hadiths', db_index=True,
                             on_delete=models.PROTECT)
    volume = models.ForeignKey(BookVolume, null=True, blank=True,
                               related_name='hadiths', db_index=True,
                               on_delete=models.PROTECT)
    chapter = models.ForeignKey(BookChapter, null=True, blank=True,
                                related_name='hadiths', db_index=True,
                                on_delete=models.PROTECT)
    section = models.ForeignKey(BookSection, null=True, blank=True,
                                related_name='hadiths', db_index=True,
                                on_delete=models.PROTECT)
    number = models.SmallIntegerField(null=True, blank=True, db_index=True)
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(User, db_index=True,
                                 on_delete=models.SET_NULL, null=True,
                                 blank=True, related_name='hadiths_added')
    updated_by = models.ForeignKey(User, db_index=True,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='+')

    def __str__(self):
        return self.text[:100] + '...' if len(self.text) > 100 else self.text


# pylint: disable=too-many-instance-attributes


class HadithTagRel(models.Model):
    """
    A model representing a relation between a hadith and a tag. This is a
    a many-to-many relationship. The set of such relations for a certain
    hadith represent the tags of the hadith and the set of such relations for
    a certain tag represent the hadiths that has this tag.
    """

    class Meta:
        db_table = 'hadiths_hadithtags'
        default_permissions = ('add', 'change', 'delete')
        unique_together = ('hadith', 'tag')

    hadith = models.ForeignKey(Hadith, related_name='tag_rels', db_index=True,
                               on_delete=models.CASCADE)
    tag = models.ForeignKey(HadithTag, related_name='hadith_rels',
                            db_index=True, on_delete=models.PROTECT)
    added_on = models.DateTimeField(auto_now_add=True)
    added_by = models.ForeignKey(User, db_index=True,
                                 on_delete=models.SET_NULL, null=True,
                                 blank=True, related_name='+')


class Chain(models.Model):
    """
    A model representing a chain of narrators for a certain hadith. The chain
    specifies the list of persons who narrated a certain hadith. For example,
    if person C heard person B narrating a hadith from person A, then the
    narration chain is A - B - C. We exclude person A from the chain because
    the person is stored in the hadith object itself, hence we only store
    B - C.
    """

    class Meta:
        db_table = 'chains'
        default_permissions = ('add', 'change', 'delete')

    # Django automatically index foreign keys, but adding Index=True to make
    # it clear.
    hadith = models.ForeignKey(Hadith, related_name='chains',
                               db_index=True, on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    added_by = models.ForeignKey(User, db_index=True,
                                 on_delete=models.SET_NULL, null=True,
                                 blank=True, related_name='chains_added')
    updated_by = models.ForeignKey(User, db_index=True,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name='+')


class ChainPersonRel(models.Model):
    """
    A model representing a relation between a chain and a person. A chain is
    actually a set of these relations. For example, the chain of narrators
    A - B - C is actually a chain object with a relation to person A with
    order field set to 1, a relation to person B with order field set to 2,
    and a relation to person C with order field set to 3.
    """

    class Meta:
        db_table = 'chains_persons'
        default_permissions = ('add', 'change', 'delete')
        unique_together = ('chain', 'person')

    chain = models.ForeignKey(Chain, related_name='person_rels',
                              db_index=True, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, related_name='chain_rels',
                               db_index=True, on_delete=models.PROTECT)
    order = models.SmallIntegerField(null=False, blank=False)


class FbUser(models.Model):
    """
    A model representing a Facebook user. It simply contains the Facebook
    ID of the user and a link to the User model.
    """

    class Meta:
        db_table = 'fb_users'
        default_permissions = ()

    fb_id = models.BigIntegerField(unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name='fb_user')


# pylint: disable=unused-argument

# noinspection PyUnusedLocal
@receiver(pre_save, sender=Person)
def person_pre_save(sender, instance, *_args, **_kwargs):
    """
    Called before a person is saved. We generate the simplified
    (without diacritics) versions of the fields.
    :param sender: See Django's Signals documentation.
    :param instance: See Django's Signals documentation.
    :param _args: See Django's Signals documentation.
    :param _kwargs: See Django's Signals documentation.
    """
    instance.simple_display_name = simplify_arabic_text(instance.display_name)
    instance.simple_full_name = simplify_arabic_text(instance.full_name)
    instance.simple_brief_desc = simplify_arabic_text(instance.brief_desc)


# noinspection PyUnusedLocal
@receiver(pre_save, sender=Book)
def book_pre_save(sender, instance, *_args, **_kwargs):
    """
    Called before a book is saved. We generate the simplified
    (without diacritics) versions of the fields.
    :param sender: See Django's Signals documentation.
    :param instance: See Django's Signals documentation.
    :param _args: See Django's Signals documentation.
    :param _kwargs: See Django's Signals documentation.
    """
    instance.simple_title = simplify_arabic_text(instance.title)
    instance.simple_brief_desc = simplify_arabic_text(instance.brief_desc)


# noinspection PyUnusedLocal
@receiver(pre_save, sender=BookVolume)
def bookvolume_pre_save(sender, instance, *_args, **_kwargs):
    """
    Called before a book volume is saved. We generate the simplified
    (without diacritics) versions of the fields.
    :param sender: See Django's Signals documentation.
    :param instance: See Django's Signals documentation.
    :param _args: See Django's Signals documentation.
    :param _kwargs: See Django's Signals documentation.
    """
    instance.simple_title = simplify_arabic_text(instance.title)


# noinspection PyUnusedLocal
@receiver(pre_save, sender=BookChapter)
def bookchapter_pre_save(sender, instance, *_args, **_kwargs):
    """
    Called before a book chapter is saved. We generate the simplified
    (without diacritics) versions of the fields.
    :param sender: See Django's Signals documentation.
    :param instance: See Django's Signals documentation.
    :param _args: See Django's Signals documentation.
    :param _kwargs: See Django's Signals documentation.
    """
    instance.simple_title = simplify_arabic_text(instance.title)


# noinspection PyUnusedLocal
@receiver(pre_save, sender=BookSection)
def booksection_pre_save(sender, instance, *_args, **_kwargs):
    """
    Called before a book section is saved. We generate the simplified
    (without diacritics) versions of the fields.
    :param sender: See Django's Signals documentation.
    :param instance: See Django's Signals documentation.
    :param _args: See Django's Signals documentation.
    :param _kwargs: See Django's Signals documentation.
    """
    instance.simple_title = simplify_arabic_text(instance.title)


# noinspection PyUnusedLocal
@receiver(pre_save, sender=HadithTag)
def hadithtag_pre_save(sender, instance, *_args, **_kwargs):
    """
    Called before a hadith tag is saved. We generate the simplified
    (without diacritics) versions of the fields.
    :param sender: See Django's Signals documentation.
    :param instance: See Django's Signals documentation.
    :param _args: See Django's Signals documentation.
    :param _kwargs: See Django's Signals documentation.
    """
    instance.simple_name = simplify_arabic_text(instance.name)


# noinspection PyUnusedLocal
@receiver(pre_save, sender=Hadith)
def hadith_pre_save(sender, instance, *_args, **_kwargs):
    """
    Called before a hadith is saved. We generate the simplified
    (without diacritics) versions of the fields.
    :param sender: See Django's Signals documentation.
    :param instance: See Django's Signals documentation.
    :param _args: See Django's Signals documentation.
    :param _kwargs: See Django's Signals documentation.
    """
    instance.simple_text = simplify_arabic_text(instance.text)
