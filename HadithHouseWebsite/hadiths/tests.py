from django.test import TestCase

from hadiths.models import Person


class PersonTestCase(TestCase):
  def test_pre_save(self):
    p = Person()
    p.display_name = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.full_name = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.brief_desc ='إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.save()

    self.assertEqual('اختبار ازالة علامات التشكيل', p.simple_display_name, )
    self.assertEqual('اختبار ازالة علامات التشكيل', p.simple_full_name, )
    self.assertEqual('اختبار ازالة علامات التشكيل', p.simple_brief_desc, )

