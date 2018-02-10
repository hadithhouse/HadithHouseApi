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
