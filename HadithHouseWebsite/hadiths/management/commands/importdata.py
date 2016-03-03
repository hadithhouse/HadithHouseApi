import codecs
import os

from django.core.management.base import BaseCommand, CommandError
from hadiths.models import Hadith


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
    with codecs.open(file_path, 'r', 'utf-8') as file:
      max_lines = 1000
      for line in file:
        #max_lines -= 1
        #if max_lines <= 0:
        #  break
        chapter, verse_no, verse = line.split('|')
        h = Hadith.objects.get_or_create(text=verse)
