#!/bin/bash

log_error() {
  local msg="$1"
  RED='\033[0;31m'
  NC='\033[0m' # No Color
  echo -e "${RED}${msg}${NC}"
}

log() {
  local msg="$1"
  echo "${msg}"
}

on_error() {
  local line_lo="$1"
  local message="$2"
  local code="${3:-1}"
  if [[ -n "${message}" ]] ; then
    log_error "build.sh experienced an error on line ${line_lo}: ${message}; exiting with status ${code}"
  else
    log_error "build.sh experienced an error on line ${line_lo}; exiting with status ${code}"
  fi

  exit 1
}

# Stops the execution of the script if any command, including pipes, fail.
set -e
set -o pipefail
trap 'on_error ${LINENO}' ERR

# Copy server settings file into the build directory.
# The SERVER_SETTINGS_PATH environment variable should be defined in Jenkins
# after uploading the settings file using the Config File Provider plugin:
# https://wiki.jenkins-ci.org/display/JENKINS/Config+File+Provider+Plugin
if [[ -z ${SERVER_SETTINGS_PATH} ]]; then
  log_error 'Environment variable SERVER_SETTINGS_PATH is not defined.'
  exit 1
fi

log "Copy server settings from ${SERVER_SETTINGS_PATH} to `pwd`/HadithHouseWebsite/server_settings.py ..."
cp "${SERVER_SETTINGS_PATH}" "HadithHouseWebsite/server_settings.py"

# Install NodeJS modules.
log "Install NodeJS modules..."
npm install --production

# MomentJS does not have a @types module which is required by TypeScript, because the definition file
# is included with the package itself, so we create a folder for moment under @types and copy
# the definitions file to it, after renaming it to index.d.ts.
if [[ -d node_modules/@types/moment ]]; then
  rm -rf node_modules/@types/moment
fi
mkdir node_modules/@types/moment
cp node_modules/moment/moment.d.ts node_modules/@types/moment/index.d.ts

# Run grunt
log "Run Grunt..."
./node_modules/.bin/grunt

# Remove Node modules and delete TypeScript cache (.tscache)
log "Remove NodeJS modules and delete TypeScript cache (.tscache)..."
rm -rf node_modules/
rm -rf .tscache/

# Install and activate a Python virtual environment.
log "Install and activate a Python virtual environment..."
virtualenv --python=python3.6 venv
source venv/bin/activate

log "Install Python packages in requirements.txt..."
python -m pip install -r requirements.txt

# Collect Django's static files.
log "Running 'manage.py collectstatic' to collect static files."
python manage.py collectstatic --noinput

# Running tests...
log "Running tests..."
python manage.py test

# Pylint
log "Running pylint to ensure code quality..."
pylint --load-plugins pylint_django \
  hadiths/apiviews.py \
  hadiths/auth.py \
  hadiths/exceptions.py \
  hadiths/fbapi.py \
  hadiths/fbauthapiviews.py \
  hadiths/filters.py \
  hadiths/models.py \
  hadiths/pagination.py \
  hadiths/urls.py \
  hadiths/views.py

log "Deactivate Python's virtual environment and delete it..."
deactivate
rm -rf venv
