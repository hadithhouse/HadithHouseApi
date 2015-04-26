# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hadiths', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chain',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('hadith', models.ForeignKey(to='hadiths.Hadith')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ChainLink',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('order', models.SmallIntegerField()),
                ('chain', models.ForeignKey(to='hadiths.Chain')),
                ('person', models.ForeignKey(to='hadiths.Person')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
