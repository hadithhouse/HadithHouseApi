#!/bin/bash

SERVER_SETTINGS_PATH='/home/jenkins'
DEPLOYMENT_PATH='/var/www/HadithHouseWebsite'

# Stops the execution of the script if any command, including pipes, fail.
set -e 
set -o pipefail

# Deleting the current files in the deployment directory.
echo "Deleting ${DEPLOYMENT_PATH}"
rm -rf ${DEPLOYMENT_PATH}/*

# Copy server settings file into te build directory.
echo "Copy server_settings.py from $SERVER_SETTINGS_PATH to `pwd`/HadithHouseWebsite/"
cp ${SERVER_SETTINGS_PATH}/server_settings.py HadithHouseWebsite/

# Collect Django's static files.
echo "Running manage.py collectstatic to collect static files."
python manage.py collectstatic --noinput

# Apply Django's migrations.
echo "Running manage.py migrate to apply migrations."
python manage.py migrate

# Copy the project onto the deployment directory.
echo "Copying `pwd`/* to $DEPLOYMENT_PATH"
cp -r ./* ${DEPLOYMENT_PATH}/

# Restart Apache2 server.
echo "Restarting Apache2 server"
sudo /usr/bin/service apache2 restart

