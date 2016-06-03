# -*- coding: utf-8 -*-

from django.test import TestCase

from hadiths.models import Person, Book, BookVolume, BookChapter, BookSection, HadithTag, Hadith


class PersonTestCase(TestCase):
  def test_pre_save(self):
    p = Person()
    p.display_name = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.full_name = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.brief_desc = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.save()

    self.assertEqual(u'اختبار ازالة علامات التشكيل', p.simple_display_name)
    self.assertEqual(u'اختبار ازالة علامات التشكيل', p.simple_full_name)
    self.assertEqual(u'اختبار ازالة علامات التشكيل', p.simple_brief_desc)


class BookTestCase(TestCase):
  def test_pre_save(self):
    b = Book()
    b.title = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    b.brief_desc = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    b.save()

    bv = BookVolume()
    bv.number = 1
    bv.title = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    bv.book = b
    bv.save()

    bc = BookChapter()
    bc.number = 1
    bc.title = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    bc.book = b
    bc.save()

    bs = BookSection()
    bs.number = 1
    bs.title = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    bs.book = b
    bs.save()

    self.assertEqual(u'اختبار ازالة علامات التشكيل', b.simple_title)
    self.assertEqual(u'اختبار ازالة علامات التشكيل', b.simple_brief_desc)

    self.assertEqual(u'اختبار ازالة علامات التشكيل', bv.simple_title)

    self.assertEqual(u'اختبار ازالة علامات التشكيل', bc.simple_title)

    self.assertEqual(u'اختبار ازالة علامات التشكيل', bs.simple_title)


class HadithTagTestCase(TestCase):
  def test_pre_save(self):
    p = HadithTag()
    p.name = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.save()

    self.assertEqual(u'اختبار ازالة علامات التشكيل', p.simple_name)


class HadithTestCase(TestCase):
  def test_pre_save(self):
    p = Hadith()
    p.text = u'إخْتِبار إزَاْلة عَلامات التَشْكيل'
    p.save()

    self.assertEqual(u'اختبار ازالة علامات التشكيل', p.simple_text)
