import json
import urlfetch

GRAPH_API_URL = 'https://graph.facebook.com'


# TODO: Consider moving this exception somewhere else.
class FacebookError(Exception):
  """
  Raised when there is a problem communicating with Facebook.
  """
  pass


def get_fb_graph_url(api, access_token):
  return '%(graph_url)s/%(path)s?access_token=%(access_token)s' % {
    'graph_url': GRAPH_API_URL,
    'path': api,
    'access_token': access_token
  }


def fb_get(path, access_token):
  """
  Retrieves information from Facebook via their Graph API.

  :param path: The path of the Graph API to execute.
  :param access_token: Facebook's access token.
  :return: The result of the API.
  """
  url = get_fb_graph_url(path, access_token)
  response = urlfetch.fetch(url, method='GET')
  result = json.loads(response.content.decode('utf-8'))
  if response.status_code != 200:
    raise FacebookError(result['error']['message'])
  return result


def get_current_user(access_token):
  """
  Retrieves information about the current user.

  :param access_token: Facebook's access token.
  :return: User information.
  """
  try:
    return fb_get('me', access_token)
  except FacebookError:
    # This could either be the authentication token is invalid, or there is a problem
    # communicating with Facebook. In both cases, we return None as we couldn't
    # authenticate the user.
    return None
