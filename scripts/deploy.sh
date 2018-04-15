#!/bin/bash

source "scripts/base.sh"

DEPLOYMENT_PATH='/var/www/HadithHouseApi'
LOGS_PATH='/var/log/HadithHouseApi'

# Ensure that the directory '${DEPLOYMENT_PATH}' exists.
log "Ensure that the directory '${DEPLOYMENT_PATH}' exists."
if [ ! -d "${DEPLOYMENT_PATH}" ]; then
  log "Directory '${DEPLOYMENT_PATH}' doesn't exist. Deployment cannot proceed."
  exit 1
fi
log "Directory '${DEPLOYMENT_PATH}' exists."

# Ensure that the directory '${LOGS_PATH}' exists.
log "Ensure that the directory '${LOGS_PATH}' exists."
if [ ! -d "${LOGS_PATH}" ]; then
  log "Directory '${LOGS_PATH}' doesn't exist. Deployment cannot proceed."
  exit 1
fi
log "Directory '${LOGS_PATH}' exists."

# Deleting the existing content of '${DEPLOYMENT_PATH}'
log "Deleting the existing content of '${DEPLOYMENT_PATH}'"
rm -rf ${DEPLOYMENT_PATH}/*

# Copy the project onto the deployment directory.
log "Copying `pwd`/* to ${DEPLOYMENT_PATH}..."
cp -r ./* ${DEPLOYMENT_PATH}/

# Change directory to deployment directory.
echo "Change directory to deployment directory."
cd ${DEPLOYMENT_PATH}

# Install and activate a Python virtual environment.
log "Install and activate a Python virtual environment..."
virtualenv --python=python3.6 venv
source venv/bin/activate

# Install Python packages in requirements.txt.
log "Install Python packages in requirements.txt..."
python -m pip install -r requirements.txt

# Apply Django's migrations.
log "Running manage.py migrate to apply migrations."
python manage.py migrate

log "Deactivate Python's virtual environment..."
deactivate

# Give www-data group ownership of the deployed files so apache2 can read them.
log "Give group ownership to www-data for the deployed files for apache2 to
be able to read them."
chgrp -R www-data ${DEPLOYMENT_PATH}/*

# Gracefully reloading Apache2.
log "Gracefully reloading Apache2..."
sudo /usr/sbin/apache2ctl graceful
