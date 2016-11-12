from mock import patch

from django.test import Client
from django.test import TestCase
from rest_framework.status import HTTP_403_FORBIDDEN

from hadiths import fbapi
from hadiths.exceptions import MethodNotConfigured, FacebookError


class HadithTagApiTestCase(TestCase):
  def test__post__noauthtoken__403(self):
    c = Client()
    resp = c.post('/apis/hadithtags', {})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Couldn't authenticate user.", resp.data['error'])

  @patch('hadiths.fbapi.fb_get')
  def test__post__invalidauthtoken__403(self, fb_get):
    # Fake a response for an invalid Facebook access token.
    def fb_get_mock(path, access_token):
      if path == 'me' and access_token == '12345':
        raise FacebookError()
      raise MethodNotConfigured()
    fb_get.side_effect = fb_get_mock

    c = Client()
    resp = c.post('/apis/hadithtags?fb_token=12345', {})
    self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
    self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
    self.assertEqual("Invalid Facebook access token.", resp.data['error'])
