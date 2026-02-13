#!/bin/bash
set -euo pipefail

# Deploy script for suchbot
# Builds Astro site, syncs to web root, and restarts API

WEB_DIR="$(cd "$(dirname "$0")" && pwd)"
API_DIR="/root/.openclaw/workspace/api"
WEB_ROOT="/var/www/bot.mxjxn.xyz"

echo "🔨 Building Astro site..."
cd "$WEB_DIR"
npm run build

echo "📦 Syncing to web root..."
rsync -av --delete dist/ "$WEB_ROOT/"

echo "🔧 Checking API..."
if pgrep -f "node.*api/index.js" > /dev/null; then
    echo "✅ API already running (port 3001)"
else
    echo "🚀 Starting API..."
    cd "$API_DIR"
    nohup npm start > /var/log/suchbot-api.log 2>&1 &
    sleep 2
    if pgrep -f "node.*api/index.js" > /dev/null; then
        echo "✅ API started"
    else
        echo "❌ API failed to start"
        exit 1
    fi
fi

echo "✨ Deploy complete!"
echo "🌐 https://bot.mxjxn.xyz"
