#!/bin/sh

set -e

BASE_URL="https://raw.githubusercontent.com/ymargreth/sgc-data/main"
TARGET_DIR="/data"

echo "$(date +"%D %T") Fetcher started..."

while true; do
   echo "$(date +"%D %T") Updating content..."

   curl -fsSL "$BASE_URL/events.json" -o "$TARGET_DIR/events.tmp" \
      && mv "$TARGET_DIR/events.tmp" "$TARGET_DIR/events.json" \
      || echo "$(date +"%D %T") events.json failed"

   curl -fsSL "$BASE_URL/socials.json" -o "$TARGET_DIR/socials.tmp" \
      && mv "$TARGET_DIR/socials.tmp" "$TARGET_DIR/socials.json" \
      || echo "$(date +"%D %T") socials.json failed"

   echo "$(date +"%D %T") Sleeping..."
   sleep 300
done
