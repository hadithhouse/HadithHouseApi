# -*- coding: utf-8 -*-

import codecs
import os

from hadiths import initial_data
from hadiths.models import Hadith, Book


def import_holyquran(command):
    """
    Reads the verses of the Holy Quran from the quran-uthmani.txt file and
    adds them to the database.
    """
    file_path = os.path.join(os.path.dirname(__file__), 'quran-uthmani.txt')
    holy_quran = Book.objects.get(title=initial_data.holy_quran)
    sura = None
    # The total number of verses in the Holy Quran is 6236, excluding
    # Basmalas at the beginning of Suras.
    total_verse_count = 6236
    percentage, prev_percentage = 0, 0
    with codecs.open(file_path, 'r', 'utf-8') as file:
        # Each line in quran-uthmani.txt is a bar(|)-separated list containing
        # the chapter number, the verse number, and the verse, respectively.
        # We loop through the lines and add the verses one by one.
        for i, line in enumerate(file):
            if line.startswith('#') or line.isspace():
                # Ignore comment and empty lines.
                continue
            try:
                chapter, verse_no, verse = line.split('|')
                if sura is None or sura.number != chapter:
                    # Suras of the quran are already created in the database.
                    # See 0003_add_holy_quran.py migration for more info.
                    sura = holy_quran.chapters.get(number=chapter)
                # Insert the verse to the database. We could simply use the
                # 'create' method, but we are using 'get_or_create' here
                # instead just in case somehow a verse has already been added.
                Hadith.objects.get_or_create(
                    text=verse,
                    book=holy_quran,
                    chapter=sura,
                    number=verse_no)
                # Calculate the percentage of completion.
                percentage = int(i * 100 / total_verse_count)
                if percentage != prev_percentage:
                    command.stdout.write(str(percentage) + '%')
                    command.stdout.flush()
                prev_percentage = percentage
            except Exception as e:
                command.stderr.write(
                    'Failed while processing the line: ' + line)
                command.stderr.write('Exception was: ' + str(e))
                command.stdout.flush()
