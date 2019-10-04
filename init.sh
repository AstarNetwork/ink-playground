#!/bin/bash

echo "INK_DIR=`pwd`/code/ink_compile" > .env
echo "PUBLIC_DNS=$1" >> .env
echo "REACT_APP_PUBLIC_DNS=\"$1\"" > code/web_front/.env
