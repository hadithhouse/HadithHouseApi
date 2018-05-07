import json

from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient

from hadiths import fbapi
from hadiths.exceptions import FacebookError, MethodNotConfigured
from hadiths.models import FbUser

ENTITY_TYPES = ('book',
                'hadith',
                'hadithtag',
                'person')


class TestCaseBase(APITestCase):
    setup = False
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
        print('Creating Jack test user. '
              'Jack is a normal user with no permission.')
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
        TestCaseBase.jack_fbuser = FbUser(fb_id=12345,
                                          user=TestCaseBase.jack)
        TestCaseBase.jack_fbuser.save()

        print('Creating Marie test user. '
              'Marie is a superuser with full permission.')
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
        TestCaseBase.marie_fbuser = FbUser(fb_id=67890,
                                           user=TestCaseBase.marie)
        TestCaseBase.marie_fbuser.save()

    @staticmethod
    def mock_fbapi():
        def fb_get_mock(path, access_token):
            if path == 'me':
                if access_token == TestCaseBase.jack_accesstoken:
                    return TestCaseBase.jack_fb_info
                if access_token == TestCaseBase.marie_accesstoken:
                    return TestCaseBase.marie_fb_info
                if access_token == TestCaseBase.invalid_accesstoken:
                    raise FacebookError()
            raise MethodNotConfigured()

        fbapi.fb_get = fb_get_mock

    # noinspection PyPep8Naming
    @classmethod
    def setUpClass(cls):
        if TestCaseBase.setup:
            return
        TestCaseBase.setup = True
        TestCaseBase.create_test_users()
        TestCaseBase.mock_fbapi()
        pass

    # noinspection PyPep8Naming
    @classmethod
    def tearDownClass(cls):
        pass

    def setUp(self):
        self.client = APIClient()

    def get(self, path, **kwargs):
        return self.client.get(path, **kwargs)

    def post(self, path, data, **kwargs):
        return self.client.post(path, json.dumps(data),
                                content_type='application/json',
                                **kwargs)

    def put(self, path, data, **kwargs):
        return self.client.put(path, json.dumps(data),
                               content_type='application/json',
                               **kwargs)

    def patch(self, path, data, **kwargs):
        return self.client.patch(path, json.dumps(data),
                                 content_type='application/json',
                                 **kwargs)

    @staticmethod
    def get_entity_url(entity_type, entity_id, access_token):
        """
        Retrieves the URL of the entity API.
        :param entity_type: The type of the entity, e.g. 'hadith'.
        :param entity_id: If given, returns the entity-specific URL.
        :param access_token: If given, appends the access token to the URL.
        :return: The URL.
        """
        if not entity_type in ENTITY_TYPES:
            raise ValueError('Invalid entity type: ' + str(entity_type))

        if entity_id is not None:
            if access_token is None:
                return '/apis/%ss/%s' % (entity_type, str(entity_id))
            else:
                return '/apis/%ss/%s?fb_token=%s' % (
                    entity_type, str(entity_id), access_token)
        else:
            if access_token is None:
                return '/apis/%ss' % entity_type
            else:
                return '/apis/%ss?fb_token=%s' % (entity_type, access_token)

    def get_entity(self, entity_type, entity_id=None, access_token=None,
                   **kwargs):
        """
        Gets an entity.
        :param entity_type: The type of the entity, e.g. 'hadith'.
        :param entity_id: The ID of entity to get.
        :param access_token: Optional access token.
        :return: The posted entity.
        """
        url = self.get_entity_url(entity_type, entity_id, access_token)
        return self.get(url, **kwargs)

    def post_entity(self, entity_type, entity, access_token=None, **kwargs):
        """
        Posts an entity.
        :param entity_type: The type of the entity, e.g. 'hadith'.
        :param entity: The entity to be posted.
        :param access_token: Optional access token.
        :return: The posted entity.
        """
        url = self.get_entity_url(entity_type, None, access_token)
        return self.post(url, entity, **kwargs)

    def put_entity(self, entity_type, entity, entity_id=None,
                   access_token=None, **kwargs):
        """
        Puts an entity.
        :param entity_type: The type of the entity, e.g. 'hadith'.
        :param entity: The entity to be put.
        :param entity_id: The ID of the entity.
        :param access_token: Optional access token.
        :return: The updated entity.
        """
        url = self.get_entity_url(entity_type, entity_id, access_token)
        return self.put(url, entity, **kwargs)

    def patch_entity(self, entity_type, entity, entity_id=None,
                     access_token=None, **kwargs):
        """
        Patches an entity.
        :param entity_type: The type of the entity, e.g. 'hadith'.
        :param entity: The entity to be patched.
        :param entity_id: The ID of the entity.
        :param access_token: Optional access token.
        :return: The updated entity.
        """
        url = self.get_entity_url(entity_type, entity_id, access_token)
        return self.patch(url, entity, **kwargs)


def add_get_method(entity_type):
    """
    Add an entity-specific get method to the TestCaseBase class.
    :param entity_type: The type of the entity, e.g. 'hadith'.
    """

    def get(self, entity_id=None, access_token=None, **kwargs):
        return self.get_entity(entity_type=entity_type,
                               entity_id=entity_id,
                               access_token=access_token,
                               **kwargs)

    setattr(TestCaseBase, 'get_' + entity_type, get)


def add_post_method(entity_type):
    """
    Add an entity-specific post method to the TestCaseBase class.
    :param entity_type: The type of the entity, e.g. 'hadith'.
    """

    def post(self, entity, access_token=None, **kwargs):
        return self.post_entity(entity_type=entity_type,
                                entity=entity,
                                access_token=access_token,
                                **kwargs)

    setattr(TestCaseBase, 'post_' + entity_type, post)


def add_put_method(entity_type):
    """
    Add an entity-specific put method to the TestCaseBase class.
    :param entity_type: The type of the entity, e.g. 'hadith'.
    """

    def put(self, entity, entity_id=None, access_token=None, **kwargs):
        return self.put_entity(entity_type=entity_type,
                               entity=entity,
                               entity_id=entity_id,
                               access_token=access_token,
                               **kwargs)

    setattr(TestCaseBase, 'put_' + entity_type, put)


def add_patch_method(entity_type):
    """
    Add an entity-specific patch method to the TestCaseBase class.
    :param entity_type: The type of the entity, e.g. 'hadith'.
    """

    def patch(self, entity, entity_id=None, access_token=None, **kwargs):
        return self.patch_entity(entity_type=entity_type,
                                 entity=entity,
                                 entity_id=entity_id,
                                 access_token=access_token,
                                 **kwargs)

    setattr(TestCaseBase, 'patch_' + entity_type, patch)


# Add entity-specific get, post, put, and patch methods to the TestCaseBase
# class
for t in ENTITY_TYPES:
    add_get_method(t)
    add_post_method(t)
    add_put_method(t)
    add_patch_method(t)
