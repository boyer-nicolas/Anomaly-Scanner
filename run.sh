#!/bin/bash
set -e

if [ ! -f $HOME/.nvm/nvm.sh ]; then
    echo "NVM is not installed. Please install it first."
    exit 1
fi

source $HOME/.nvm/nvm.sh

(cd frontend/ && nvm use && npm install && npm run build && npm run dev) &
(cd api/ && nvm use && npm install && npm run build && npm run develop)
