#! /bin/bash

docker build -t jhipster_jdl_db:latest -f ./Dockerfile-db ./db
docker build -t jhipster_jdl_api:latest -f ./Dockerfile-api ./app
