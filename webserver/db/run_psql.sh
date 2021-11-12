#!/bin/bash

source ".env"
PORT=5432

psql "postgresql://${DB_USER}:${DB_PASSWD}@localhost:${PORT}/${DB_NAME}"
