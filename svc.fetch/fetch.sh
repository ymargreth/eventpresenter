#!/bin/sh

set -e

BASE_URL="https://raw.githubusercontent.com/ymargreth/sgc-data/main"
TARGET_DIR="/data"

echo "$(date +"%Y-%m-%d %H:%M:%S") Fetcher started..."

while true; do
   echo "$(date +"%Y-%m-%d %H:%M:%S") Updating content..."

   curl -fsSL "$BASE_URL/events.json" -o "$TARGET_DIR/events.tmp" \
      && mv "$TARGET_DIR/events.tmp" "$TARGET_DIR/events.json" \
      || echo "events.json failed"

   curl -fsSL "$BASE_URL/socials.json" -o "$TARGET_DIR/socials.tmp" \
      && mv "$TARGET_DIR/socials.tmp" "$TARGET_DIR/socials.json" \
      || echo "socials.json failed"

   echo "$(date +"%Y-%m-%d %H:%M:%S") Sleeping..."
   sleep 300
done
