# coding=utf-8

from datetime import date
from hadiths.models import Person


def add_prophet_muhammad_pbuh():
  prophet_muhammad = Person(
    title=u'Prophet',
    display_name=u'Prophet Muhammad (pbuh)',
    full_name=u'Muḥammad ibn ʿAbd Allāh ibn ʿAbd al-Muṭṭalib ibn Hāshim',
    ref=u'prophet_muhammad',
    brief_desc=u'The prophet of Islamic religion, peace be upon him and his household.',
    birth_year=570,
    death_year=632)
  prophet_muhammad.save()
