"""
Django settings for HadithHouseWebsite project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import socket

import sys

from HadithHouseWebsite.server_settings import get_db_settings, get_debug, get_allowed_hosts, \
  get_log_dir

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '(8rs1@c-&_9z(8ur%ydax^gf-p5)58y%94huyaa2&p1b-%1uwj'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = get_debug()
DJANGO_LOG_LEVEL = DEBUG

ALLOWED_HOSTS = get_allowed_hosts()

PRODUCTION_HOSTS = (
  'www.hadithhouse.net',
)

DEVELOPMENT_HOSTS = (
  'www.hadithhouse-dev.net',
)

def get_environment():
  host = socket.getfqdn().lower()

  if host in PRODUCTION_HOSTS:
    return 'production'
  elif host in DEVELOPMENT_HOSTS:
    return 'development'
  else:
    return 'local'

SERVER_EMAIL = 'noreply@hadithhouse.net'

# Application definition

INSTALLED_APPS = (
  'django.contrib.admin',
  'django.contrib.auth',
  'django.contrib.contenttypes',
  'django.contrib.sessions',
  'django.contrib.messages',
  'django.contrib.staticfiles',
  'rest_framework',
  'hadiths',
)

MIDDLEWARE_CLASSES = (
  'django.contrib.sessions.middleware.SessionMiddleware',
  'django.middleware.common.CommonMiddleware',
  'django.middleware.csrf.CsrfViewMiddleware',
  'django.contrib.auth.middleware.AuthenticationMiddleware',
  'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
  'django.contrib.messages.middleware.MessageMiddleware',
  'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'HadithHouseWebsite.urls'

APPEND_SLASH = False

WSGI_APPLICATION = 'HadithHouseWebsite.wsgi.application'

ADMINS = (
  ('Rafid Al-Humaimidi', 'admin@hadithhouse.net'),
)

# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
# This
if 'test' in sys.argv:
  DATABASES = {
    'default': {
      'ENGINE': 'django.db.backends.sqlite3',
      'NAME': os.path.join(BASE_DIR, 'HadithHouse'),
    }
  }
else:
  DATABASES = get_db_settings()

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
  # Put strings here, like "/home/html/static" or "C:/www/django/static".
  # Always use forward slashes, even on Windows.
  # Don't forget to use absolute paths, not relative paths.
)

TEMPLATES = [
  {
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [
      # insert your TEMPLATE_DIRS here
      os.path.join(BASE_DIR, 'templates'),
    ],
    'APP_DIRS': True,
    'OPTIONS': {
      'context_processors': [
        # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
        # list if you haven't customized them:
        'django.contrib.auth.context_processors.auth',
        'django.template.context_processors.debug',
        'django.template.context_processors.i18n',
        'django.template.context_processors.media',
        'django.template.context_processors.static',
        'django.template.context_processors.tz',
        'django.contrib.messages.context_processors.messages',
      ],
      'debug': get_debug()
    },
  },
]

LOGGING = {
  'version': 1,
  'disable_existing_loggers': False,
  'formatters': {
    'verbose': {
      'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
    },
    'simple': {
      'format': '%(levelname)s %(asctime)s %(message)s'
    },
  },
  'filters': {
    'require_debug_true': {
      '()': 'django.utils.log.RequireDebugTrue',
    },
  },
  'handlers': {
    'django_log_file': {
      'level': 'DEBUG',
      'class': 'logging.handlers.TimedRotatingFileHandler',
      'filename': os.path.join(get_log_dir(), 'django.log'),
      'when': 'D',
      'interval': 1,
      'backupCount': 30,
      'utc': True,
      'formatter': 'simple',
      'encoding': 'utf-8'
    },
    'django_requests_log_file': {
      'level': 'DEBUG',
      'class': 'logging.handlers.TimedRotatingFileHandler',
      'filename': os.path.join(get_log_dir(), 'django.request.log'),
      'when': 'D',
      'interval': 1,
      'backupCount': 30,
      'utc': True,
      'formatter': 'simple',
      'encoding': 'utf-8'
    },
    'django_db_backends_log_file': {
      'level': 'DEBUG',
      'class': 'logging.handlers.TimedRotatingFileHandler',
      'filename': os.path.join(get_log_dir(), 'django.db.backends.log'),
      'when': 'D',
      'interval': 1,
      'backupCount': 30,
      'utc': True,
      'formatter': 'simple',
      'encoding': 'utf-8'
    },
    'mail_admins': {
      'level': 'ERROR',
      'class': 'django.utils.log.AdminEmailHandler'
    }
  },
  'loggers': {
    'django': {
      'handlers': ['django_log_file'],
      'propagate': True,
    },
    'django.request': {
      'handlers': ['django_requests_log_file', 'mail_admins'],
      'level': 'ERROR',
      'propagate': False,
    },
    'django.db.backends': {
      'level': 'DEBUG',
      'handlers': ['django_db_backends_log_file'],
      'propagate': False,
    },
  }
}

REST_FRAMEWORK = {
  'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',),
  'DEFAULT_PAGINATION_CLASS': 'hadiths.pagination.DefaultPagination',
  'PAGE_SIZE': 10,
  'DEFAULT_AUTHENTICATION_CLASSES': (
    'hadiths.auth.FacebookAuthentication',
  )
}

OFFLINE_MODE = False

if OFFLINE_MODE:
  REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = ('hadiths.auth.FacebookOfflineAuthentication',)
