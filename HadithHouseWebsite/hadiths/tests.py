from django.test import TestCase

from hadiths.models import Person


class PersonTestCase(TestCase):
  def test_pre_save(self):
    p = Person()
    p.display_name = 'رافِد'
    p.full_name = 'رافِد خالِد'
    p.brief_desc = 'مُبَرْمِج'
    p.save()

    self.assertEqual(p.simple_display_name, 'رافد')
    self.assertEqual(p.simple_full_name, 'رافد خالد')
    self.assertEqual(p.simple_brief_desc, 'مبرمج')
