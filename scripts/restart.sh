#!/bin/bash

#Script para reiniciar containers no docker-compose

echo "######################"
echo "Restart Docker compose"
echo "######################"


cd "$(dirname "$0")/.."

echo "Down containers..."
docker compose down --rmi all

echo "Restart Docker compose..."
docker compose up --build -d

echo "Containers are running!"

sleep 5

docker ps


