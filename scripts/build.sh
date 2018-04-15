#!/bin/bash

source "scripts/base.sh"

# Copy server settings file into the build directory.
# The SERVER_SETTINGS_PATH environment variable should be defined in Jenkins
# after uploading the settings file using the Config File Provider plugin:
# https://wiki.jenkins-ci.org/display/JENKINS/Config+File+Provider+Plugin
if [[ -z ${SERVER_SETTINGS_PATH} ]]; then
  log_error 'Environment variable SERVER_SETTINGS_PATH is not defined.'
  exit 1
fi

log "Copy server settings from ${SERVER_SETTINGS_PATH} to `pwd`/HadithHouseApi/server_settings.py ..."
cp "${SERVER_SETTINGS_PATH}" "HadithHouseApi/server_settings.py"

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

log "Deactivate Python's virtual environment..."
deactivate
