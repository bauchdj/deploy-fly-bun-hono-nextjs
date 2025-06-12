#!/bin/bash

set -e

# Build apps
bun run build

# Copy build artifacts to the root directory for Dockerfile in docker-compose.yml
cp -r apps/server/dist ./
cp -r apps/web/.next ./
if [ -d "apps/web/public" ]; then cp -r apps/web/public ./public; fi # Copy public folder if it exists

# Start services
docker compose up -d

# Clean up build artifacts
rm -rf dist .next public

# Wait for database to be ready
while ! docker compose exec db psql -U postgres -c "SELECT 1" > /dev/null 2>&1; do
    echo "Waiting for database to be ready..."
    sleep 2
done

bun run db:push
