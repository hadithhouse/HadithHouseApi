import json
import urlfetch

GRAPH_API_URL = 'https://graph.facebook.com'


def fb_get(path, access_token):
  """
  Retrieves information from Facebook via their Graph API.

  :param path: The path of the Graph API to execute.
  :param access_token: Facebook's access token.
  :return: The result of the API.
  """
  url = '%(graph_url)s/%(path)s?access_token=%(access_token)s' % {
    'graph_url': GRAPH_API_URL,
    'path': path,
    'access_token': access_token
  }
  response = urlfetch.fetch(url, method='GET')
  result = json.loads(response.content.decode('utf-8'))
  if response.status_code != 200:
    raise Exception(result['error']['message'])
  return result


def get_current_user(access_token):
  """
  Retrieves information about the current user.

  :param access_token: Facebook's access token.
  :return: User information.
  """
  return fb_get('me', access_token)
