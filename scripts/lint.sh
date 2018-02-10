#!/bin/bash

source "scripts/base.sh"

# Activate a Python virtual environment.
log "Activate a Python virtual environment..."
source venv/bin/activate

# Run Grunt lint task to ensure client-side code quality.
log "Run Grunt lint task to ensure client-side code quality..."
./node_modules/.bin/grunt lint

# Pylint
log "Run pylint to ensure Python code quality..."
pylint \
  hadiths/*.py

# Deactivate the Python's virtual environment.
log "Deactivate the Python's virtual environment..."
deactivate
