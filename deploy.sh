#!/bin/bash
set -euo pipefail

# Deploy script for suchbot
# Syncs built Astro site to web root

WEB_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_ROOT="/var/www/bot.mxjxn.com"

echo "📦 Syncing to web root..."
rsync -av --delete dist/ "$WEB_ROOT/"

echo "🔄 Restarting server..."
# Kill existing server on port 4321
pkill -f "node.*dist/server/entry.mjs" 2>/dev/null || true
sleep 1
# Start new server
cd "$WEB_ROOT"
nohup node dist/server/entry.mjs > /dev/null 2>&1 &

echo "✨ Deploy complete!"
echo "🌐 https://bot.mxjxn.com"
