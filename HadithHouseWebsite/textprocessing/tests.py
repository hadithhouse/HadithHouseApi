# -*- coding: utf-8 -*-

from django.test import TestCase
from django.test.testcases import SimpleTestCase

from textprocessing import arabic
from textprocessing.arabic import remove_arabic_diacritics, unify_alef_letters, simplify_arabic_text
from textprocessing.generic import multiline_to_singleline, remove_brackets_whitespaces, reformat_text, \
  remove_punctuation_marks_whitespaces
from textprocessing.regex import DocScanner


class GenericTestCase(SimpleTestCase):
  def test_multiline_to_singleline(self):
    input = u'My name is \n  Rafid \r Khalid'
    output = multiline_to_singleline(input)
    self.assertEqual(u'My name is Rafid Khalid', output)

  def test_remove_brackets_whitespaces(self):
    input = u'This is a text with (  incorrect whitespaces between brackets   ).'
    output = remove_brackets_whitespaces(input)
    self.assertEqual(u'This is a text with (incorrect whitespaces between brackets).', output)

  def test_remove_punctuation_marks_whitespaces(self):
    input = u'Hello , how are you ?'
    output = remove_punctuation_marks_whitespaces(input)
    self.assertEqual(u'Hello, how are you?', output)

  def test_remove_punctuation_marks_whitespaces_arabic(self):
    input = u'مرحبا ، كيف حالك ؟'
    output = remove_punctuation_marks_whitespaces(input, arabic.PUNCTUATION_MARKS)
    self.assertEqual(u'مرحبا، كيف حالك؟', output)

  def test_reformat_text(self):
    input = u'''
   أَخْبَرَنَا أَبُو جَعْفَرٍ مُحَمَّدُ بْنُ يَعْقُوبَ قَالَ حَدَّثَنِي عِدَّةٌ مِنْ أَصْحَابِنَا مِنْهُمْ مُحَمَّدُ بْنُ
يَحْيَى الْعَطَّارُ عَنْ أَحْمَدَ بْنِ مُحَمَّدٍ عَنِ الْحَسَنِ بْنِ مَحْبُوبٍ عَنِ الْعَلَاءِ بْنِ رَزِينٍ عَنْ مُحَمَّدِ بْنِ مُسْلِمٍ
عَنْ أَبِي جَعْفَرٍ ( عليه السلام )قَالَ لَمَّا خَلَقَ اللَّهُ الْعَقْلَ اسْتَنْطَقَهُ ثُمَّ قَالَ لَهُ أَقْبِلْ فَأَقْبَلَ ثُمَّ قَالَ لَهُ أَدْبِرْ
فَأَدْبَرَ ثُمَّ قَالَ وَ عِزَّتِي وَ جَلَالِي مَا خَلَقْتُ خَلْقاً هُوَ أَحَبُّ إِلَيَّ مِنْكَ وَ لَا أَكْمَلْتُكَ إِلَّا فِيمَنْ
أُحِبُّ أَمَا إِنِّي إِيَّاكَ آمُرُ وَ إِيَّاكَ أَنْهَى وَ إِيَّاكَ أُعَاقِبُ وَ إِيَّاكَ أُثِيبُ .
    '''
    output = reformat_text(input)
    expected = u'''
أَخْبَرَنَا أَبُو جَعْفَرٍ مُحَمَّدُ بْنُ يَعْقُوبَ قَالَ حَدَّثَنِي عِدَّةٌ مِنْ أَصْحَابِنَا مِنْهُمْ مُحَمَّدُ بْنُ يَحْيَى الْعَطَّارُ عَنْ أَحْمَدَ بْنِ مُحَمَّدٍ عَنِ الْحَسَنِ بْنِ مَحْبُوبٍ عَنِ الْعَلَاءِ بْنِ رَزِينٍ عَنْ مُحَمَّدِ بْنِ مُسْلِمٍ عَنْ أَبِي جَعْفَرٍ (عليه السلام)قَالَ لَمَّا خَلَقَ اللَّهُ الْعَقْلَ اسْتَنْطَقَهُ ثُمَّ قَالَ لَهُ أَقْبِلْ فَأَقْبَلَ ثُمَّ قَالَ لَهُ أَدْبِرْ فَأَدْبَرَ ثُمَّ قَالَ وَ عِزَّتِي وَ جَلَالِي مَا خَلَقْتُ خَلْقاً هُوَ أَحَبُّ إِلَيَّ مِنْكَ وَ لَا أَكْمَلْتُكَ إِلَّا فِيمَنْ أُحِبُّ أَمَا إِنِّي إِيَّاكَ آمُرُ وَ إِيَّاكَ أَنْهَى وَ إِيَّاكَ أُعَاقِبُ وَ إِيَّاكَ أُثِيبُ.
    '''.strip()
    self.assertEqual(expected, output)


class ArabicTestCase(SimpleTestCase):
  def test_remove_arabic_diacritic(self):
    input = u'اخْتِبار ازَاْلة عَلامات التَشْكيل'
    output = remove_arabic_diacritics(input)
    self.assertEqual(u'اختبار ازالة علامات التشكيل', output)

  def test_unify_alef_letters(self):
    input = u'اآأإٱٲٳٵ'
    output = unify_alef_letters(input)
    self.assertEqual(u'اااااااا', output)

  def test_simplify_arabic_text_for_surat_alfatiha(self):
    self.assertEqual(u'بسم الله الرحمن الرحيم', simplify_arabic_text(u'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'))
    self.assertEqual(u'الحمد لله رب العالمين', simplify_arabic_text(u'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ'))
    self.assertEqual(u'الرحمن الرحيم', simplify_arabic_text(u'الرَّحْمَنِ الرَّحِيمِ'))
    self.assertEqual(u'مالك يوم الدين', simplify_arabic_text(u'مَالِكِ يَوْمِ الدِّينِ'))
    self.assertEqual(u'اياك نعبد واياك نستعين', simplify_arabic_text(u'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ'))
    self.assertEqual(u'اهدنا الصراط المستقيم', simplify_arabic_text(u'اهدِنَا الصِّرَاطَ الْمُسْتَقِيمَ'))
    self.assertEqual(u'صراط الذين انعمت عليهم غير المغضوب عليهم ولا الضالين', simplify_arabic_text(
      u'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلاَ الضَّالِّينَ'))

  def test_simplify_arabic_text_for_different_alef_types(self):
    # TODO: Add tests for the rest of Alef types.
    self.assertEqual(u'امنا', simplify_arabic_text(u'آمَنَّا'))
    self.assertEqual(u'اولئك', simplify_arabic_text(u'أُوْلَئِكَ'))
    self.assertEqual(u'او', simplify_arabic_text(u'أَوْ'))
    self.assertEqual(u'واذا', simplify_arabic_text(u'وَإِذَا'))
    pass


class DocumentScannerTestCase(SimpleTestCase):
  def test_scan_bullet_points(self):
    numbers_found = []

    def found_number(type, prev_type, match, prev_match, document, context):
      self.assertEqual('number', type)
      self.assertIsNotNone(match.group('number_value'))
      numbers_found.append(match.group('number_value'))

    document = '1. First bullet point 2. Second bullet point'

    ds = DocScanner({
      'number': r'(?P<number_value>[0-9]+)\.'
    }, found_number)
    ds.scan(document)

    self.assertEqual(['1', '2'], numbers_found)

  def test_scan_simple_book(self):
    book = '''
Chapter 1: Title of Chapter 1
Section 1.1: Title of Section 1 of Chapter 1
Section 1.2: Title of Section 2 of Chapter 1
Chapter 2: Title of Chapter 2
Section 2.1: Title of Section 1 of Chapter 2
Section 2.2: Title of Section 2 of Chapter 2
    '''

    tokens_found = []

    def found_token(type, prev_type, match, prev_match, document, context):
      self.assertIn(type, ['chapter', 'section'])

      if type == 'chapter':
        self.assertIsNotNone(match.group('chapter_number'))
        self.assertIsNotNone(match.group('chapter_title'))
        tokens_found.append({
          'number': match.group('chapter_number'),
          'title': match.group('chapter_title'),
        })
      elif type == 'section':
        self.assertIsNotNone(match.group('section_number'))
        self.assertIsNotNone(match.group('section_title'))
        tokens_found.append({
          'number': match.group('section_number'),
          'title': match.group('section_title'),
        })
      else:
        self.fail()

    ds = DocScanner({
      'chapter': r'^Chapter (?P<chapter_number>[0-9]+): (?P<chapter_title>.*)$',
      'section': r'^Section (?P<section_number>[0-9]+\.[0-9]+): (?P<section_title>.*)$',
    }, found_token)
    ds.scan(book)

    self.assertListEqual([
      {'number': '1', 'title': 'Title of Chapter 1'},
      {'number': '1.1', 'title': 'Title of Section 1 of Chapter 1'},
      {'number': '1.2', 'title': 'Title of Section 2 of Chapter 1'},
      {'number': '2', 'title': 'Title of Chapter 2'},
      {'number': '2.1', 'title': 'Title of Section 1 of Chapter 2'},
      {'number': '2.2', 'title': 'Title of Section 2 of Chapter 2'},
    ], tokens_found)
