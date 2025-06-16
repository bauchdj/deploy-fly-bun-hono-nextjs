#!/bin/bash

# Color Constants
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[0;33m'
readonly MAGENTA='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Directories to clean up
NEXTJS_DIRS=("dist" ".next" "public")

build_apps() {
    # Build apps
    echo -e "${CYAN}Building apps${NC}"
    bun run build
    echo ""
}

# Cleanup Next.js directories
copy_build_artifacts() {
    # Copy build artifacts to the root directory for apps/{server,web}/Dockerfile in docker-compose.yml
    echo -e "${CYAN}Copying build artifacts to the root directory${NC}"
    for dir in "${NEXTJS_DIRS[@]}"; do
        echo "Copying $dir"
        case $dir in
            dist) cp -r apps/server/dist ./ ;;
            .next) cp -r apps/web/.next ./ ;;
            public) [ -d "apps/web/public" ] && cp -r apps/web/public ./ ;;
        esac
    done
    echo ""
}

pre_docker() {
    build_apps
    copy_build_artifacts
}

cleanup() {
    echo -e "${YELLOW}Cleaning up build artifacts${NC}"
    for dir in "${NEXTJS_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            echo -e "${YELLOW}Removing $dir${NC}"
            rm -rf "$dir"
        fi
    done
    echo ""
}

wait_for_db() { 
    echo -e "${CYAN}Waiting for database to be ready${NC}"
    while ! docker compose exec db psql -U postgres -c "SELECT 1" > /dev/null 2>&1; do
        echo "Waiting for database to be ready"
        sleep 2
    done
    echo ""
}

migrate_db() {
    wait_for_db

    echo -e "${CYAN}Pushing database${NC}"
    bun run db:push
    echo ""
}

docker_up() {
    echo -e "${CYAN}Starting services${NC}"
    docker compose up -d
    echo ""
}

docker_build() {
    echo -e "${CYAN}Building services${NC}"
    docker compose build
    echo ""
}

# Set trap for cleanup
trap cleanup EXIT

set -e

# build apps and copy build folders
pre_docker

if [ "$1" = "build" ]; then
    docker_build
    exit 0
elif [ "$1" = "up" ]; then
    docker_up
    migrate_db
    exit 0
else
    echo "Usage: $0 {build|up}"
    exit 1
fi
