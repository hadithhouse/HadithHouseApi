import urlfetch
import json

GRAPH_API_URL = 'https://graph.facebook.com'

def fb_get(path, access_token):
    url = '%(graph_url)s/%(path)s?access_token=%(access_token)s' % {
        'graph_url': GRAPH_API_URL,
        'path': path,
        'access_token': access_token
    }
    response = urlfetch.fetch(url, method='GET')
    result = json.loads(response.content)
    if response.status_code != 200:
        raise Exception(result['error']['message'])
    return result


def get_user_info(access_token):
    return fb_get('me', access_token)
