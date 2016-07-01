#!/bin/bash

error() {
  local line_lo="$1"
  local message="$2"
  local code="${3:-1}"
  if [[ -n "$message" ]] ; then
    echo "deploy.sh experienced an error on line ${line_lo}: ${message}; exiting with status ${code}"
  else
    echo "deploy.sh experienced an error on line ${line_lo}; exiting with status ${code}"
  fi
  
  exit 1
}

DEPLOYMENT_PATH='/var/www/app'
LOGS_PATH='/var/log/app'

# Stops the execution of the script if any command, including pipes, fail.
set -e 
set -o pipefail
trap 'error ${LINENO}' ERR

# Ensure that the directory '$DEPLOYMENT_PATH' exists.
echo "Ensure that the directory '$DEPLOYMENT_PATH' exists."
if [ ! -d "$DEPLOYMENT_PATH" ]; then
  echo "Directory '$DEPLOYMENT_PATH' doesn't exist. Deployment cannot proceed."
  exit 1
fi
echo "Directory '$DEPLOYMENT_PATH' exists."

# Ensure that the directory '$LOGS_PATH' exists.
echo "Ensure that the directory '$LOGS_PATH' exists."
if [ ! -d "$LOGS_PATH" ]; then
  echo "Directory '$LOGS_PATH' doesn't exist. Deployment cannot proceed."
  exit 1
fi
echo "Directory '$LOGS_PATH' exists."

# Install and activate a Python virtual environment.
echo "Install and activate a Python virtual environment..."
virtualenv --python=python2.7 venv
source venv/bin/activate

# Install Python packages in requirements.txt.
echo "Install Python packages in requirements.txt..."
pip install -r requirements.txt

# Apply Django's migrations.
echo "Running manage.py migrate to apply migrations."
python manage.py migrate

echo "Deactivate Python's virtual environment..."
deactivate

# Deleting the content of '${DEPLOYMENT_PATH}'
echo "Deleting the content of '${DEPLOYMENT_PATH}'"
rm -rf $DEPLOYMENT_PATH/*

# Copy the project onto the deployment directory.
echo "Copying `pwd`/* to $DEPLOYMENT_PATH..."
cp -r ./* $DEPLOYMENT_PATH/

# Give Apache2 ownership of the log files so it can write to them.
echo "Give Apache2 ownership of the log files so it can write to them."
chgrp www-data $DEPLOYMENT_PATH
chgrp -R www-data $DEPLOYMENT_PATH/*

# Give Apache2 ownership of the log files so it can write to them.
echo "Give Apache2 ownership of the log files so it can write to them."
chgrp www-data $LOGS_PATH
chgrp -R www-data $LOGS_PATH/*

# Gracefully reloading Apache2.
echo "Gracefully reloading Apache2..."
sudo /usr/sbin/apache2ctl graceful