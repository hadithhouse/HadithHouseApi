#!/bin/bash

SERVER_SETTINGS_PATH='/home/jenkins'
DEPLOYMENT_PATH='/var/www/hadithhouse'
LOGS_PATH='/var/log/hadithhouse'

# Stops the execution of the script if any command, including pipes, fail.
set -e 
set -o pipefail

# Deleting the current files in the deployment directory.
echo "Deleting ${DEPLOYMENT_PATH}"
rm -rf ${DEPLOYMENT_PATH}/*

# Create the logs directory if it is not created
echo "Creating the logs directory if it is not created"
mkdir -p $LOGS_PATH

# Copy server settings file into te build directory.
echo "Copy server_settings.py from $SERVER_SETTINGS_PATH to `pwd`/HadithHouseWebsite/"
cp ${SERVER_SETTINGS_PATH}/server_settings.py HadithHouseWebsite/

# Collect Django's static files.
echo "Running manage.py collectstatic to collect static files."
python manage.py collectstatic --noinput

# Apply Django's migrations.
echo "Running manage.py migrate to apply migrations."
python manage.py migrate

# Creating directory $DEPLOYMENT_PATH if it is not created.
echo "Creating directory $DEPLOYMENT_PATH if it is not created."
mkdir -p $DEPLOYMENT_PATH

# Copy the project onto the deployment directory.
echo "Copying `pwd`/* to $DEPLOYMENT_PATH"
cp -r ./* ${DEPLOYMENT_PATH}/

# Give Apache2 ownership of the log files so it can write to them.
echo "Give Apache2 ownership of the log files so it can write to them."
chown www-data /var/log/hadithhouse/*

# Restart Apache2 server.
echo "Restarting Apache2 server"
service apache2 restart

