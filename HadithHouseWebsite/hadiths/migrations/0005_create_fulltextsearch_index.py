from django.db import migrations
from django.db.transaction import atomic

from hadiths.initial_data import *
from hadiths.models import Person, Hadith, HadithTag, Chain, ChainPersonRel, Book, HadithTagRel


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0004_add_first_hadiths'),
  ]

  operations = [
    migrations.RunSQL('''
CREATE INDEX hadiths_text_idx ON hadiths USING GIN (TO_TSVECTOR('english', text));
CREATE INDEX hadiths_simpletext_idx ON hadiths USING GIN (TO_TSVECTOR('english', simple_text));
''')
  ]
