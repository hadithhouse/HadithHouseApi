import codecs
import os

from django.core.management.base import BaseCommand, CommandError
from hadiths.models import Hadith, Book
from hadiths import initial_data


class Command(BaseCommand):
  help = 'Import data to the website'

  def add_arguments(self, parser):
    parser.add_argument('dataname', nargs=1, type=str)

  def handle(self, *args, **options):
    data_name = options['dataname'][0]
    if data_name == 'holyquran':
      self.import_holy_quran()
    else:
      raise CommandError('Invalid data name specified: ' + data_name)

  def import_holy_quran(self):
    file_path = os.path.join(os.path.dirname(__file__), 'quran-uthmani.txt')
    holy_quran = Book.objects.get(title=initial_data.holy_quran)
    with codecs.open(file_path, 'r', 'utf-8') as file:
      for line in file:
        if line.startswith('#') or line.isspace():
          # Ignore comment and empty lines.
          continue
        chapter, verse_no, verse = line.split('|')
        h = Hadith.objects.get_or_create(text=verse, book=holy_quran)
