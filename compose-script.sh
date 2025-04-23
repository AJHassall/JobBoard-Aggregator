#!/bin/bash

# Script to run Docker Compose with different configurations.

COMPOSE_FILE="docker-compose.yml"
COMMAND="up"
BUILD_FLAG=""
DETACH_FLAG=""

usage() {
  echo "Usage: ./composescript [OPTIONS]"
  echo "Options:"
  echo "  --dev       Use the development Docker Compose file (docker-compose-api-dev.yml)."
  echo "  --prod      Use the production Docker Compose file (docker-compose-api-prod.yml)."
  echo "  --build     Include the --build flag in the Docker Compose command."
  echo "  --detach    Run containers in detached mode."
  echo "  --help      Show this help message."
  exit 1
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dev)
      COMPOSE_FILE="docker-compose-api-dev.yml"
      shift
      ;;
    --prod)
      COMPOSE_FILE="docker-compose.yml"
      shift
      ;;
    --build)
      BUILD_FLAG="--build"
      shift
      ;;
    --detach)
      DETACH_FLAG="-d"
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Error: Unknown option '$1'"
      usage
      exit 1
      ;;
  esac
done

# Construct the Docker Compose command
docker_compose_command="docker-compose -f $COMPOSE_FILE $COMMAND $BUILD_FLAG $DETACH_FLAG"

echo "Running: $docker_compose_command"

# Execute the Docker Compose command
if $docker_compose_command; then
  echo "Docker Compose command executed successfully."
else
  echo "Error: Docker Compose command failed."
  exit 1
fi

exit 0
