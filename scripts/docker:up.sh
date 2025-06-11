#!/bin/bash

set -e

# Build apps
bun run build

# Copy build artifacts to the root directory for Dockerfile in docker-compose.yml
cp -r apps/server/dist ./
cp -r apps/web/.next ./

# Start services
docker compose up -d

# Clean up build artifacts
rm -rf dist .next