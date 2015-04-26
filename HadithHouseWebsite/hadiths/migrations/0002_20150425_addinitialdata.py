# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

def add_prophet_muhammad_pbuh(apps, schema_editor):
  Person = apps.get_model('hadiths', 'Person')
  db_alias = schema_editor.connection.alias
  Person.objects.using(db_alias).get_or_create(
    title=u'Prophet',
    display_name=u'Prophet Muhammad (pbuh)',
    full_name=u'Muḥammad ibn ʿAbd Allāh ibn ʿAbd al-Muṭṭalib ibn Hāshim',
    ref=u'prophet_muhammad',
    brief_desc=u'The prophet of Islamic religion, peace be upon him and his household.',
    birth_year=570,
    death_year=632)


def add_imam_sadiq(apps, schema_editor):
  Person = apps.get_model('hadiths', 'Person')
  db_alias = schema_editor.connection.alias
  Person.objects.using(db_alias).get_or_create(
    title=u'Imam',
    display_name=u'Imam al-Sadiq (pbuh)',
    full_name=u"Ja'far ibn Muḥammad al-Ṣādiq",
    ref=u'imam_alsadiq',
    brief_desc=u'The sixth Shia Imam.',
    birth_year=570,
    death_year=632)


def add_persons_of_first_hadith(apps, schema_editor):
  """Adds the persons involved in the chain of the first hadith I am adding to
  the project."""
  Person = apps.get_model('hadiths', 'Person')
  db_alias = schema_editor.connection.alias
  Person.objects.using(db_alias).get_or_create(full_name=u"عبد الله بن أبي يعفور العبدي", ref='alabdi')
  Person.objects.using(db_alias).get_or_create(full_name=u"ابان بن عثمان الأحمر البجلي", ref='albajli')
  Person.objects.using(db_alias).get_or_create(full_name=u"احمد بن محمد بن عمرو بن ابي نصر البزنطي", ref='albazanti')
  Person.objects.using(db_alias).get_or_create(full_name=u"احمد بن عيسى", ref='bin_isa')


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0001_initial'),
  ]

  operations = [
    migrations.RunPython(add_prophet_muhammad_pbuh),
    migrations.RunPython(add_imam_sadiq),
    migrations.RunPython(add_persons_of_first_hadith),
  ]
