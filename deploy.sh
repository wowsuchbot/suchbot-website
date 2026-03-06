#!/bin/bash
set -euo pipefail

# Deploy script for suchbot
# Syncs built Astro site to web root

WEB_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_ROOT="/var/www/bot.mxjxn.com"

echo "📦 Syncing to web root..."
rsync -av --delete dist/ "$WEB_ROOT/"

echo "✨ Deploy complete!"
echo "🌐 https://bot.mxjxn.com"
