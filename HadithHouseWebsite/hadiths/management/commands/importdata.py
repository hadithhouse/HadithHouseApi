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
    sura = None
    # The total number of verses in the Holy Quran is 6236, excluding Basmalas
    # at the beginning of Suras.
    total_verse_count = 6236
    perc, prev_perc = 0, 0
    with codecs.open(file_path, 'r', 'utf-8') as file:
      for i, line in enumerate(file):
        if line.startswith('#') or line.isspace():
          # Ignore comment and empty lines.
          continue
        try:
          chapter, verse_no, verse = line.split('|')
          if sura is None or sura.number != chapter:
            sura = holy_quran.chapters.get(number=chapter)
          h = Hadith.objects.get_or_create(text=verse, book=holy_quran, chapter=sura)
          perc = int(i * 100 / total_verse_count)
          if perc != prev_perc:
            self.stdout.write(str(perc) + '%')
            self.stdout.flush()
          prev_perc = perc
        except Exception as e:
          self.stderr.write('Failed while processing the line: ' + line)
          self.stderr.write('Exception was: ' + str(e))
          self.stdout.flush()
