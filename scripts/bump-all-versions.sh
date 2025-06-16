#!/bin/bash

# Show usage information
show_usage() {
    echo "Usage: $0 <version_level>"
    echo "Version levels:"
    echo "  major    Major version bump (X.0.0)"
    echo "  minor    Minor version bump (0.X.0)"
    echo "  patch    Patch version bump (0.0.X) - default"
    exit 1
}

# Validate input
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_usage
fi

LEVEL=$1

if [[ ! "$LEVEL" =~ ^(major|minor|patch)$ ]]; then
    echo "Error: Invalid version level. Must be one of: major, minor, patch"
    show_usage
fi

for file in $(find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/.*/*"); do
    bun run scripts/bump-version.ts "$LEVEL" --input "$file"
    # git add "$file"
done

# git commit -m "chore: patch all versions"