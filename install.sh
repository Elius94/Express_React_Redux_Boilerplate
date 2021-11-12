#!/bin/sh
cd webserver/
cd api/
npm install
cd ../client
npm install
npm run build
npm install -g serve
