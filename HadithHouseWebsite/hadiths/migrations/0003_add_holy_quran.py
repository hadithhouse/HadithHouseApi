from django.db import migrations
from django.db.transaction import atomic

from hadiths.initial_data import *
from hadiths.models import Book


@atomic
def add_holy_quran(apps, schema_editor):
  db_alias = schema_editor.connection.alias
  Book.objects.using(db_alias).get_or_create(title=holy_quran)[0]


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0002_create_admin_user'),
  ]

  operations = [
    migrations.RunPython(add_holy_quran)
  ]
