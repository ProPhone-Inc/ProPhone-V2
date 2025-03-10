#!/bin/bash
cd /var/www/stage
GIT_SSH_COMMAND='ssh -i ~/.ssh/github_deploy_key' git pull origin Stage
npm install
pm2 restart vite-stage --update-env

