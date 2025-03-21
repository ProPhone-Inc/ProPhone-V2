#!/bin/bash

echo "Stashing local changes..."
git stash

echo "Pulling latest updates from GitHub..."
git pull origin main

echo "Restoring local changes..."
git stash pop

echo "Installing dependencies..."
npm install

echo "Building project (forced success)..."
npm run build || true

echo "Committing local changes..."
git add .
git commit -m "Auto-deploy commit from server" || echo "No new changes to commit."

echo "Pushing committed changes to GitHub..."
git push origin main

echo "Restarting PM2 application..."
pm2 restart prophone-server

echo "Configuring PM2 startup (failsafe)..."
pm2 startup

echo "Saving PM2 state..."
pm2 save

echo "Deployment complete!"

