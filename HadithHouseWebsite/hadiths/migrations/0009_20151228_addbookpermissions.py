# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.db.models import Max
from django.db.transaction import atomic


@atomic
def add_permissions(apps, schema_editor):
  Permission = apps.get_model('hadiths', 'Permission')
  db_alias = schema_editor.connection.alias

  current_code = [0]

  def get_new_code():
    if current_code[0] == 0:
      current_code[0] = Permission.objects.all().aggregate(Max('code'))['code__max'] << 1
    else:
      current_code[0] <<= 1
    return current_code[0]

  Permission.objects.using(db_alias).get_or_create(
    name='Can Add Books',
    desc='Allow the user to add new books.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Edit Books',
    desc='Allow the user to edit existing books',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Delete Books',
    desc='Allow the user to delete books.',
    code=get_new_code()
  )


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0008_20151228_addbookmodel')
  ]

  operations = [
    migrations.RunPython(add_permissions),
  ]
