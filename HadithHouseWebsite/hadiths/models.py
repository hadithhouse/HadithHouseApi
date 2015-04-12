from django.db import models


class Person(models.Model):
  """A model describing a person."""
  name = models.CharField(max_length=128)
  brief_desc = models.CharField(max_length=128)
  # We don't use DateField because it doesn't allow us to keep null
  # some parts of the date if they are unknown.
  birth_year = models.SmallIntegerField(null=True, blank=True)
  birth_month = models.SmallIntegerField(null=True, blank=True)
  birth_day = models.SmallIntegerField(null=True, blank=True)
  death_year = models.SmallIntegerField(null=True, blank=True)
  death_month = models.SmallIntegerField(null=True, blank=True)
  death_day = models.SmallIntegerField(null=True, blank=True)
  added_on = models.DateTimeField(auto_now=False, auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True, auto_now_add=True)


class HadithTag(models.Model):
  """A model describing a tag for hadiths."""
  name = models.CharField(max_length=32)
  added_on = models.DateTimeField(auto_now=False, auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True, auto_now_add=True)


class Hadith(models.Model):
  """A model describing a hadith."""
  text = models.TextField()
  person = models.ForeignKey(Person)
  tags = models.ManyToManyField(HadithTag)
  added_on = models.DateTimeField(auto_now=False, auto_now_add=True)
  updated_on = models.DateTimeField(auto_now=True, auto_now_add=True)
