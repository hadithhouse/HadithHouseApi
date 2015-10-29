# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hadiths', '0003_20150602_addfirsthadith'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fb_id', models.BigIntegerField(unique=True, db_index=True)),
                ('permissions', models.BigIntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
