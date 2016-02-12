import sys

from django.db import models


class Person(models.Model):
  class Meta:
    db_table = 'persons'

  """A model describing a person."""
  title = models.CharField(max_length=16)
  display_name = models.CharField(max_length=128, unique=True, null=True, blank=True)
  full_name = models.CharField(max_length=255, unique=True)
  brief_desc = models.CharField(max_length=512, null=True, blank=True)
  # NOTE: We don't use DateField because it doesn't allow us to keep null
  # some parts of the date if they are unknown.
  # NOTE: I am not indexing these fields because I don't think they will be
  # frequently used for filtering.
  birth_year = models.SmallIntegerField(null=True, blank=True)
  birth_month = models.SmallIntegerField(null=True, blank=True)
  birth_day = models.SmallIntegerField(null=True, blank=True)
  death_year = models.SmallIntegerField(null=True, blank=True)
  death_month = models.SmallIntegerField(null=True, blank=True)
  death_day = models.SmallIntegerField(null=True, blank=True)
  # TODO: Do we need to index added_on and updated_on?
  added_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  added_by = models.BigIntegerField(null=True, db_index=True)
  updated_by = models.BigIntegerField(null=True, db_index=True)

  def __unicode__(self):
    return self.display_name or self.full_name


class Book(models.Model):
  class Meta:
    db_table = 'books'

  title = models.CharField(max_length=128, unique=True)
  brief_desc = models.CharField(max_length=256, null=True, blank=True)
  pub_year = models.SmallIntegerField(null=True, blank=True, db_index=True)
  # TODO: Do we need to index added_on and updated_on?
  added_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  added_by = models.BigIntegerField(null=True, db_index=True)
  updated_by = models.BigIntegerField(null=True, db_index=True)

  def __unicode__(self):
    return self.title[:50] + '...' if len(self.title) > 50 else self.title


class HadithTag(models.Model):
  class Meta:
    db_table = 'hadithtags'

  """A model describing a tag for hadiths."""
  name = models.CharField(max_length=32, unique=True)
  # TODO: Do we need to index added_on and updated_on?
  added_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  added_by = models.BigIntegerField(null=True, db_index=True)
  updated_by = models.BigIntegerField(null=True, db_index=True)

  def __unicode__(self):
    return self.name


class Hadith(models.Model):
  class Meta:
    db_table = 'hadiths'

  """A model describing a hadith."""
  text = models.TextField(db_index=True)
  # Django automatically index foreign keys, but adding Index=True to make it clear.
  person = models.ForeignKey(Person, related_name='hadiths', db_index=True)
  book = models.ForeignKey(Book, null=True, related_name='hadiths', db_index=True)
  tags = models.ManyToManyField(HadithTag, db_table='hadiths_hadithtags', related_name='hadiths')
  # TODO: Do we need to index added_on and updated_on?
  added_on = models.DateTimeField(auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True)
  added_by = models.BigIntegerField(null=True, db_index=True)
  updated_by = models.BigIntegerField(null=True, db_index=True)

  def __unicode__(self):
    return self.text[:100] + '...' if len(self.text) > 100 else self.text


class Chain(models.Model):
  class Meta:
    db_table = 'chains'

  # Django automatically index foreign keys, but adding Index=True to make it clear.
  hadith = models.ForeignKey(Hadith, related_name='chains', db_index=True)


class ChainLink(models.Model):
  class Meta:
    db_table = 'chainlinks'

  # Django automatically index foreign keys, but adding Index=True to make it clear.
  chain = models.ForeignKey(Chain, related_name='chainlinks', db_index=True)
  person = models.ForeignKey(Person, related_name='chainlinks', db_index=True)
  # TODO: Do we need an index here?
  order = models.SmallIntegerField(null=False, blank=False)


class User(models.Model):
  class Meta:
    db_table = 'users'

  fb_id = models.BigIntegerField(unique=True)
  permissions = models.BigIntegerField()

  @classmethod
  def get_unregistered_user(cls, fb_id):
    return User(fb_id=fb_id, permissions=0)

  def set_permission(self, perm_code, set_or_clear):
    if set_or_clear:
      self.permissions |= perm_code
    else:
      self.permissions &= ~perm_code

  def has_permission(self, perm_code):
    return (self.permissions & perm_code) == perm_code


class Permission(models.Model):
  class Meta:
    db_table = 'permissions'

  name = models.CharField(max_length=128, unique=True)
  desc = models.CharField(max_length=512)
  code = models.BigIntegerField(unique=True)

  @classmethod
  def get_all(cls):
    if len(sys.argv) == 2 and sys.argv[0].endswith('manage.py') and \
        (sys.argv[1] == 'migrate' or sys.argv[1] == 'makemigrations'):
      # In case we are just creating the database tables by running the
      # migrations, the permissions table won't be available so continuing
      # this method causes an exception, so we just return an empty list
      # is this function is not needed during migration applications.
      return []
    if not hasattr(cls, 'cached_all'):
      cls.cached_all = cls.objects.all()
    return cls.cached_all

  @classmethod
  def get_code_by_name(cls, name):
    if len(sys.argv) == 2 and sys.argv[0].endswith('manage.py') and \
        (sys.argv[1] == 'migrate' or sys.argv[1] == 'makemigrations'):
      return None
    matches = list(filter(lambda perm: perm.name == name, cls.get_all()))
    if len(matches) == 0:
      raise KeyError("Couldn't find a permission with the name '%s'" % name)
    return matches[0].code
