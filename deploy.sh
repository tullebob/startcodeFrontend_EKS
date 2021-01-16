#!/usr/bin/env bash

XXXX="frontend_EKS"
DROPLET_URL="164.90.239.175"

echo "##############################"
echo "Building the frontend project"
echo "##############################"
npm run build

echo "##############################"
echo "Deploying Frontend project..."
echo "##############################"

scp -r ./build/* root@$DROPLET_URL:/var/www/$XXXX

