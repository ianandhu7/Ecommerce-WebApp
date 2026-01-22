#!/usr/bin/env bash
# Render build script for backend

set -o errexit  # exit on error

# Install dependencies
npm install

# Run any database migrations if needed
# npm run migrate

echo "Backend build completed successfully!"