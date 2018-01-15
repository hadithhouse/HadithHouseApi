import json

import urlfetch

from HadithHouseWebsite.settings import is_test_mode
from hadiths.exceptions import FacebookError

GRAPH_API_URL = 'https://graph.facebook.com'


def get_fb_graph_url(api, access_token):
    return '%(graph_url)s/%(path)s?access_token=%(access_token)s' % {
        'graph_url': GRAPH_API_URL,
        'path': api,
        'access_token': access_token
    }


if not is_test_mode():
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
else:
    def fb_get(_api, _access_token):
        """
        In test mode, requests to Facebook cannot be made and should be
        mocked.

        :param _api: Unused
        :param _access_token: Unused
        """
        raise RuntimeError(
            'fb_get() method cannot be called during test. Please mock it.')


def get_current_user(access_token):
    """
    Retrieves information about the current user.

    :param access_token: Facebook's access token.
    :return: User information.
    """
    try:
        return fb_get('me', access_token)
    except FacebookError:
        # This could either be the authentication token is invalid, or there is
        # a problem communicating with Facebook. In both cases, we return None
        # as we couldn't authenticate the user.
        return None
