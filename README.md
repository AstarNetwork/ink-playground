
# ink! playground

https://ink-playground.com/

# Introduction
ink! playground is the browser IDE for Substrate's smart contract(srml-contract). This will be similar to [Remix](https://github.com/ethereum/remix), the smart contract IDE of Ethereum.
Currently, if developers want to run ink! smart contract, they have to install substrate and ink into local environment. But this takes many steps, and also it is not easy to run stably because of version compatibility issues or so.
By using ink! playground, Substrate developers can test contracts easily just by writing main code on browser.
It doesn't require installing Substrate or running Substrate node. This is very useful for Substrate smart contract developers.
For the future works, ink! playground also provides high level security audits. This is for developer who wants to make high secured smart contracts like for enterprise use.

# Demo
you can try from [here](https://ink-playground.com/)

![Imgur](https://i.imgur.com/1RDpCOz.png)

# Specification
## overview
ink! playground consists of three docker containers.
- ink container
- api container
- web front container

## ink container
Dockerfile is located at ink/Dockerfile

Rust and ink environment is set in the docker image, and this is called from api container.
mounted directory is /code/ink_compile/

## api container
Configure is written at "rest_api" in docker-compose.yml
Dockerfile is located at python/Dockerfile
Django source code is in /code/rest_api/test_app

This is an api server to compile ink! code into wasm. This container calls ink container for compiling.

## web front container
Configure is written at "web_front" in docker-compose.yml
Dockerfile is located at node/Dockerfile
ReactJS source code is in is /code/web_front/


# How to run

## Environment
[Docker](https://www.docker.com/) should be installed.

## Installing

```bash
git clone https://github.com/stakedtechnologies/ink-playground.git
cd ink-playground

#make .env file
./init.sh <PUBLIC_DNS>
```
At <PUBLIC_DNS>, insert public dns of the server (exclude "http://").
If you want to test locally, do like this: `./init.sh localhost`

## Running
```bash
./build.sh
docker build -t ink_env ink
docker-compose up -d
```

open another terminal and do the following.
```bash
#start api server
docker-compose exec rest_api python3 websocket_app/server.py
```

open another terimnal and do the following.
```bash
#only for the first time before running
docker-compose exec web_front yarn install

#start web front server
docker-compose exec web_front yarn start
```
After running, you can access to page by http://localhost/

## Stopping
```bash
docker-compose down
```
