#!/bin/bash

echo "INK_DIR=`pwd`/code/ink_compile" > .env
echo "REACT_APP_TLS=FALSE" >> .env
echo "REACT_APP_PUBLIC_DNS=$1" >> .env
