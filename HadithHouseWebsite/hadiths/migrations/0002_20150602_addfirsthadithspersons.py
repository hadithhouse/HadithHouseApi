from django.db import migrations
from django.db.transaction import atomic

from hadiths.first_hadith_data import *


def add_prophet_muhammad_pbuh(apps, schema_editor):
  Person = apps.get_model('hadiths', 'Person')
  db_alias = schema_editor.connection.alias
  Person.objects.using(db_alias).get_or_create(
      title=prophet_muhammad['title'],
      display_name=prophet_muhammad['display_name'],
      full_name=prophet_muhammad['full_name'],
      brief_desc=prophet_muhammad['brief_desc'],
      birth_year=prophet_muhammad['birth_year'],
      death_year=prophet_muhammad['death_year'])


def add_imam_sadiq(apps, schema_editor):
  Person = apps.get_model('hadiths', 'Person')
  db_alias = schema_editor.connection.alias
  Person.objects.using(db_alias).get_or_create(
      title=imam_alsadiq['title'],
      display_name=imam_alsadiq['display_name'],
      full_name=imam_alsadiq['full_name'],
      brief_desc=imam_alsadiq['brief_desc'])


def add_persons_of_first_shia_hadith(apps, schema_editor):
  Person = apps.get_model('hadiths', 'Person')
  db_alias = schema_editor.connection.alias
  for name in shia_first_hadith_persons:
    Person.objects.using(db_alias).get_or_create(full_name=name)


def add_persons_of_first_sunni_hadith(apps, schema_editor):
  Person = apps.get_model('hadiths', 'Person')
  db_alias = schema_editor.connection.alias
  for name in sunni_first_hadith_persons:
    Person.objects.using(db_alias).get_or_create(full_name=name)


@atomic
def add_initial_data(apps, schema_editor):
  add_prophet_muhammad_pbuh(apps, schema_editor)
  add_imam_sadiq(apps, schema_editor)
  add_persons_of_first_shia_hadith(apps, schema_editor)
  add_persons_of_first_sunni_hadith(apps, schema_editor)


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0001_initial'),
  ]

  operations = [
    migrations.RunPython(add_initial_data)
  ]
