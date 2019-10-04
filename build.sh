#!/bin/bash

docker-compose down
docker-compose build
docker build -t ink_env ink
