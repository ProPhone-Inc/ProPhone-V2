#!/bin/bash
cd /var/www/main
GIT_SSH_COMMAND='ssh -i ~/.ssh/github_deploy_key' git pull origin Main
npm install
pm2 restart vite-main --update-env
