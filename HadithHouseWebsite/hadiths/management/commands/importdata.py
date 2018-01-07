# -*- coding: utf-8 -*-

import codecs
import os
import re

from django.core.management.base import BaseCommand, CommandError

from HadithHouseWebsite import settings
from hadiths.models import Hadith, Book, BookVolume, BookChapter
from hadiths import initial_data
from textprocessing.generic import reformat_text
from textprocessing.regex import DocScanner


class Command(BaseCommand):
    help = 'Import data to the website'

    @staticmethod
    def get_book_path(sub_path):
        return os.path.join(os.path.join(settings.BASE_DIR, 'books'), sub_path)

    def add_arguments(self, parser):
        parser.add_argument('dataname', nargs=1, type=str)

    def handle(self, *args, **options):
        data_name = options['dataname'][0]
        if data_name == 'holyquran':
            self.import_holy_quran()
        elif data_name == 'alkafi-v1':
            self.import_alkafi_v1()
        else:
            raise CommandError('Invalid data name specified: ' + data_name)

    def import_holy_quran(self):
        file_path = os.path.join(os.path.dirname(__file__), 'quran-uthmani.txt')
        holy_quran = Book.objects.get(title=initial_data.holy_quran)
        sura = None
        # The total number of verses in the Holy Quran is 6236, excluding
        # Basmalas at the beginning of Suras.
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
                    Hadith.objects.get_or_create(
                        text=verse,
                        book=holy_quran,
                        chapter=sura,
                        number=verse_no)
                    perc = int(i * 100 / total_verse_count)
                    if perc != prev_perc:
                        self.stdout.write(str(perc) + '%')
                        self.stdout.flush()
                    prev_perc = perc
                except Exception as e:
                    self.stderr.write(
                        'Failed while processing the line: ' + line)
                    self.stderr.write('Exception was: ' + str(e))
                    self.stdout.flush()

    def import_alkafi_v1(self):
        input_path = Command.get_book_path('al-kafi/vol1/alkafi_1.txt')

        # Open the input file and remove some unnecessary parts in it.
        with codecs.open(input_path, 'r', 'utf-8') as input_file:
            content = input_file.read()
        part_of_line_to_remove = 'الكافي : المجلد الأول'
        part_of_line_to_remove_regex = '^' + part_of_line_to_remove + '.*$'
        content = re.sub(part_of_line_to_remove_regex, '', content,
                         flags=re.MULTILINE)

        hadith_info = {
            'kitab': None,
            'bab': None,
        }

        alkafi_v1_title = u"الكافي - الجزء الأول"
        alkafi = Book.objects.get(title=initial_data.shia_first_hadith_book)
        alkafi_v1, volume_created = BookVolume.objects.get_or_create(
            title=alkafi_v1_title, book=alkafi, number=1)
        chapter = [None]
        chapter_no = [1]

        def callback(type, prev_type, match, prev_match, doc, context):
            if type == 'kitab':
                ignore = 'كِتَابُ هِشَامِ بْنِ عَبْدِ الْمَلِكِ'
                kitab = reformat_text(doc[match.start():match.end()])
                if not kitab.startswith(ignore):
                    hadith_info['kitab'] = kitab
            elif type == 'bab':
                hadith_info['bab'] = reformat_text(
                    doc[match.start():match.end()])
                chapter[0], chapter_created = BookChapter.objects.get_or_create(
                    book=alkafi,
                    volume=alkafi_v1,
                    title=alkafi_v1_title,
                    number=chapter_no[0])
                chapter_no[0] += 1
            if prev_type == 'hadith_num':
                hadith_info['hadith'] = reformat_text(
                    doc[prev_match.end():match.start()])
                hadith_info['num'] = int(
                    doc[prev_match.start():prev_match.end() - 1])

                Hadith.objects.get_or_create(
                    text=hadith_info['hadith'],
                    book=alkafi,
                    volume=alkafi_v1,
                    chapter=chapter[0],
                    number=hadith_info['num'])

        kitab_word_regex = '\u0643\u0650?\u062A\u064E?\u0627\u0628?\u064F'
        bab_word_regex = '\u0628\u064e?\u0627\u0628\u064f?'
        ds = DocScanner({
            'kitab': '^\s*' + kitab_word_regex + '.*',
            'bab': '^\s*' + bab_word_regex + '.*',
            'hadith_num': '^\s*[\u0660-\u06690-9]+\s*-',
            'eof': '\Z'
        }, callback)
        ds.scan(content, {})

        print('Finished processing input file.')
