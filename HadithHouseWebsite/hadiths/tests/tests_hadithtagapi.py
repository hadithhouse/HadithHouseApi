from django.test import Client
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST

from hadiths.tests.setup import TestCaseBase


class HadithTagApiTestCase(TestCaseBase):
  def test__post__no_auth_token__403(self):
    c = Client()
    resp = c.post('/apis/hadithtags', {'name': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Couldn't authenticate user.", resp.data['error'])

  def test__post__invalid_auth_token__403(self):
    c = Client()
    resp = c.post('/apis/hadithtags?fb_token=%s' % TestCaseBase.invalid_accesstoken, {'name': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Invalid Facebook access token.", resp.data['error'])

  def test__post__valid_auth_token__no_user_permission__401(self):
    c = Client()
    resp = c.post('/apis/hadithtags?fb_token=%s' % TestCaseBase.jack_accesstoken, {'name': 'test'})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("User doesn't have permission for this action.", resp.data['error'])

  def test__post__valid_auth_token__user_permission__no_name__400(self):
    c = Client()
    resp = c.post('/apis/hadithtags?fb_token=%s' % TestCaseBase.marie_accesstoken, {})
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
    self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
    self.assertEqual("Invalid input.", resp.data['error'])
    self.assertTrue('name' in resp.data['detail'])
    self.assertEqual(['This field is required.'], resp.data['detail']['name'])
