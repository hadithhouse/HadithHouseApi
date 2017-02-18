from django.test import Client
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_201_CREATED, \
  HTTP_204_NO_CONTENT

from hadiths.tests.setup import TestCaseBase


class BookPostApiTestCase(TestCaseBase):
  def test__post__no_auth_token__403(self):
    resp = self.post('/apis/books', {'title': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Couldn't authenticate user.", resp.data['error'])

  def test__post__invalid_auth_token__403(self):
    resp = self.post('/apis/books?fb_token=%s' % TestCaseBase.invalid_accesstoken, {'title': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Invalid Facebook access token.", resp.data['error'])

  def test__post__valid_auth_token__no_user_permission__401(self):
    resp = self.post('/apis/books?fb_token=%s' % TestCaseBase.jack_accesstoken, {'title': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("User doesn't have permission for this action.", resp.data['error'])

  def test__post__valid_auth_token__user_permission__no_title__400(self):
    resp = self.post('/apis/books?fb_token=%s' % TestCaseBase.marie_accesstoken, {})
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
    self.assertEqual("Invalid input.", resp.data['error'])
    self.assertTrue('title' in resp.data['detail'])
    self.assertEqual(['This field is required.'], resp.data['detail']['title'])

  def test__post__valid_auth_token__user_permission__blank_title__400(self):
    resp = self.post('/apis/books?fb_token=%s' % TestCaseBase.marie_accesstoken, {'title': ' '})
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
    self.assertEqual("Invalid input.", resp.data['error'])
    self.assertTrue('title' in resp.data['detail'])
    self.assertEqual(['This field may not be blank.'], resp.data['detail']['title'])

  def test__post__valid_auth_token__user_permission__valid_title__book_added(self):
    resp = self.post('/apis/books?fb_token=%s' % TestCaseBase.marie_accesstoken, {'title': 'test'})
    self.assertEqual(HTTP_201_CREATED, resp.status_code)
    book = resp.data
    self.assertEqual('test', book['title'])

    resp2 = self.get('/apis/books/%d' % book['id'])
    self.assertEqual(HTTP_200_OK, resp2.status_code)
    book2 = resp2.data
    self.assertEqual(book, book2)


class BookPutApiTestCase(TestCaseBase):
  book = None
  book_id = None

  @classmethod
  def setUpClass(cls):
    TestCaseBase.setUpClass()
    c = Client()
    resp = c.post('/apis/books?fb_token=%s' % TestCaseBase.marie_accesstoken, {'title': 'test'})
    assert resp.status_code == HTTP_201_CREATED
    cls.book = resp.data
    cls.book_id = cls.book['id']

  @classmethod
  def tearDownClass(cls):
    c = Client()
    resp = c.delete('/apis/books/%d?fb_token=%s' % (BookPutApiTestCase.book_id, TestCaseBase.marie_accesstoken),
                    {'title': 'test'})
    assert resp.status_code == HTTP_204_NO_CONTENT
    TestCaseBase.tearDownClass()

  def test__put__no_auth_token__403(self):
    resp = self.put('/apis/books/%d' % BookPutApiTestCase.book_id, {'title': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Couldn't authenticate user.", resp.data['error'])

  def test__put__invalid_auth_token__403(self):
    resp = self.put('/apis/books/%d?fb_token=%s' % (BookPutApiTestCase.book_id, TestCaseBase.invalid_accesstoken),
                    {'title': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Invalid Facebook access token.", resp.data['error'])

  def test__put__valid_auth_token__no_user_permission__401(self):
    resp = self.put('/apis/books/%d?fb_token=%s' % (BookPutApiTestCase.book_id, TestCaseBase.jack_accesstoken),
                    {'title': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("User doesn't have permission for this action.", resp.data['error'])

  def test__put__valid_auth_token__user_permission__no_title__400(self):
    resp = self.put('/apis/books/%d?fb_token=%s' % (BookPutApiTestCase.book_id, TestCaseBase.marie_accesstoken), {})
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
    self.assertEqual("Invalid input.", resp.data['error'])
    self.assertTrue('title' in resp.data['detail'])
    self.assertEqual(['This field is required.'], resp.data['detail']['title'])

  def test__put__valid_auth_token__user_permission__blank_title__400(self):
    resp = self.put('/apis/books/%d?fb_token=%s' % (BookPutApiTestCase.book_id, TestCaseBase.marie_accesstoken),
                    {'title': ' '})
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
    self.assertEqual("Invalid input.", resp.data['error'])
    self.assertTrue('title' in resp.data['detail'])
    self.assertEqual(['This field may not be blank.'], resp.data['detail']['title'])

  def test__put__valid_auth_token__user_permission__valid_title__book_updated(self):
    resp = self.put('/apis/books/%d?fb_token=%s' % (BookPutApiTestCase.book_id, TestCaseBase.marie_accesstoken),
                    {'title': 'test_updated'})
    self.assertEqual(HTTP_200_OK, resp.status_code)
    book = resp.data
    self.assertEqual('test_updated', book['title'])

    resp2 = self.get('/apis/books/%d' % book['id'])
    self.assertEqual(HTTP_200_OK, resp2.status_code)
    book2 = resp2.data
    self.assertEqual(book, book2)


class BookPatchApiTestCase(TestCaseBase):
  book = None
  book_id = None

  @classmethod
  def setUpClass(cls):
    TestCaseBase.setUpClass()
    c = Client()
    resp = c.post('/apis/books?fb_token=%s' % TestCaseBase.marie_accesstoken, {'title': 'test'})
    assert resp.status_code == HTTP_201_CREATED
    cls.book = resp.data
    cls.book_id = cls.book['id']

  @classmethod
  def tearDownClass(cls):
    c = Client()
    resp = c.delete('/apis/books/%d?fb_token=%s' % (BookPatchApiTestCase.book_id, TestCaseBase.marie_accesstoken),
                    {'title': 'test'})
    assert resp.status_code == HTTP_204_NO_CONTENT
    TestCaseBase.tearDownClass()

  def test__patch__no_auth_token__403(self):
    resp = self.patch('/apis/books/%d' % BookPatchApiTestCase.book_id, {'title': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Couldn't authenticate user.", resp.data['error'])

  def test__patch__invalid_auth_token__403(self):
    resp = self.patch('/apis/books/%d?fb_token=%s' % (BookPatchApiTestCase.book_id, TestCaseBase.invalid_accesstoken),
                      {'title': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Invalid Facebook access token.", resp.data['error'])

  def test__patch__valid_auth_token__no_user_permission__401(self):
    resp = self.patch('/apis/books/%d?fb_token=%s' % (BookPatchApiTestCase.book_id, TestCaseBase.jack_accesstoken),
                      {'title': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("User doesn't have permission for this action.", resp.data['error'])

  def test__patch__valid_auth_token__user_permission__no_title__200(self):
    resp = self.patch('/apis/books/%d?fb_token=%s' % (BookPatchApiTestCase.book_id, TestCaseBase.marie_accesstoken), {})
    self.assertEqual(HTTP_200_OK, resp.status_code)

  def test__patch__valid_auth_token__user_permission__blank_title__400(self):
    resp = self.patch('/apis/books/%d?fb_token=%s' % (BookPatchApiTestCase.book_id, TestCaseBase.marie_accesstoken),
                      {'title': ' '})
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
    self.assertEqual("Invalid input.", resp.data['error'])
    self.assertTrue('title' in resp.data['detail'])
    self.assertEqual(['This field may not be blank.'], resp.data['detail']['title'])

  def test__patch__valid_auth_token__user_permission__valid_title__book_updated(self):
    resp = self.patch('/apis/books/%d?fb_token=%s' % (BookPatchApiTestCase.book_id, TestCaseBase.marie_accesstoken),
                      {'title': 'test_updated'})
    self.assertEqual(HTTP_200_OK, resp.status_code)
    book = resp.data
    self.assertEqual('test_updated', book['title'])

    resp2 = self.get('/apis/books/%d' % book['id'])
    self.assertEqual(HTTP_200_OK, resp2.status_code)
    book2 = resp2.data
    self.assertEqual(book, book2)
