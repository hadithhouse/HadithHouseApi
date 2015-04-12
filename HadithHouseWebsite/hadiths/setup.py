from datetime import date
from hadiths.models import Person


def add_prophet_muhammad_pbuh():
  prophet_muhammad = Person(
    name="Prophet Muhammad",
    brief_desc="The prophet of Islamic religion, peace be upon him and his household.",
    birth_year=570,
    death_year=632)
  prophet_muhammad.save()
