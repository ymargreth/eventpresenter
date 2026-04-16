#!/bin/bash

cd "$(dirname "$0")"
#python3 -m http.server 8000

# use provided port or default to 0 (auto)
PORT=${1:-0}

# start server
echo "Starting server..."

python3 -m http.server "$PORT" &
SERVER_PID=$!

# wait for server to start
sleep 1

# detect actual port (important if PORT=0)
ACTUAL_PORT=$(lsof -Pan -p $SERVER_PID -iTCP -sTCP:LISTEN | awk 'NR==2 {split($9,a,":"); print a[2]}')

if [ -z "$ACTUAL_PORT" ]; then
   echo "Failed to detect port"
   kill $SERVER_PID
   exit 1
fi

URL="http://localhost:$ACTUAL_PORT"

echo "Running on $URL"

# open browser (macOS)
open "$URL"

# local IP for phone testing
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -n "$IP" ]; then
   echo "Local access: http://$IP:$ACTUAL_PORT"
fi

# cleanup on CTRL+C
trap "echo 'Stopping server...'; kill $SERVER_PID; exit" INT

wait $SERVER_PID