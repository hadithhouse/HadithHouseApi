#!/bin/bash

log_error() {
  local msg="$1"
  RED='\033[0;31m'
  NC='\033[0m' # No Color
  echo -e "${RED}${msg}${NC}"
}

log() {
  local msg="$1"
  echo "${msg}"
}

on_error() {
  local line_lo="$1"
  local message="$2"
  local code="${3:-1}"
  if [[ -n "${message}" ]] ; then
    log_error "build.sh experienced an error on line ${line_lo}: ${message}; exiting with status ${code}"
  else
    log_error "build.sh experienced an error on line ${line_lo}; exiting with status ${code}"
  fi

  exit 1
}

# Stops the execution of the script if any command, including pipes, fail.
set -e
set -o pipefail
trap 'on_error ${LINENO}' ERR

# Install NodeJS modules.
log "Install NodeJS modules..."
npm install

# MomentJS does not have a @types module which is required by TypeScript, because the definition file
# is included with the package itself, so we create a folder for moment under @types and copy
# the definitions file to it, after renaming it to index.d.ts.
if [[ -d node_modules/@types/moment ]]; then
  rm -rf node_modules/@types/moment
fi
mkdir node_modules/@types/moment
cp node_modules/moment/moment.d.ts node_modules/@types/moment/index.d.ts

third_party_dir="hadiths/static/hadiths/third-party"
if [[ -d ${third_party_dir} ]]; then
  rm -rf ${third_party_dir}
fi
mkdir ${third_party_dir}
cp node_modules/angular/angular.js ${third_party_dir}
cp node_modules/angular-animate/angular-animate.js ${third_party_dir}
cp node_modules/angular-aria/angular-aria.js ${third_party_dir}
cp node_modules/angular-resource/angular-resource.js ${third_party_dir}
cp node_modules/angular-route/angular-route.js ${third_party_dir}
cp node_modules/bootstrap/dist/js/bootstrap.js ${third_party_dir}
cp node_modules/bootstrap/dist/css/bootstrap.css ${third_party_dir}
cp node_modules/d3/d3.js ${third_party_dir}
cp node_modules/jquery/dist/jquery.js ${third_party_dir}
cp node_modules/lodash/lodash.js ${third_party_dir}
cp node_modules/moment/moment.js ${third_party_dir}
cp node_modules/tether/dist/css/tether.css ${third_party_dir}
cp node_modules/tether/dist/js/tether.js ${third_party_dir}
cp node_modules/toastr/build/toastr.css ${third_party_dir}
cp node_modules/toastr/toastr.js ${third_party_dir}
cp node_modules/typeahead.js/dist/typeahead.jquery.js ${third_party_dir}
cp node_modules/typeahead.js/dist/bloodhound.js ${third_party_dir}
cp node_modules/systemjs/dist/system.js ${third_party_dir}

exit 0

# Run grunt
log "Run Grunt..."
./node_modules/.bin/grunt

# Install activate a Python virtual environment.
log "Install and activate a Python virtual environment..."
virtualenv --python=python3.6 venv
source venv/bin/activate

log "Install Python packages in requirements.txt..."
pip install -r requirements.txt

log "Deactivate Python's virtual environment..."
deactivate
