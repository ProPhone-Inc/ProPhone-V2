#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to the project directory
cd /var/www/main || { echo "❌ Failed to enter repo directory"; exit 1; }

# Use SSH key for Git operations
export GIT_SSH_COMMAND='ssh -i ~/.ssh/github_deploy_key'

# Fetch the latest updates
echo "📡 Fetching latest changes..."
git fetch --all

# Check if branch has divergence
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "⚠️ Branch divergence detected! Resetting to match remote..."
  git reset --hard origin/main
fi

# Ensure Git is set to always rebase (prevents divergence in future)
git config pull.rebase true

# Pull the latest updates
echo "🔄 Pulling latest changes..."
git pull origin main --rebase || { echo "❌ Git pull failed"; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🛠 Building application..."
npm run build

# Restart PM2 process
echo "♻️ Restarting application with PM2..."
pm2 restart vite-main --update-env

# Save PM2 process list and ensure startup
pm2 save
pm2 startup

echo "✅ Deployment complete!"