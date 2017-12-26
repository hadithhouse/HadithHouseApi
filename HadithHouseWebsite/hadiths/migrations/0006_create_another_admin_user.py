# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.db import migrations
from django.db.transaction import atomic

from hadiths.models import FbUser


@atomic
def create_admin_user(apps, schema_editor):
  db_alias = schema_editor.connection.alias

  # Create the user
  # NOTE: We cannot call User.objects.create_superuser() because it won't use
  # the db_alias we defined above and if we append user(db_alias) to User.objects,
  # we end up getting this error:
  #
  # AttributeError: 'QuerySet' object has no attribute 'create_superuser'
  #
  # NOTE 2: If you use apps.get_model() with one of the models and directly use the
  # other model, you might end up with an error similar to this:
  #
  # ValueError: Cannot assign "<User: rafid>": "FbUser.user" must be a "User" instance.
  user = User()
  user.username = 'rafid2'
  user.email = 'rafid@hadithhouse.net'
  user.set_password('password')
  user.first_name = 'Rafid'
  user.last_name = 'Al-Humaimidi'
  user.is_staff = True
  user.is_superuser = True
  user.save(using=db_alias)

  # Create the Facebook user for the admin so we can authenticate via Facebook
  fb_user = FbUser(fb_id=1155739557895247, user=user)
  fb_user.save(using=db_alias)


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0005_create_fulltextsearch_index'),
  ]

  operations = [
    migrations.RunPython(create_admin_user),
  ]
