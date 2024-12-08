#!/bin/bash

# check if docker deamon is running
if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. It will be starting..."
    open --background -a Docker
    # Wait until Docker daemon is running
    while ! docker info >/dev/null 2>&1; do
        sleep 1
    done
fi

# compose up with cache refresh and detached mode
docker compose build --progress plain
docker compose up -d
