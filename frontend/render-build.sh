#!/usr/bin/env bash
# Render build script for frontend

set -o errexit  # exit on error

# Install dependencies
npm install

# Build the React app
npm run build

echo "Frontend build completed successfully!"