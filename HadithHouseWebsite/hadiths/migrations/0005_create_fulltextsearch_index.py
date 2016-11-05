import sys

from django.db import migrations


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0004_add_first_hadiths'),
  ]

  if len({'test'} & set(sys.argv)) > 0:
    operations = ()
  else:
    operations = [
      migrations.RunSQL('''
  CREATE INDEX hadiths_text_idx ON hadiths USING GIN (TO_TSVECTOR('english', text));
  CREATE INDEX hadiths_simpletext_idx ON hadiths USING GIN (TO_TSVECTOR('english', simple_text));
  ''')
    ]
