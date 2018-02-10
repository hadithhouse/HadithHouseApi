#!/bin/bash

source "scripts/base.sh"

# Activate a Python virtual environment.
log "Activate a Python virtual environment..."
source venv/bin/activate

# Running tests...
log "Running tests..."
python manage.py test

# Deactivate the Python's virtual environment.
log "Deactivate the Python's virtual environment..."
deactivate
