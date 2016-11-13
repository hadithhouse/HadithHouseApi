from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler


def hadithhouse_exception_handler(ex, context):
  if isinstance(ex, ValidationError):
    headers = {}
    if getattr(ex, 'auth_header', None):
      headers['WWW-Authenticate'] = ex.auth_header
    if getattr(ex, 'wait', None):
      headers['Retry-After'] = '%d' % ex.wait
    return Response({
      'status_code': ex.status_code,
      'error': 'Invalid input.',
      'detail': ex.detail
    }, status=ex.status_code, headers=headers)
  else:
    response = exception_handler(ex, context)
    if response is not None:
      response.data['status_code'] = response.status_code
      if 'detail' in response.data:
        response.data['error'] = response.data['detail']
        del response.data['detail']
    return response
