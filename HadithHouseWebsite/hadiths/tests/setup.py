from django.contrib.auth.models import User
from django.test import TestCase

from hadiths import fbapi
from hadiths.exceptions import FacebookError, MethodNotConfigured
from hadiths.models import FbUser


class TestCaseBase(TestCase):
  invalid_accesstoken = 'aaaaa'
  # Jack
  jack_accesstoken = 'abcde'
  jack = None
  jack_fbuser = None
  jack_fb_info = {
    "id": "12345",
    "first_name": "Jack",
    "gender": "male",
    "last_name": "The Tester",
    "link": "https://www.facebook.com/app_scoped_user_id/12345/",
    "locale": "en_GB",
    "middle_name": "",
    "name": "Jack The Tester",
    "timezone": 0,
    "updated_time": "2016-11-12T09:18:12+0000",
    "verified": True
  }

  # Marie
  marie_accesstoken = 'ghijk'
  marie = None
  marie_fbuser = None
  marie_fb_info = {
    "id": "67890",
    "first_name": "Marie",
    "gender": "female",
    "last_name": "The Tester",
    "link": "https://www.facebook.com/app_scoped_user_id/67890/",
    "locale": "en_GB",
    "middle_name": "",
    "name": "Marie The Tester",
    "timezone": 0,
    "updated_time": "2016-11-12T09:18:12+0000",
    "verified": True
  }

  @staticmethod
  def create_test_users():
    print('Creating Jack test user. Jack is a normal user with no permission.')
    # Jack User object.
    TestCaseBase.jack = User()
    TestCaseBase.jack.username = 'jack'
    TestCaseBase.jack.email = 'jack@hadithhouse.net'
    TestCaseBase.jack.set_password('password')
    TestCaseBase.jack.first_name = 'Jack'
    TestCaseBase.jack.last_name = 'The Tester'
    TestCaseBase.jack.is_staff = False
    TestCaseBase.jack.is_superuser = False
    TestCaseBase.jack.save()
    # Jack FbUser object.
    TestCaseBase.jack_fbuser = FbUser(fb_id=12345, user=TestCaseBase.jack)
    TestCaseBase.jack_fbuser.save()

    print('Creating Marie test user. Marie is a superuser with full permission.')
    # Marie User object.
    TestCaseBase.marie = User()
    TestCaseBase.marie.username = 'Marie'
    TestCaseBase.marie.email = 'marie@hadithhouse.net'
    TestCaseBase.marie.set_password('password')
    TestCaseBase.marie.first_name = 'Marie'
    TestCaseBase.marie.last_name = 'The Tester'
    TestCaseBase.marie.is_staff = True
    TestCaseBase.marie.is_superuser = True
    TestCaseBase.marie.save()
    # Marie FbUser object.
    TestCaseBase.marie_fbuser = FbUser(fb_id=67890, user=TestCaseBase.marie)
    TestCaseBase.marie_fbuser.save()

  @staticmethod
  def mock_fbapi():
    def fb_get_mock(path, access_token):
      if path == 'me' and access_token == TestCaseBase.jack_accesstoken:
        return TestCaseBase.jack_fb_info
      if path == 'me' and access_token == TestCaseBase.marie_accesstoken:
        return TestCaseBase.marie_fb_info
      if path == 'me' and access_token == TestCaseBase.invalid_accesstoken:
        raise FacebookError()
      raise MethodNotConfigured()

    fbapi.fb_get = fb_get_mock

  # noinspection PyPep8Naming
  @classmethod
  def setUpClass(cls):
    TestCaseBase.create_test_users()
    TestCaseBase.mock_fbapi()
    pass

  # noinspection PyPep8Naming
  @classmethod
  def tearDownClass(cls):
    pass
