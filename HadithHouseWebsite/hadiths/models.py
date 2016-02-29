from django.contrib.auth.models import User
from django.db import models


# NOTE: Django automatically index foreign keys, but we still add db_index=True
# to make it clear to the reader.

# NOTE: We don't use DateField in birth and death information of the Person
# model because it doesn't allow us to set as null some parts of the date
# if they are unknown.

# NOTE: Birth and death related fields in the Person model are not indexed
# because I don't think they will be frequently used for filtering.

# TODO: Do we need to index added_on and updated_on?

class Person(models.Model):
  class Meta:
    db_table = 'persons'
    default_permissions = ('add', 'change', 'delete')

  title = models.CharField(max_length=16)
  display_name = models.CharField(max_length=128, unique=True, null=True, blank=True)
  full_name = models.CharField(max_length=255, unique=True)
  brief_desc = models.CharField(max_length=512, null=True, blank=True)
  birth_year = models.SmallIntegerField(null=True, blank=True)
  birth_month = models.SmallIntegerField(null=True, blank=True)
  birth_day = models.SmallIntegerField(null=True, blank=True)
  death_year = models.SmallIntegerField(null=True, blank=True)
  death_month = models.SmallIntegerField(null=True, blank=True)
  death_day = models.SmallIntegerField(null=True, blank=True)
  added_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  added_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                               null=True, related_name='persons_added')
  updated_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                                 null=True, related_name='+')

  def __unicode__(self):
    return self.display_name or self.full_name


class Book(models.Model):
  class Meta:
    db_table = 'books'
    default_permissions = ('add', 'change', 'delete')

  title = models.CharField(max_length=128, unique=True)
  brief_desc = models.CharField(max_length=256, null=True, blank=True)
  pub_year = models.SmallIntegerField(null=True, blank=True, db_index=True)
  # TODO: Do we need to index added_on and updated_on?
  added_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  added_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                               null=True, related_name='books_added')
  updated_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                                 null=True, related_name='+')

  def __unicode__(self):
    return self.title[:50] + '...' if len(self.title) > 50 else self.title


class HadithTag(models.Model):
  class Meta:
    db_table = 'hadithtags'
    default_permissions = ('add', 'change', 'delete')

  """A model describing a tag for hadiths."""
  name = models.CharField(max_length=32, unique=True)
  # TODO: Do we need to index added_on and updated_on?
  added_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  added_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                               null=True, related_name='hadithtags_added')
  updated_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                                 null=True, related_name='+')

  def __unicode__(self):
    return self.name


class Hadith(models.Model):
  class Meta:
    db_table = 'hadiths'
    default_permissions = ('add', 'change', 'delete')

  """A model describing a hadith."""
  text = models.TextField(db_index=True)
  simple_text = models.TextField(db_index=True, default='')
  person = models.ForeignKey(Person, related_name='hadiths', db_index=True, on_delete=models.PROTECT)
  book = models.ForeignKey(Book, null=True, related_name='hadiths', db_index=True, on_delete=models.PROTECT)
  tags = models.ManyToManyField(HadithTag, db_table='hadiths_hadithtags', related_name='hadiths')
  # TODO: Do we need to index added_on and updated_on?
  added_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  added_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                               null=True, related_name='hadiths_added')
  updated_by = models.ForeignKey(User, db_index=True, on_delete=models.SET_NULL,
                                 null=True, related_name='+')

  def __unicode__(self):
    return self.text[:100] + '...' if len(self.text) > 100 else self.text


class Chain(models.Model):
  class Meta:
    db_table = 'chains'
    default_permissions = ('add', 'change', 'delete')

  # Django automatically index foreign keys, but adding Index=True to make it clear.
  hadith = models.ForeignKey(Hadith, related_name='chains', db_index=True, on_delete=models.CASCADE)
  # TODO: Add change tracking fields.


class ChainLink(models.Model):
  class Meta:
    db_table = 'chainlinks'
    default_permissions = ('add', 'change', 'delete')

  chain = models.ForeignKey(Chain, related_name='chainlinks', db_index=True, on_delete=models.CASCADE)
  person = models.ForeignKey(Person, related_name='chainlinks', db_index=True, on_delete=models.PROTECT)
  # TODO: Do we need an index here?
  order = models.SmallIntegerField(null=False, blank=False)


class FbUser(models.Model):
  class Meta:
    db_table = 'fb_users'
    default_permissions = ()

  fb_id = models.BigIntegerField(unique=True)
  user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='fb_user')
