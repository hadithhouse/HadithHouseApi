from django.test import TestCase
from django.test.testcases import SimpleTestCase

from textprocessing.generic import multiline_to_singleline


class GenericTestCase(SimpleTestCase):
  def test_multiline_to_singleline(self):
    input = 'My name is   Rafid  Khalid'
    output = multiline_to_singleline(input)
    self.assertEqual(output, 'My name is Rafid Khalid')
