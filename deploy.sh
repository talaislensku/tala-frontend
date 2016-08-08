#!/bin/bash
set -e

rm -rf build
docker-compose run web-dev npm run build
docker build -t davidblurton/tala-new .
docker push davidblurton/tala-new
