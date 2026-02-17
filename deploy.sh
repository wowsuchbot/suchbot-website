#!/bin/bash
set -euo pipefail

# Deploy script for suchbot
# Builds Astro site and syncs to web root

WEB_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_ROOT="/var/www/bot.mxjxn.com"

echo "🔨 Building Astro site..."
cd "$WEB_DIR"
npm run build

echo "📦 Syncing to web root..."
rsync -av --delete dist/ "$WEB_ROOT/"

echo "✨ Deploy complete!"
echo "🌐 https://bot.mxjxn.com"
