#!/bin/bash

source "scripts/base.sh"

DEPLOYMENT_PATH='/var/www/app'
LOGS_PATH='/var/log/app'

# Ensure that the directory '$DEPLOYMENT_PATH' exists.
log "Ensure that the directory '$DEPLOYMENT_PATH' exists."
if [ ! -d "$DEPLOYMENT_PATH" ]; then
  log "Directory '$DEPLOYMENT_PATH' doesn't exist. Deployment cannot proceed."
  exit 1
fi
log "Directory '$DEPLOYMENT_PATH' exists."

# Ensure that the directory '$LOGS_PATH' exists.
log "Ensure that the directory '$LOGS_PATH' exists."
if [ ! -d "$LOGS_PATH" ]; then
  log "Directory '$LOGS_PATH' doesn't exist. Deployment cannot proceed."
  exit 1
fi
log "Directory '$LOGS_PATH' exists."

# Deleting the content of '${DEPLOYMENT_PATH}'
log "Deleting the content of '${DEPLOYMENT_PATH}'"
rm -rf $DEPLOYMENT_PATH/*

# Copy the project onto the deployment directory.
log "Copying `pwd`/* to $DEPLOYMENT_PATH..."
cp -r ./* $DEPLOYMENT_PATH/

# Change directory to deployment directory.
cd $DEPLOYMENT_PATH

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

# Give Apache2 ownership of the log files so it can write to them.
log "Give Apache2 ownership of the app files so it can write to them."
chgrp www-data $DEPLOYMENT_PATH
chgrp -R www-data $DEPLOYMENT_PATH/*

# Give Apache2 ownership of the log files so it can write to them.
log "Give Apache2 ownership of the log files so it can write to them."
chgrp www-data $LOGS_PATH
chgrp -R www-data $LOGS_PATH/*

# Gracefully reloading Apache2.
log "Gracefully reloading Apache2..."
sudo /usr/sbin/apache2ctl graceful
