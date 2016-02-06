from django.db import migrations
from django.db.transaction import atomic

from hadiths.first_hadith_data import *


def add_first_shia_hadith(apps, schema_editor):
  Person = apps.get_model('hadiths', 'Person')
  Hadith = apps.get_model('hadiths', 'Hadith')
  HadithTag = apps.get_model('hadiths', 'HadithTag')
  Chain = apps.get_model('hadiths', 'Chain')
  ChainLink = apps.get_model('hadiths', 'ChainLink')
  db_alias = schema_editor.connection.alias

  # Adds the first shia hadith to the database.
  h = Hadith.objects.using(db_alias).get_or_create(
      text=first_shia_hadith_text,
      person=Person.objects.get(full_name=prophet_muhammad['full_name']))[0]
  h.tags.add(HadithTag.objects.get_or_create(name=first_hadith_tag)[0])
  h.save()

  # Adds the first chain of the first shia hadith to the database.
  c = Chain(hadith=h)
  c.save()
  c.chainlink_set.add(ChainLink.objects.using(db_alias).get_or_create(
      chain=c,
      person=Person.objects.using(db_alias).get(full_name=imam_alsadiq['full_name']),
      order=1)[0])
  for i in range(len(shia_first_hadith_persons)):
    c.chainlink_set.add(ChainLink.objects.using(db_alias).get_or_create(
        chain=c,
        person=Person.objects.using(db_alias).get(full_name=shia_first_hadith_persons[i]),
        order=i + 2)[0])
  c.save()


def add_first_sunni_hadith(apps, schema_editor):
  Person = apps.get_model('hadiths', 'Person')
  Hadith = apps.get_model('hadiths', 'Hadith')
  HadithTag = apps.get_model('hadiths', 'HadithTag')
  Chain = apps.get_model('hadiths', 'Chain')
  ChainLink = apps.get_model('hadiths', 'ChainLink')
  db_alias = schema_editor.connection.alias

  # Adds the first sunni hadith to the database.
  h = Hadith.objects.using(db_alias).get_or_create(
      text=first_sunni_hadith_text,
      person=Person.objects.get(full_name=prophet_muhammad['full_name']))[0]
  h.tags.add(HadithTag.objects.get_or_create(name=first_hadith_tag)[0])
  h.save()

  # Adds the first chain of the first sunni hadith to the database.
  c = Chain(hadith=h)
  c.save()
  for i in range(len(sunni_first_hadith_persons)):
    c.chainlink_set.add(ChainLink.objects.using(db_alias).get_or_create(
        chain=c,
        person=Person.objects.using(db_alias).get(full_name=sunni_first_hadith_persons[i]),
        order=i + 2)[0])
  c.save()


@atomic
def add_first_hadiths(apps, schema_editor):
  add_first_shia_hadith(apps, schema_editor)
  add_first_sunni_hadith(apps, schema_editor)


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0002_20150602_addfirsthadithspersons')
  ]

  operations = [
    migrations.RunPython(add_first_hadiths)
  ]
