# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.db.transaction import atomic


@atomic
def add_rafid_to_users(apps, schema_editor):
  User = apps.get_model('hadiths', 'User')
  db_alias = schema_editor.connection.alias

  # Create the hadith
  rafid = User.objects.using(db_alias).get_or_create(
    fb_id=10152863219036905,
    permissions=-1)[0]
  rafid.save()


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0003_20150602_addfirsthadiths')
  ]

  operations = [
    migrations.RunPython(add_rafid_to_users),
  ]
