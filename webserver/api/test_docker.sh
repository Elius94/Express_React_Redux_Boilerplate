#!/bin/bash

export NODE_ENV=test
# Start the container
pushd ../db/
./start_docker_temp.sh
popd
# Run the tests
./node_modules/mocha/bin/mocha --recursive --timeout 5000 integrations/test
# Stop the container
pushd ../db/
./stop_docker_temp.sh
popd