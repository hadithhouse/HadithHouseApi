"""
This module contains exceptions using throughout the hadiths Django application.
"""
from rest_framework.exceptions import APIException
from rest_framework.status import HTTP_400_BAD_REQUEST


class FacebookError(Exception):
    """
    Raised when there is a problem communicating with Facebook.
    """

    pass


class MethodNotConfigured(Exception):
    """
    Raise by test mock objects to indicate that a certain method is not
    configured. This is useful to ensure that methods used in tests are
    mocked.
    """
    pass


class Http400(APIException):
    """
    Raised when there is a problem with the input.
    """
    status_code = HTTP_400_BAD_REQUEST
    default_detail = 'Invalid input'
