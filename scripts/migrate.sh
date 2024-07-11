#!/usr/bin/env bash
podman run \
    --rm  -it \
    --env-file .env.docker \
    --mount type=bind,source="$(shell pwd)",target=/project \
    --workdir /project \
    --network $(DOCKER_NETWORK) \
    python:3.11-slim bash podman/backend-migrate/migrate.sh
