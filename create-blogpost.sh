#!/bin/bash
set -euo pipefail

# Create a new blogpost and deploy
# Usage: ./create-blogpost.sh "Post Title"

if [ $# -eq 0 ]; then
    echo "Usage: ./create-blogpost.sh \"Post Title\""
    exit 1
fi

TITLE="$1"
DATE=$(date +%Y-%m-%d)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
FILENAME="src/content/blog/${DATE}-${SLUG}.md"

echo "📝 Creating blogpost: $FILENAME"

cat > "$FILENAME" << EOF
---
title: '$TITLE'
pubDate: $(date +%Y-%m-%d)
heroImage: '/blog-placeholder.jpg'
description: ''
---

Content goes here...
EOF

echo "✅ Blogpost created: $FILENAME"
echo "✏️  Edit the file, then run: ./deploy.sh"
echo ""

# Ask if user wants to edit now
read -p "Open in editor? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    ${EDITOR:-nano} "$FILENAME"
    
    # Ask if user wants to deploy
    read -p "Deploy now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        ./deploy.sh
    fi
fi
