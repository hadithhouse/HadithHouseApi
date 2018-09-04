"""
This module contains the API views for crawling the different entities of the
application: hadiths, persons, etc.
"""

import dateutil.parser

from rest_framework.response import Response
from rest_framework.views import APIView

from hadiths.exceptions import Http400
from hadiths.models import Hadith
from hadiths.serializers import HadithSerializer

COMMON_FILTER_FIELDS = ('added_by', 'updated_by')
COMMON_ORDERING_FIELDS = ('added_on', 'updated_on')

DEFAULT_COUNT = 10


class HadithCrawlingView(APIView):
    """
    API view for crawling hadiths.
    """

    @staticmethod
    def __parse_count(request):
        if 'count' not in request.query_params:
            return DEFAULT_COUNT
        else:
            try:
                return int(request.query_params['count'])
            except Exception:
                raise Http400('Invalid count.')

    @staticmethod
    def __parse_start_date(request):
        if 'start_date' not in request.query_params:
            return None
        else:
            try:
                return dateutil.parser.parse(
                    request.query_params['start_date'])
            except Exception:
                raise Http400('Invalid date.')

    def get(self, request):
        """
        Implementation of HTTP GET request.
        """

        count = HadithCrawlingView.__parse_count(request)
        start_date = HadithCrawlingView.__parse_start_date(request)

        query = Hadith.objects
        if start_date is not None:
            query = query.filter(updated_on__gte=start_date)
        query = query.order_by('updated_on')
        objects = query.filter()[:count]

        return Response([HadithSerializer(o).data for o in objects])
