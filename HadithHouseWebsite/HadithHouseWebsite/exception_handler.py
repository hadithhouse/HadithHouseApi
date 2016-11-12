from rest_framework.views import exception_handler


def hadithhouse_exception_handler(ex, context):
  response = exception_handler(ex, context)
  if response is not None:
    response.data['status_code'] = response.status_code
    response.data['error'] = response.data['detail']
    del response.data['detail']

  return response
