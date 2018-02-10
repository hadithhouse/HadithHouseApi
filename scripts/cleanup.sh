#!/bin/bash

source "scripts/base.sh"

# Remove Node modules and delete TypeScript cache (.tscache)
log "Remove NodeJS modules and delete TypeScript cache (.tscache)..."
rm -rf node_modules/
rm -rf .tscache/

# Delete Python's virtual environment.
log "Delete Python's virtual environment..."
rm -rf venv
