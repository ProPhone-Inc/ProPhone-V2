#!/bin/bash
cd /var/www/stage
git pull origin stage
npm install
pm2 restart vite-stage
