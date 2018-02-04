"""
Contains pagination classes for use with API views.
"""

from rest_framework.pagination import LimitOffsetPagination
from rest_framework.settings import api_settings


class DefaultPagination(LimitOffsetPagination):
    """
    Put a default maximum limit of 100 on the number of records that can be
    returned by the API views. This acts like a security measure to disallow
    queries that can potentially return large result set, thus increase the
    load on the server.
    """
    default_limit = api_settings.PAGE_SIZE
    max_limit = 100
