#!/bin/bash

docker-compose down
docker-compose build
docker-compose up -d
docker exec django_rest_api "python3 test_app/manage.py runserver 0:8000" &
docker exec django_web_front "yarn start" &


