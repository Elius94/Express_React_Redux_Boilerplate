#!/bin/sh
cd webserver/
cd api/
npm run start & cd ../client/; npm run serve 
