# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.db.transaction import atomic


@atomic
def add_permissions(apps, schema_editor):
  Permission = apps.get_model('hadiths', 'Permission')
  db_alias = schema_editor.connection.alias

  current_code = [0]

  def get_new_code():
    if current_code[0] == 0:
      current_code[0] = 1
    else:
      current_code[0] <<= 1
    return current_code[0]

  # Add permissions
  Permission.objects.using(db_alias).get_or_create(
    name='Can Approve Data',
    desc='Allow the user to approve hadiths, persons, etc.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Deny Data',
    desc='Allow the user to deny hadiths, persons, etc.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Control Permissions',
    desc='Allow the user to add/remove permission types and grant or forfeit user permissions.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Add Hadiths',
    desc='Allow the user to add new hadiths.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Edit Hadiths',
    desc='Allow the user to edit existing hadiths.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Delete Hadiths',
    desc='Allow the user to delete hadiths.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Add Persons',
    desc='Allow the user to add new persons.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Edit Persons',
    desc='Allow the user to edit existing persons.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Delete Persons',
    desc='Allow the user to delete persons.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Add Hadith Tags',
    desc='Allow the user to add new hadith tags.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Edit Hadith Tags',
    desc='Allow the user to edit existing hadith tags.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Delete Hadith Tags',
    desc='Allow the user to delete hadith tags.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Add Books',
    desc='Allow the user to add new books.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Edit Books',
    desc='Allow the user to edit existing books.',
    code=get_new_code()
  )
  Permission.objects.using(db_alias).get_or_create(
    name='Can Delete Books',
    desc='Allow the user to delete books.',
    code=get_new_code()
  )


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0004_20151027_addrafidtousers')
  ]

  operations = [
    migrations.RunPython(add_permissions),
  ]
