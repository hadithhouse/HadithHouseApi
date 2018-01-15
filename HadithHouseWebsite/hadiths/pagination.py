from rest_framework.pagination import LimitOffsetPagination
from rest_framework.settings import api_settings


class DefaultPagination(LimitOffsetPagination):
    default_limit = api_settings.PAGE_SIZE
    max_limit = 100
