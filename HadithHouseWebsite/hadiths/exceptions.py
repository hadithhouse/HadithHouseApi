"""
This module contains exceptions using throughout the hadiths Django application.
"""


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
