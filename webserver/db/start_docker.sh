#!/bin/bash

DB_FILES_PATH="$(pwd)/db_files"
source ".env"

docker run --rm --net="host" --name postgre-webapp \
    -v "${DB_FILES_PATH}:/var/lib/postgresql/data" \
    -e POSTGRES_PASSWORD="${DB_PASSWD}" \
    -e POSTGRES_DB="${DB_NAME}" \
    -e POSTGRES_USER="${DB_USER}" \
    -d webapp_postgres:2020-10-19

