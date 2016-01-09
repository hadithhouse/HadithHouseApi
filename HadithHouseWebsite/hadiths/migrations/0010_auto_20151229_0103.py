# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hadiths', '0009_20151228_addbookpermissions'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='brief_desc',
            field=models.CharField(max_length=256, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='book',
            name='pub_year',
            field=models.SmallIntegerField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
