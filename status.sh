#!/bin/bash
# Quick deployment status check

WEB_ROOT="/var/www/bot.mxjxn.xyz"
LAST_BUILD=$(stat -c %y "$WEB_ROOT/index.html" 2>/dev/null || echo "unknown")

echo "📊 Suchbot Deployment Status"
echo ""
echo "🌐 Web root: $WEB_ROOT"
echo "📅 Last build: $LAST_BUILD"
echo ""
echo "To deploy: cd web && ./deploy.sh"
