#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Directories to clean up
NEXTJS_DIRS=("dist" ".next" "public")

# Cleanup function
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

# Set trap for cleanup
trap cleanup EXIT

set -e

# Build apps
echo -e "${BLUE}Building apps${NC}"
bun run build
echo ""

# Copy build artifacts to the root directory for Dockerfile in docker-compose.yml
echo -e "${BLUE}Copying build artifacts to the root directory${NC}"
for dir in "${NEXTJS_DIRS[@]}"; do
    echo "Copying $dir"
    case $dir in
        dist) cp -r apps/server/dist ./ ;;
        .next) cp -r apps/web/.next ./ ;;
        public) [ -d "apps/web/public" ] && cp -r apps/web/public ./ ;;
    esac
done
echo ""

# Start services
echo -e "${BLUE}Starting services${NC}"
docker compose up -d
echo ""

# Wait for database to be ready
echo -e "${BLUE}Waiting for database to be ready${NC}"
while ! docker compose exec db psql -U postgres -c "SELECT 1" > /dev/null 2>&1; do
    echo "Waiting for database to be ready"
    sleep 2
done
echo ""

echo -e "${BLUE}Pushing database${NC}"
bun run db:push
echo ""
