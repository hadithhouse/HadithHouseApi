from django.test import TestCase
from django.test.testcases import SimpleTestCase

from textprocessing.arabic import remove_arabic_diacritics, unify_alef_letters
from textprocessing.generic import multiline_to_singleline, remove_brackets_whitespaces, reformat_text
from textprocessing.regex import DocScanner


class GenericTestCase(SimpleTestCase):
  def test_multiline_to_singleline(self):
    input = 'My name is \n  Rafid \r Khalid'
    output = multiline_to_singleline(input)
    self.assertEqual('My name is Rafid Khalid', output)

  def test_remove_brackets_whitespaces(self):
    input = 'This is a text with (  incorrect whitespaces between brackets   ).'
    output = remove_brackets_whitespaces(input)
    self.assertEqual('This is a text with (incorrect whitespaces between brackets).', output)

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
أَخْبَرَنَا أَبُو جَعْفَرٍ مُحَمَّدُ بْنُ يَعْقُوبَ قَالَ حَدَّثَنِي عِدَّةٌ مِنْ أَصْحَابِنَا مِنْهُمْ مُحَمَّدُ بْنُ يَحْيَى الْعَطَّارُ عَنْ أَحْمَدَ بْنِ مُحَمَّدٍ عَنِ الْحَسَنِ بْنِ مَحْبُوبٍ عَنِ الْعَلَاءِ بْنِ رَزِينٍ عَنْ مُحَمَّدِ بْنِ مُسْلِمٍ عَنْ أَبِي جَعْفَرٍ (عليه السلام)قَالَ لَمَّا خَلَقَ اللَّهُ الْعَقْلَ اسْتَنْطَقَهُ ثُمَّ قَالَ لَهُ أَقْبِلْ فَأَقْبَلَ ثُمَّ قَالَ لَهُ أَدْبِرْ فَأَدْبَرَ ثُمَّ قَالَ وَ عِزَّتِي وَ جَلَالِي مَا خَلَقْتُ خَلْقاً هُوَ أَحَبُّ إِلَيَّ مِنْكَ وَ لَا أَكْمَلْتُكَ إِلَّا فِيمَنْ أُحِبُّ أَمَا إِنِّي إِيَّاكَ آمُرُ وَ إِيَّاكَ أَنْهَى وَ إِيَّاكَ أُعَاقِبُ وَ إِيَّاكَ أُثِيبُ .
    '''.strip()
    self.assertEqual(expected, output)


class ArabicTestCase(SimpleTestCase):
  def test_remove_arabic_diacritic(self):
    input = 'اخْتِبار ازَاْلة عَلامات التَشْكيل'
    output = remove_arabic_diacritics(input)
    self.assertEqual('اختبار ازالة علامات التشكيل', output)

  def test_unify_alef_letters(self):
    input = 'اآأإٱٲٳٵ'
    output = unify_alef_letters(input)
    self.assertEqual('اااااااا', output)


class DocumentScannerTestCase(SimpleTestCase):
  def test_scan_bullet_points(self):
    numbers_found = []

    def found_number(type, prev_type, match, prev_match, document):
      self.assertEqual('number', type)
      self.assertIsNotNone(match.group('number_value'))
      numbers_found.append(match.group('number_value'))

    document = '1. First bullet point 2. Second bullet point'

    ds = DocScanner({
      'number': r'(?P<number_value>[0-9]+)\.'
    }, found_number)
    ds.scan(document)

    self.assertEqual(['1', '2'], numbers_found)