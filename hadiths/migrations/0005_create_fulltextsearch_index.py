import sys

from django.db import migrations

from HadithHouseApi import settings


class Migration(migrations.Migration):
  dependencies = [
    ('hadiths', '0004_add_first_hadiths'),
  ]

  if settings.is_test_mode() > 0 or settings.is_offline_mode():
    operations = ()
  else:
    operations = [
      migrations.RunSQL('''
  CREATE INDEX hadiths_text_idx ON hadiths USING GIN (TO_TSVECTOR('english', text));
  CREATE INDEX hadiths_simpletext_idx ON hadiths USING GIN (TO_TSVECTOR('english', simple_text));
  ''')
    ]
