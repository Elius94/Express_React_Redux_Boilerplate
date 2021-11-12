#!/bin/bash

source ".env"

docker run --rm --net="host" --name postgre-webapp-tmp \
    -e POSTGRES_PASSWORD="${DB_PASSWD}" \
    -e POSTGRES_DB="${DB_NAME}" \
    -e POSTGRES_USER="${DB_USER}" \
    -d webapp_postgres:2020-10-19
