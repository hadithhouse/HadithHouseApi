# IMPORTANT NOTE: This file contains sensitive information. NEVER commit it
# to the repository, only upload it to the server.

ENVIRONMENT = 'local'


def get_debug():
  if ENVIRONMENT == 'local':
    return True
  else:
    return False


def get_allowed_hosts():
  if ENVIRONMENT == 'local':
    return [
      '*'
    ]
  else:
    # Add the list of domain names where you are hosting the website.
    return [
    ]


def get_fb_appid():
  if ENVIRONMENT == 'local':
    # Development application
    return '<ID for development Facebook App.'
  else:
    # Production application
    return '<ID for production Facebook App.'


def get_db_settings():
  return get_dev_settings()


def get_local_db_settings():
  return {
    'default': {
      'ENGINE': '<mysql.connector.django | django.db.backends.mysql>',
      'NAME': 'HadithHouseLocal',
      'USER': '<The username for your MySQL server>',
      'PASSWORD': '<The password for your username>',
      'HOST': '<The address of your MySQL server>',
      'PORT': '<The port of your MySQL server>',
    }
  }


def get_dev_settings():
  return {
    'default': {
      'ENGINE': '<mysql.connector.django | django.db.backends.mysql>',
      'NAME': 'HadithHouseDev',
      'USER': '<The username for your MySQL server>',
      'PASSWORD': '<The password for your username>',
      'HOST': '<The address of your MySQL server>',
      'PORT': '<The port of your MySQL server>',
    }
  }


def get_log_dir():
  return '<The path to the directory that will contain the log files>'

