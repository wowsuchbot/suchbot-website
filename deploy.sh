#!/bin/bash
set -euo pipefail

# Deploy script for suchbot
# Syncs built Astro site to web root and manages with PM2

WEB_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_ROOT="/var/www/bot.mxjxn.com"

echo "📦 Syncing to web root..."
rsync -av --delete dist/ "$WEB_ROOT/"

echo "🔄 Restarting PM2 process..."
# Restart using PM2 (survives reboots, auto-restarts on crash)
pm2 restart bot-website 2>/dev/null || pm2 start ecosystem.config.cjs

echo "✨ Deploy complete!"
echo "🌐 https://bot.mxjxn.com"
echo "📊 Status: pm2 list"
