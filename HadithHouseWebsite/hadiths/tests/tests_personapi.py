from django.test import Client
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_201_CREATED

from hadiths.tests.setup import TestCaseBase


class PersonApiTestCase(TestCaseBase):
  def test__post__no_auth_token__403(self):
    c = Client()
    resp = c.post('/apis/persons', {'full_name': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Couldn't authenticate user.", resp.data['error'])

  def test__post__invalid_auth_token__403(self):
    c = Client()
    resp = c.post('/apis/persons?fb_token=%s' % TestCaseBase.invalid_accesstoken, {'full_name': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Invalid Facebook access token.", resp.data['error'])

  def test__post__valid_auth_token__no_user_permission__401(self):
    c = Client()
    resp = c.post('/apis/persons?fb_token=%s' % TestCaseBase.jack_accesstoken, {'full_name': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("User doesn't have permission for this action.", resp.data['error'])

  def test__post__valid_auth_token__user_permission__no_full_name__400(self):
    c = Client()
    resp = c.post('/apis/persons?fb_token=%s' % TestCaseBase.marie_accesstoken, {})
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
    self.assertEqual("Invalid input.", resp.data['error'])
    self.assertTrue('full_name' in resp.data['detail'])
    self.assertEqual(['This field is required.'], resp.data['detail']['full_name'])

  def test__post__valid_auth_token__user_permission__no_full_name__400(self):
    c = Client()
    resp = c.post('/apis/persons?fb_token=%s' % TestCaseBase.marie_accesstoken, {})
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
    self.assertEqual("Invalid input.", resp.data['error'])
    self.assertTrue('full_name' in resp.data['detail'])
    self.assertEqual(['This field is required.'], resp.data['detail']['full_name'])

  def test__post__valid_auth_token__user_permission__blank_full_name__400(self):
    c = Client()
    resp = c.post('/apis/persons?fb_token=%s' % TestCaseBase.marie_accesstoken, {'full_name': ' '})
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
    self.assertEqual("Invalid input.", resp.data['error'])
    self.assertTrue('full_name' in resp.data['detail'])
    self.assertEqual(['This field may not be blank.'], resp.data['detail']['full_name'])

  def test__post__valid_auth_token__user_permission__valid_full_name__person_added(self):
    c = Client()
    resp = c.post('/apis/persons?fb_token=%s' % TestCaseBase.marie_accesstoken, {'full_name': 'test'})
    self.assertEqual(HTTP_201_CREATED, resp.status_code)
    person = resp.data
    self.assertEqual('test', person['full_name'])

    resp2 = c.get('/apis/persons/%d' % person['id'])
    self.assertEqual(HTTP_200_OK, resp2.status_code)
    person2 = resp2.data
    self.assertEqual(person, person2)
