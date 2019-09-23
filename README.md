# ink! playground

# Introduction
ink! playground is the browser IDE for Substrate's smart contract(srml-contract). This will be similar to [Remix](https://github.com/ethereum/remix), the smart contract IDE of Ethereum.
Currently, if developers want to run ink! smart contract, they have to install substrate and ink into local environment. But this takes many steps, and also it is not easy to run stably because of version compatibility issues or so.
By using ink! playground, Substrate developers can test contracts easily just by writing main code on browser.
It doesn't require installing Substrate or running Substrate node. This is very useful for Substrate smart contract developers.
For the future works, ink! playground also provides high level security audits. This is for developer who wants to make high secured smart contracts like for enterprise use.

# Specification
## overview
ink! playground consists of three docker containers.
- ink container
- api container
- web front container

## ink container
Configure is written at "ink" in docker-compose.yml
Dockerfile is located at ink/Dockerfile

Rust and ink environment is set in the docker image, and this is called from api container.
mounted directory is /code/ink_compile/

## api container
Configure is written at "rest_api" in docker-compose.yml
Dockerfile is located at python/Dockerfile
Django source code is in /code/django_rest_api/test_app

This is an api server to compile ink! code into wasm. This container calls ink container for compiling.

## web front container
Configure is written at "web_front" in docker-compose.yml
Dockerfile is located at node/Dockerfile
ReactJS source code is in is /code/django_web_front/


# How to run

## Environment
[Docker](https://www.docker.com/) should be installed.

## Installing

```bash
git clone https://github.com/stakedtechnologies/ink-playground.git
cd ink-playground

#make .env file
./init.sh
```

## Running
```
./build.sh
docker exec django_rest_api "python3 test_app/manage.py runserver 0:8000" &
docker exec django_web_front "yarn start" &
```

# Demo
After running, you can access to page by http://127.0.0.1:3000

![Imgur](https://i.imgur.com/qGdbcUU.png)

