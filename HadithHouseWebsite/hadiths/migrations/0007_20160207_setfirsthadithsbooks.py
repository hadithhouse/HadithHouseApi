from django.db import migrations
from django.db.transaction import atomic
from hadiths.first_hadith_data import *


@atomic
def set_firsthadiths_books(apps, schema_editor):
  # Define models
  Book = apps.get_model('hadiths', 'Book')
  Hadith = apps.get_model('hadiths', 'Hadith')
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


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0006_20151101_addpermissions')
  ]

  operations = [
    migrations.RunPython(set_firsthadiths_books)
  ]
