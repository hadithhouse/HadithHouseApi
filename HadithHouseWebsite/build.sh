#!/bin/bash

SERVER_SETTINGS_PATH='/home/jenkins'
LOGS_PATH='/var/log/hadithhouse'

# Stops the execution of the script if any command, including pipes, fail.
set -e 
set -o pipefail

# Create the logs directory if it is not created
echo "Creating the logs directory if it is not created"
mkdir -p $LOGS_PATH

# Copy server settings file into te build directory.
echo "Copy server_settings.py from $SERVER_SETTINGS_PATH to `pwd`/HadithHouseWebsite/"
cp ${SERVER_SETTINGS_PATH}/server_settings.py HadithHouseWebsite/

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