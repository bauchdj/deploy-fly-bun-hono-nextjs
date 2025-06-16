#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# validate app name from args is web | server
if [ "$1" != "server" ] && [ "$1" != "web" ]; then
    echo -e "${RED}Usage: $0 <server|web>${NC}"
    exit 1
fi

DEPLOY_DOCKER_COMPOSE_FILE_PATH="${PWD}/../../docker-compose.deploy.yml"
# The deploy docker compose expects these variables (in order of usage):
# APP_DIR_PATH
# PLATFORM
# REGISTRY
# APP_NAME
# TAG
# APP_PORT

APP_DIR_NAME="$1"
export APP_DIR_PATH="${PWD}"
export TAG=$(jq -r '.version' package.json)

# Need to source .env to get app name 
source .env

MISSING_ENV_VARS=()

handleMissingEnvVar() {
    MISSING_ENV_VARS+=($1)
}

# Validate env variables exist
if [ -z "$PLATFORM" ]; then
    handleMissingEnvVar "PLATFORM"
fi
if [ -z "$REGISTRY" ]; then
    handleMissingEnvVar "REGISTRY"
fi

# if app name is server, use SERVER_APP_NAME, if web, use WEB_APP_NAME
if [ "$APP_DIR_NAME" = "server" ]; then
    # Validate server env variables exist
    if [ -z "$SERVER_APP_NAME" ]; then
        handleMissingEnvVar "SERVER_APP_NAME"
    fi
    if [ -z "$SERVER_PORT" ]; then
        handleMissingEnvVar "SERVER_PORT"
    fi
    export APP_NAME="$SERVER_APP_NAME"
    export APP_PORT="$SERVER_PORT"
elif [ "$APP_DIR_NAME" = "web" ]; then
    # Validate web env variables exist
    if [ -z "$WEB_APP_NAME" ]; then
        handleMissingEnvVar "WEB_APP_NAME"
    fi
    if [ -z "$WEB_PORT" ]; then
        handleMissingEnvVar "WEB_PORT"
    fi
    export APP_NAME="$WEB_APP_NAME"
    export APP_PORT="$WEB_PORT"
fi

if [ "${#MISSING_ENV_VARS[@]}" -gt 0 ]; then
    echo -e "${RED}Missing environment variables: $(echo "${MISSING_ENV_VARS[*]}" | sed 's/ /, /g')${NC}"
    exit 1
fi

# Check if fly app exists
FLY_APP="$APP_NAME"
APP_EXISTS=$(fly apps list | grep -q "$FLY_APP"; echo $?)
FLY_TOML_EXISTS=$(test -f "fly.toml"; echo $?)
if [ "$APP_EXISTS" -ne 0 ]; then
    echo -e "${RED}App $FLY_APP does not exist.${NC}"
    echo "Docs: see uasge by running: fly launch --help or visit https://fly.io/docs/launch/create/"
    echo -e "${YELLOW}Do not create .dockerignore file from .gitignore. It will break Dockerfile${NC}"
    echo "Recommended command: fly launch --no-deploy --name $FLY_APP --internal-port $APP_PORT"
    exit 1
elif [ "$FLY_TOML_EXISTS" -ne 0 ]; then
    echo -e "${RED}fly.toml does not exist.${NC}"
    echo "Docs: visit https://fly.io/docs/flyctl/config-save/"

    echo "Attempting to download existing config..."
    fly config save --app $FLY_APP
    echo ""
fi

# Constants for handling docker image
DOCKER_IMAGE_NAME="${REGISTRY}/${APP_NAME}"
PREV_DOCKER_IMAGES=$(docker images | grep "$DOCKER_IMAGE_NAME")
IS_PREV_DOCKER_IMAGE=$(echo $?)
LENGTH_PREV_DOCKER_IMAGES=$(echo "$PREV_DOCKER_IMAGES" | wc -l | awk '{print $1}')

echo -e "${BLUE}Begining deployment of $APP_NAME${NC}"
echo ""

echo -e "${BLUE}Variables:${NC}"
echo "APP_DIR_PATH: $APP_DIR_PATH"
echo "APP_NAME: $APP_NAME"
echo "PLATFORM: $PLATFORM"
echo "REGISTRY: $REGISTRY"
echo "TAG: $TAG"
echo "APP_PORT: $APP_PORT"
echo ""

# Exit on error AFTER checking for previous docker image
set -e

if [ "$LENGTH_PREV_DOCKER_IMAGES" -gt 1 ]; then
    echo -e "${YELLOW}WARNING: More than one previous docker image found${NC}"
    echo "$PREV_DOCKER_IMAGES"
    exit 1
elif [ "$IS_PREV_DOCKER_IMAGE" -eq 0 ]; then
    echo -e "${YELLOW}Removing previous docker image${NC}"
    docker images | grep "$DOCKER_IMAGE_NAME" | awk '{print $3}' | xargs docker rmi
    echo ""
else
    echo -e "${GREEN}No previous docker image found. Good to go!${NC}"
    echo ""
fi

echo -e "${BLUE}Building docker image${NC}"
docker compose -f $DEPLOY_DOCKER_COMPOSE_FILE_PATH build
echo ""

echo -e "${BLUE}Pushing docker image to registry${NC}"
# https://docs.docker.com/engine/reference/commandline/push/
# https://fly.io/docs/blueprints/using-the-fly-docker-registry/
docker push $DOCKER_IMAGE_NAME:$TAG
echo ""

# https://fly.io/docs/launch/deploy/
# https://fly.io/docs/apps/app-availability/#redundancy-by-default-on-first-deploy
echo -e "${BLUE}Deploying to fly${NC}"
fly deploy --ha=false --app $APP_NAME --image $DOCKER_IMAGE_NAME:$TAG
echo ""

echo -e "${BLUE}Scaling to 1${NC}"
fly scale count 1
echo ""

exit 0
