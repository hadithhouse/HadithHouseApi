# -*- coding: utf-8 -*-

import codecs
import json
import os
import re

from HadithHouseWebsite import settings
from hadiths import initial_data
from hadiths.models import Book, Hadith, BookChapter, BookVolume, BookSection
from textprocessing.generic import reformat_text
from textprocessing.regex import DocScanner


def get_book_path(sub_path: str):
    return os.path.join(os.path.join(settings.BASE_DIR, 'books'), sub_path)


def filter_lines(text: str, regex: str, flags=re.MULTILINE) -> str:
    """
    Removes lines matching a certain regular expression from a text.
    :param flags: Indicate the flags to use with the regex.
    :param text: A string containing the text.
    :param regex: The regular expression of the lines to be removed. This
    should start with '^' and end with '%'.
    :return: The processed text.
    """
    return re.sub(regex, '', text, flags=flags)


def check_content(content: str):
    if content is None:
        raise ValueError("Parameter 'content' cannot be None.")
    if not isinstance(content, str):
        raise ValueError("Parameter 'content' must be a string.")
    if content.strip() == '':
        raise ValueError("Parameter 'content' must not be empty.")


def check_volume(volume_no: int):
    if volume_no is None:
        raise ValueError("Parameter 'volume_no' cannot be None.")
    if not isinstance(volume_no, int):
        raise ValueError("Parameter 'volume_no' must be an integer.")
    if volume_no < 1 or volume_no > 8:
        raise ValueError("Parameter 'volume_no' must be between 1 and 8, "
                         "inclusive.")


def read_volume_file(volume_no: int) -> str:
    """
    Reads the content of the book.

    :param volume_no: The number of the volume to be read.
    :return: The content of the book.
    """

    check_volume(volume_no)

    book_path = get_book_path(
        'al-kafi/vol%d/alkafi_%d.txt' % (volume_no, volume_no))

    # Open the input file and remove some unnecessary parts in it.
    with codecs.open(book_path, 'r', 'utf-8') as input_file:
        content = input_file.read()
    return content


def write_volume_json(hadiths, volume_no: int):
    """
    Writes the given hadiths into a JSON file. This can be used if we need
    to write the hadiths into a JSON file instead of importing them to the
    database.

    :param hadiths: A list containing the hadiths to be written to a file.
    :param volume_no: The number of the volume.
    :return:
    """
    output_path = get_book_path(
        'al-kafi/vol%d/alkafi_%d.json' % (volume_no, volume_no))
    with codecs.open(output_path, 'w', 'utf-8') as output_file:
        output_file.write(json.dumps(hadiths))


def filter_header_lines(content: str, volume_no: int) -> str:
    """
    The text file of the book has been saved from the original .doc file.
    The original file has the headers mixed with the body of the file, causing
    it to appear with the body of the file. We, thus, need to remove those
    header lines to make sure they don't appear as parts of the hadiths.
    :param content: The content of the book read from the file.
    :param volume_no: The number of the volume.
    :return: The content after removing the header lines.
    """

    check_content(content)
    check_volume(volume_no)

    text = [
        u'الكافي : المجلد الأول',
        u'الكافي : المجلد الثاني',
        u' ?الكافي : المجلد الثالث',
        u'الكافي : المجلد الرابع',
        u'الكافي : المجلد الخامس',
        u'الكافي : المجلد السادس',
        u'الكافي : المجلد السابع',
        u'الكافي : المجلد الثامن'
    ]
    return filter_lines(content, u'^' + text[volume_no - 1] + u'.*$')


def filter_volume_end(content: str, volume_no: int) -> str:
    """
    The book ends with some text explaining that the book has ended (see the
    text file to understand more). This text, if not removed, will be treated
    as part of the last hadith. This method removes it.

    :param content: The content of the book.
    :param volume_no: The number of the volume.
    :return: The content after removing the end.
    """

    check_content(content)
    check_volume(volume_no)

    text = [
        u"كَمَلَ الْجُزْءُ الثَّانِي",
        u"تَمَّ كِتَابُ الْعِشْرَة",
        u"تَمَّ الْمُجَلَّدُ الثَّالِث",
        u"تَمَّ كِتَابُ الْحَجِّ",
        u"تَمَّ كِتَابُ النِّكَاحِ",
        u"تَمَّ كِتَابُ الدَّوَاجِن",
        u"هَذَا آخِرُ كِتَابِ الْأَيْمَانِ وَ النُّذُورِ وَ الْكَفَّارَات",
        u"تَمَّ كِتَابُ الرَّوْضَةِ مِنَ الْكَافِي"
    ]
    return filter_lines(content, text[volume_no - 1] + u'.*\Z',
                        re.MULTILINE | re.DOTALL)


def import_alkafi_volume(command, volume_no: int):
    """
    Reads the hadiths of Al-Kafi V1 from the alkafi_1.txt file and
    adds them to the database.

    :param command: The Django's Command object which calls this method. This
    is used for info logging purposes.
    :param volume_no: The number of the volume being imported.
    """

    check_volume(volume_no)

    content = read_volume_file(volume_no)
    content = filter_header_lines(content, volume_no)
    content = filter_volume_end(content, volume_no)
    content = content.strip()

    volume_titles = [
        u"الكافي - الجزء الأول",
        u"الكافي - الجزء الثاني",
        u"الكافي - الجزء الثالث",
        u"الكافي - الجزء الرابع",
        u"الكافي - الجزء الخامس",
        u"الكافي - الجزء السادس",
        u"الكافي - الجزء السابع",
        u"الكافي - الجزء الثامن"
    ]
    volume_title = volume_titles[volume_no - 1]

    alkafi = Book.objects.get(title=initial_data.shia_first_hadith_book)
    volume, volume_created = BookVolume.objects.get_or_create(
        title=volume_title, book=alkafi, number=1)

    content_len = len(content)
    hadiths = []
    chapter, prev_chapter = None, None
    chapter_no = 1
    section, prev_section = None, None
    section_no = 1
    percentage, prev_percentage = 0, 0

    def callback(type, prev_type, match, prev_match, doc, _context):
        nonlocal content_len, hadiths, chapter, prev_chapter, chapter_no, \
            section, prev_section, section_no, percentage, prev_percentage
        if type == 'kitab':
            # Found a 'kitab' which we treat as a chapter.
            special_case = 'كِتَابُ هِشَامِ بْنِ عَبْدِ الْمَلِكِ'
            chapter_title = reformat_text(doc[match.start():match.end()])
            if not chapter_title.startswith(special_case):
                chapter_title = reformat_text(
                    doc[match.start():match.end()])
                prev_chapter = chapter
                chapter, ignored = BookChapter.objects.get_or_create(
                    book=alkafi,
                    volume=volume,
                    title=chapter_title,
                    number=chapter_no)
                chapter_no += 1
                section = None
                section_no = 1
        elif type == 'bab':
            # Found a 'bab' which we treat as a section.
            section_title = reformat_text(
                doc[match.start():match.end()])
            prev_section = section
            section, ignored = BookSection.objects.get_or_create(
                book=alkafi,
                chapter=chapter,
                title=section_title,
                number=section_no)
            section_no += 1
        elif type == 'eof':
            percentage = 100
        if prev_type == 'hadith_num':
            # If the current type is 'kitab', it means we reached a new chapter
            # so we use the previous chapter (prev_chapter) for the hadith.
            # Same applies for section (type 'bab').
            hadith_chapter = prev_chapter if type == 'kitab' else chapter
            hadith_section = prev_section if type == 'bab' else section
            hadith_text = reformat_text(doc[prev_match.end():match.start()])
            hadith_num = int(
                doc[prev_match.start():prev_match.end() - 1])

            Hadith.objects.get_or_create(
                text=hadith_text,
                book=alkafi,
                volume=volume,
                chapter=hadith_chapter,
                section=hadith_section,
                number=hadith_num)
            hadiths.append({
                'text': hadith_text,
                'book': alkafi.title,
                'volume': volume.title,
                'chapter': hadith_chapter.title if hadith_chapter is not None
                else None,
                'section': hadith_section.title if hadith_section is not None
                else None,
                'number': hadith_num
            })

            # Calculate the percentage of completion.
            percentage = int(match.end() * 100 / content_len)
        if percentage != prev_percentage:
            command.stdout.write(str(percentage) + '%')
            command.stdout.flush()
        prev_percentage = percentage

    kitab_word_regex = '\u0643\u0650?\u062A\u064E?\u0627\u0628\u064F?'
    bab_word_regex = '\u0628\u064e?\u0627\u0628\u064f?'
    ds = DocScanner({
        'kitab': '^\s*' + kitab_word_regex + '.*$',
        'bab': '^\s*' + bab_word_regex + '.*$',
        'hadith_num': '^\s*[\u0660-\u06690-9]+\s*-',
        'eof': '\Z'
    }, callback)
    ds.scan(content, {})

    write_volume_json(hadiths, volume_no)
