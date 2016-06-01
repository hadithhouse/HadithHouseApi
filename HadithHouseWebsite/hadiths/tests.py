from django.test import TestCase

from hadiths.models import Person, Book, BookVolume, BookChapter, BookSection, HadithTag, Hadith


class PersonTestCase(TestCase):
  def test_pre_save(self):
    p = Person()
    p.display_name = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.full_name = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.brief_desc = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.save()

    self.assertEqual('اختبار ازالة علامات التشكيل', p.simple_display_name)
    self.assertEqual('اختبار ازالة علامات التشكيل', p.simple_full_name)
    self.assertEqual('اختبار ازالة علامات التشكيل', p.simple_brief_desc)


class BookTestCase(TestCase):
  def test_pre_save(self):
    b = Book()
    b.title = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    b.brief_desc = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    b.save()

    bv = BookVolume()
    bv.number = 1
    bv.title = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    bv.book = b
    bv.save()

    bc = BookChapter()
    bc.number = 1
    bc.title = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    bc.book = b
    bc.save()

    bs = BookSection()
    bs.number = 1
    bs.title = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    bs.book = b
    bs.save()

    self.assertEqual('اختبار ازالة علامات التشكيل', b.simple_title)
    self.assertEqual('اختبار ازالة علامات التشكيل', b.simple_brief_desc)

    self.assertEqual('اختبار ازالة علامات التشكيل', bv.simple_title)

    self.assertEqual('اختبار ازالة علامات التشكيل', bc.simple_title)

    self.assertEqual('اختبار ازالة علامات التشكيل', bs.simple_title)


class HadithTagTestCase(TestCase):
  def test_pre_save(self):
    p = HadithTag()
    p.name = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.save()

    self.assertEqual('اختبار ازالة علامات التشكيل', p.simple_name)


class HadithTestCase(TestCase):
  def test_pre_save(self):
    p = Hadith()
    p.text = 'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.save()

    self.assertEqual('اختبار ازالة علامات التشكيل', p.simple_text)
