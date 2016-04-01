from django.db import migrations
from django.db.transaction import atomic

from hadiths.initial_data import *
from hadiths.models import Person, Hadith, HadithTag, Chain, ChainPersonRel, Book, HadithTagRel


def add_prophet_muhammad_pbuh(apps, schema_editor):
  db_alias = schema_editor.connection.alias
  Person.objects.using(db_alias).get_or_create(
    title=prophet_muhammad['title'],
    display_name=prophet_muhammad['display_name'],
    full_name=prophet_muhammad['full_name'],
    brief_desc=prophet_muhammad['brief_desc'],
    birth_year=prophet_muhammad['birth_year'],
    death_year=prophet_muhammad['death_year'])


def add_imam_alsadiq(apps, schema_editor):
  db_alias = schema_editor.connection.alias
  Person.objects.using(db_alias).get_or_create(
    title=imam_alsadiq['title'],
    display_name=imam_alsadiq['display_name'],
    full_name=imam_alsadiq['full_name'],
    brief_desc=imam_alsadiq['brief_desc'])


def add_persons_of_first_shia_hadith(apps, schema_editor):
  db_alias = schema_editor.connection.alias
  for name in shia_first_hadith_persons:
    Person.objects.using(db_alias).get_or_create(full_name=name)


def add_persons_of_first_sunni_hadith(apps, schema_editor):
  db_alias = schema_editor.connection.alias
  for name in sunni_first_hadith_persons:
    Person.objects.using(db_alias).get_or_create(full_name=name)


def add_first_shia_hadith(apps, schema_editor):
  db_alias = schema_editor.connection.alias

  # Adds the first shia hadith to the database.
  h = Hadith.objects.using(db_alias).get_or_create(
    text=first_shia_hadith_text,
    person=Person.objects.get(full_name=prophet_muhammad['full_name']))[0]
  h.save()
  t = HadithTag.objects.get_or_create(name=first_hadith_tag)[0]
  HadithTagRel.objects.using(db_alias).create(hadith=h, tag=t)

  # Adds the first chain of the first shia hadith to the database.
  c = Chain(hadith=h)
  c.save()
  c.person_rels.add(ChainPersonRel.objects.using(db_alias).get_or_create(
    chain=c,
    person=Person.objects.using(db_alias).get(full_name=imam_alsadiq['full_name']),
    order=1)[0])
  for i in range(len(shia_first_hadith_persons)):
    c.person_rels.add(ChainPersonRel.objects.using(db_alias).get_or_create(
      chain=c,
      person=Person.objects.using(db_alias).get(full_name=shia_first_hadith_persons[i]),
      order=i + 2)[0])
  c.save()


def add_first_sunni_hadith(apps, schema_editor):
  db_alias = schema_editor.connection.alias

  # Adds the first sunni hadith to the database.
  h = Hadith.objects.using(db_alias).get_or_create(
    text=first_sunni_hadith_text,
    person=Person.objects.get(full_name=prophet_muhammad['full_name']))[0]
  h.save()
  t = HadithTag.objects.get_or_create(name=first_hadith_tag)[0]
  HadithTagRel.objects.using(db_alias).create(hadith=h, tag=t)

  # Adds the first chain of the first sunni hadith to the database.
  c = Chain(hadith=h)
  c.save()
  for i in range(len(sunni_first_hadith_persons)):
    c.person_rels.add(ChainPersonRel.objects.using(db_alias).get_or_create(
      chain=c,
      person=Person.objects.using(db_alias).get(full_name=sunni_first_hadith_persons[i]),
      order=i + 2)[0])
  c.save()


def set_firsthadiths_books(apps, schema_editor):
  # Define models
  db_alias = schema_editor.connection.alias

  # Add books
  b1 = Book.objects.using(db_alias).get_or_create(title=shia_first_hadith_book)[0]
  b2 = Book.objects.using(db_alias).get_or_create(title=sunni_first_hadith_book)[0]

  # Set the books of the first hadiths
  h1 = Hadith.objects.using(db_alias).get(text=first_shia_hadith_text)
  h1.book = b1
  h1.save()
  h2 = Hadith.objects.using(db_alias).get(text=first_sunni_hadith_text)
  h2.book = b2
  h2.save()


@atomic
def add_first_hadiths(apps, schema_editor):
  add_prophet_muhammad_pbuh(apps, schema_editor)
  add_imam_alsadiq(apps, schema_editor)
  add_persons_of_first_shia_hadith(apps, schema_editor)
  add_persons_of_first_sunni_hadith(apps, schema_editor)
  add_first_shia_hadith(apps, schema_editor)
  add_first_sunni_hadith(apps, schema_editor)
  set_firsthadiths_books(apps, schema_editor)


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0003_add_holy_quran'),
  ]

  operations = [
    migrations.RunPython(add_first_hadiths)
  ]
