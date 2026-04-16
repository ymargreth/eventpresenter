#!/bin/bash

cd "$(dirname "$0")"
#python3 -m http.server 8000

# use provided port or default to 0 (auto)
PORT=${1:-58080}

echo "Starting server..."

# start server in background so script continues
python3 -m http.server "$PORT" &
SERVER_PID=$!

sleep 1

URL="http://localhost:$PORT"

echo "Running on: $URL"

open "$URL"

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -n "$IP" ]; then
   echo "Local access: http://$IP:$PORT"
fi

# cleanup on CTRL+C
trap "echo ""; echo 'Stopping server...'; kill $SERVER_PID; exit" INT

wait $SERVER_PID