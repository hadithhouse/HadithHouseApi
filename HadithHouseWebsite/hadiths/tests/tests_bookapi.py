from django.test import Client
from rest_framework.status import HTTP_403_FORBIDDEN, HTTP_400_BAD_REQUEST, \
    HTTP_200_OK, HTTP_201_CREATED, \
    HTTP_204_NO_CONTENT

from hadiths.tests.setup import TestCaseBase


class BookApiTestCaseBase(TestCaseBase):
    @staticmethod
    def get_url(book_id, access_token):
        """
        Retrieves the URL of the book API.
        :param book_id: If given, returns the book-specific URL.
        :param access_token: If given, appends the access token to the URL.
        :return: The URL.
        """
        if book_id is not None:
            if access_token is None:
                return '/apis/books/%s' % str(book_id)
            else:
                return '/apis/books/%s?fb_token=%s' % (str(book_id),
                                                       access_token)
        else:
            if access_token is None:
                return '/apis/books'
            else:
                return '/apis/books?fb_token=%s' % access_token

    def post_book(self, book, access_token=None):
        """
        Posts a book.
        :param book: The book to be posted.
        :param access_token: Optional access token.
        :return: The posted book.
        """
        return self.post(self.get_url(None, access_token), book)

    def put_book(self, book, book_id=None, access_token=None):
        """
        Puts a book.
        :param book: The book to be put.
        :param book_id: The ID of the book.
        :param access_token: Optional access token.
        :return: The updated book.
        """
        return self.put(self.get_url(book_id, access_token), book)

    def patch_book(self, book, book_id=None, access_token=None):
        """
        Puts a book.
        :param book: The book to be put.
        :param book_id: The ID of the book.
        :param access_token: Optional access token.
        :return: The updated book.
        """
        return self.patch(self.get_url(book_id, access_token), book)


class BookPostApiTestCase(BookApiTestCaseBase):
    def test__no_auth_token__403(self):
        resp = self.post_book({'title': 'test'})
        self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
        self.assertEqual("Couldn't authenticate user.", resp.data['error'])

    def test__invalid_auth_token__403(self):
        resp = self.post_book({'title': 'test'},
                              TestCaseBase.invalid_accesstoken)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
        self.assertEqual("Invalid Facebook access token.", resp.data['error'])

    def test__valid_auth_token__no_user_permission__401(self):
        access_token = TestCaseBase.jack_accesstoken
        resp = self.post_book({'title': 'test'}, access_token)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
        self.assertEqual("User doesn't have permission for this action.",
                         resp.data['error'])

    def test__valid_auth_token__user_permission__no_title__400(self):
        access_token = TestCaseBase.marie_accesstoken
        resp = self.post_book({}, access_token)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
        self.assertEqual("Invalid input.", resp.data['error'])
        self.assertTrue('title' in resp.data['detail'])
        self.assertEqual(['This field is required.'],
                         resp.data['detail']['title'])

    def test__valid_auth_token__user_permission__blank_title__400(self):
        access_token = TestCaseBase.marie_accesstoken
        resp = self.post_book({'title': ' '}, access_token)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
        self.assertEqual("Invalid input.", resp.data['error'])
        self.assertTrue('title' in resp.data['detail'])
        self.assertEqual(['This field may not be blank.'],
                         resp.data['detail']['title'])

    def test__valid_auth_token__user_permission__valid_title__book_added(
            self):
        access_token = TestCaseBase.marie_accesstoken
        resp = self.post_book({'title': 'test'}, access_token)
        self.assertEqual(HTTP_201_CREATED, resp.status_code)
        book = resp.data
        self.assertEqual('test', book['title'])

        resp2 = self.get('/apis/books/%d' % book['id'])
        self.assertEqual(HTTP_200_OK, resp2.status_code)
        book2 = resp2.data
        self.assertEqual(book, book2)


class BookPutApiTestCase(BookApiTestCaseBase):
    book = None
    book_id = None

    @classmethod
    def setUpClass(cls):
        TestCaseBase.setUpClass()
        # We create a client instead of using self.post/self.put/etc because
        # the latter methods depend on a client defined in the base class
        # which is not yet ready (setup) or has already been destroyed (
        # tearDown)
        c = Client()
        access_token = TestCaseBase.marie_accesstoken
        resp = c.post('/apis/books?fb_token=%s' % access_token,
                      {'title': 'test'})
        assert resp.status_code == HTTP_201_CREATED
        cls.book = resp.data
        cls.book_id = cls.book['id']

    @classmethod
    def tearDownClass(cls):
        # We create a client instead of using self.post/self.put/etc because
        # the latter methods depend on a client defined in the base class
        # which is not yet ready (setup) or has already been destroyed (
        # tearDown)
        c = Client()
        book_id = BookPutApiTestCase.book_id
        access_token = TestCaseBase.marie_accesstoken
        resp = c.delete('/apis/books/%d?fb_token=%s' % (book_id, access_token),
                        {'title': 'test'})
        assert resp.status_code == HTTP_204_NO_CONTENT
        TestCaseBase.tearDownClass()

    def test__no_auth_token__403(self):
        resp = self.put_book({'title': 'test'}, BookPutApiTestCase.book_id)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
        self.assertEqual("Couldn't authenticate user.", resp.data['error'])

    def test__invalid_auth_token__403(self):
        book_id = BookPutApiTestCase.book_id
        access_token = TestCaseBase.invalid_accesstoken
        resp = self.put_book({'title': 'test'}, book_id, access_token)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
        self.assertEqual("Invalid Facebook access token.", resp.data['error'])

    def test__valid_auth_token__no_user_permission__401(self):
        book_id = BookPutApiTestCase.book_id
        access_token = TestCaseBase.jack_accesstoken
        resp = self.put_book({'title': 'test'}, book_id, access_token)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
        self.assertEqual("User doesn't have permission for this action.",
                         resp.data['error'])

    def test__valid_auth_token__user_permission__no_title__400(self):
        book_id = BookPutApiTestCase.book_id
        access_token = TestCaseBase.marie_accesstoken
        resp = self.put_book({}, book_id, access_token)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
        self.assertEqual("Invalid input.", resp.data['error'])
        self.assertTrue('title' in resp.data['detail'])
        self.assertEqual(['This field is required.'],
                         resp.data['detail']['title'])

    def test__valid_auth_token__user_permission__blank_title__400(self):
        book_id = BookPutApiTestCase.book_id
        access_token = TestCaseBase.marie_accesstoken
        resp = self.put_book({'title': ' '}, book_id, access_token)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
        self.assertEqual("Invalid input.", resp.data['error'])
        self.assertTrue('title' in resp.data['detail'])
        self.assertEqual(['This field may not be blank.'],
                         resp.data['detail']['title'])

    def test__valid_auth_token__user_permission__valid_title__book_updated(
            self):
        book_id = BookPutApiTestCase.book_id
        access_token = TestCaseBase.marie_accesstoken
        resp = self.put_book({'title': 'test_updated'}, book_id, access_token)
        self.assertEqual(HTTP_200_OK, resp.status_code)
        book = resp.data
        self.assertEqual('test_updated', book['title'])

        resp2 = self.get('/apis/books/%d' % book['id'])
        self.assertEqual(HTTP_200_OK, resp2.status_code)
        book2 = resp2.data
        self.assertEqual(book, book2)


class BookPatchApiTestCase(BookApiTestCaseBase):
    book = None
    book_id = None

    @classmethod
    def setUpClass(cls):
        TestCaseBase.setUpClass()
        # We create a client instead of using self.post/self.put/etc because
        # the latter methods depend on a client defined in the base class
        # which is not yet ready (setup) or has already been destroyed (
        # tearDown)
        c = Client()
        resp = c.post(
            '/apis/books?fb_token=%s' % TestCaseBase.marie_accesstoken,
            {'title': 'test'})
        assert resp.status_code == HTTP_201_CREATED
        cls.book = resp.data
        cls.book_id = cls.book['id']

    @classmethod
    def tearDownClass(cls):
        # We create a client instead of using self.post/self.put/etc because
        # the latter methods depend on a client defined in the base class
        # which is not yet ready (setup) or has already been destroyed (
        # tearDown)
        c = Client()
        resp = c.delete('/apis/books/%d?fb_token=%s' % (
            BookPatchApiTestCase.book_id, TestCaseBase.marie_accesstoken),
                        {'title': 'test'})
        assert resp.status_code == HTTP_204_NO_CONTENT
        TestCaseBase.tearDownClass()

    def test__no_auth_token__403(self):
        resp = self.patch_book({'title': 'test'}, BookPatchApiTestCase.book_id)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
        self.assertEqual("Couldn't authenticate user.", resp.data['error'])

    def test__invalid_auth_token__403(self):
        book_id = BookPatchApiTestCase.book_id
        access_token = TestCaseBase.invalid_accesstoken
        resp = self.patch_book({'title': 'test'}, book_id, access_token)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
        self.assertEqual("Invalid Facebook access token.", resp.data['error'])

    def test__valid_auth_token__no_user_permission__401(self):
        book_id = BookPatchApiTestCase.book_id
        access_token = TestCaseBase.jack_accesstoken
        resp = self.patch_book({'title': 'test'}, book_id, access_token)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.status_code)
        self.assertEqual(HTTP_403_FORBIDDEN, resp.data['status_code'])
        self.assertEqual("User doesn't have permission for this action.",
                         resp.data['error'])

    def test__valid_auth_token__user_permission__no_title__200(self):
        book_id = BookPatchApiTestCase.book_id
        access_token = TestCaseBase.marie_accesstoken
        resp = self.patch_book({}, book_id, access_token)
        self.assertEqual(HTTP_200_OK, resp.status_code)

    def test__valid_auth_token__user_permission__blank_title__400(self):
        book_id = BookPatchApiTestCase.book_id
        access_token = TestCaseBase.marie_accesstoken
        resp = self.patch_book({'title': ' '}, book_id, access_token)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.status_code)
        self.assertEqual(HTTP_400_BAD_REQUEST, resp.data['status_code'])
        self.assertEqual("Invalid input.", resp.data['error'])
        self.assertTrue('title' in resp.data['detail'])
        self.assertEqual(['This field may not be blank.'],
                         resp.data['detail']['title'])

    def test__valid_auth_token__user_permission__valid_title__book_updated(
        self):
        book_id = BookPatchApiTestCase.book_id
        access_token = TestCaseBase.marie_accesstoken
        resp = self.patch_book({'title': 'test_updated'}, book_id, access_token)
        self.assertEqual(HTTP_200_OK, resp.status_code)
        book = resp.data
        self.assertEqual('test_updated', book['title'])

        resp2 = self.get('/apis/books/%d' % book['id'])
        self.assertEqual(HTTP_200_OK, resp2.status_code)
        book2 = resp2.data
        self.assertEqual(book, book2)
