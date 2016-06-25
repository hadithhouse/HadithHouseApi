#!/bin/bash

# Stops the execution of the script if any command, including pipes, fail.
set -e 
set -o pipefail

# Copy server settings file into the build directory.
# The SERVER_SETTINGS_FILE environment variable should be defined in Jenkins
# after uploading the settings file using the Config File Provider plugin:
# https://wiki.jenkins-ci.org/display/JENKINS/Config+File+Provider+Plugin
echo "Copy server settings  from $SERVER_SETTINGS_PATH to `pwd`/HadithHouseWebsite/server_settings.py"
cp "${SERVER_SETTINGS_PATH}" "HadithHouseWebsite/server_settings.py"

# Install Nodejs packages.
npm install

# Run grunt
./node_modules/.bin/grunt

# Collect Django's static files.
echo "Running manage.py collectstatic to collect static files."
python manage.py collectstatic --noinput

# Running tests...
echo "Running tests..."
python manage.py test