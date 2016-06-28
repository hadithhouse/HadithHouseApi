#!/bin/bash

error() {
  local line_lo="$1"
  local message="$2"
  local code="${3:-1}"
  if [[ -n "$message" ]] ; then
    echo "build.sh experienced an error on line ${line_lo}: ${message}; exiting with status ${code}"
  else
    echo "build.sh experienced an error on line ${line_lo}; exiting with status ${code}"
  fi
  
  exit 1
}

# Stops the execution of the script if any command, including pipes, fail.
set -e
set -o pipefail
trap 'error ${LINENO}' ERR

# Copy server settings file into the build directory.
# The SERVER_SETTINGS_FILE environment variable should be defined in Jenkins
# after uploading the settings file using the Config File Provider plugin:
# https://wiki.jenkins-ci.org/display/JENKINS/Config+File+Provider+Plugin
echo "Copy server settings  from $SERVER_SETTINGS_PATH to `pwd`/HadithHouseWebsite/server_settings.py ..."
cp "${SERVER_SETTINGS_PATH}" "HadithHouseWebsite/server_settings.py"

# Install Nodejs modules.
echo "Install NodeJS modules..."
npm install

# Run grunt
echo "Run Grunt..."
./node_modules/.bin/grunt

# Remove Node modules and delete TypeScript cache (.tscache)
echo "Remove NodeJS modules and delete TypeScript cache (.tscache)..."
rm -rf node_modules/
rm -rf .tscache/

# Install and activate a Python virtual environment.
echo "Install and activate a Python virtual environment..."
virtualenv --python=python2.7 venv
source venv/bin/activate

echo "Install Python packages in requirements.txt..."
pip install -r requirements.txt

# Collect Django's static files.
echo "Running 'manage.py collectstatic' to collect static files."
python manage.py collectstatic --noinput

# Running tests...
echo "Running tests..."
python manage.py test

echo "Deactivate Python's virtual environment and delete it..."
deactivate
rm -rf venv
