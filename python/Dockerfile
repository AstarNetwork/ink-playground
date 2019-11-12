FROM python:3.7
ENV PYTHONUNFERED 1
RUN mkdir /config; \
    mkdir /code; 
COPY ./config/ /config
RUN pip install -r /config/requirements_websocket.txt; \
    apt-get update && apt-get install -y docker.io

WORKDIR /code
