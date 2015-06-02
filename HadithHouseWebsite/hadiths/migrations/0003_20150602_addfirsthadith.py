# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations
from django.db.transaction import atomic
from hadiths.models import Hadith


@atomic
def add_first_hadith(apps, schema_editor):
  Person = apps.get_model('hadiths', 'Person')
  Hadith = apps.get_model('hadiths', 'Hadith')
  HadithTag = apps.get_model('hadiths', 'HadithTag')
  Chain = apps.get_model('hadiths', 'Chain')
  ChainLink = apps.get_model('hadiths', 'ChainLink')
  db_alias = schema_editor.connection.alias

  # Create the hadith
  h = Hadith.objects.using(db_alias).get_or_create(
    text='''
    نضر الله عبدا سمع مقالتي فوعاها وحفظها وبلغها من لم يسمعها، فرب حامل فقه غير فقيه ورب حامل فقه إلى من هو أفقه منه، ثلاث لا يغل عليهن قلب امرئ مسلم: إخلاص العمل لله، والنصحية لائمة المسلمين، واللزوم لجماعتهم، فإن دعوتهم محيطة من ورائهم، المسلمون إخوة تتكافى دماؤهم ويسعى بذمتهم أدناهم.
    '''.strip(),
    person=Person.objects.get(ref='prophet_muhammad'),
  )[0]
  tag = HadithTag.objects.get_or_create(name='علم الحديث')[0]
  h.tags.add(tag)
  h.save()

  # Create the first chain
  c = Chain(hadith=h)
  c.save()
  c.chainlink_set.add(ChainLink.objects.using(db_alias).get_or_create(
    chain = c,
    person=Person.objects.using(db_alias).get(ref='imam_alsadiq'),
    order=1)[0])
  c.chainlink_set.add(ChainLink.objects.using(db_alias).get_or_create(
    chain = c,
    person=Person.objects.using(db_alias).get(ref='alabdi'),
    order=2)[0])
  c.chainlink_set.add(ChainLink.objects.using(db_alias).get_or_create(
    chain = c,
    person=Person.objects.using(db_alias).get(ref='albajli'),
    order=3)[0])
  c.chainlink_set.add(ChainLink.objects.using(db_alias).get_or_create(
    chain = c,
    person=Person.objects.using(db_alias).get(ref='albazanti'),
    order=4)[0])
  c.chainlink_set.add(ChainLink.objects.using(db_alias).get_or_create(
    chain = c,
    person=Person.objects.using(db_alias).get(ref='bin_isa'),
    order=5)[0])
  c.save()


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0002_20150602_addinitialdata')
  ]

  operations = [
    migrations.RunPython(add_first_hadith),
  ]
