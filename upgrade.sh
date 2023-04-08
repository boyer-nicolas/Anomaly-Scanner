#!/bin/bash
set -e

DC="docker compose -f docker-compose.prod.yml"

$DC down -v --remove-orphans

git fetch --all
git reset --hard
git clean -df

$DC up -d
