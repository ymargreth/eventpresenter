#!/bin/bash

clear

echo ""
echo ">     *************************"
echo "      *                       *"
echo "      *  serve.sh             *"
echo "      *         by ymargreth  *"
echo "      *                       *"
echo "      *************************"
echo ""

cd "$(dirname "$0")"
#python3 -m http.server 8000

# use provided port or default to 0 (auto)
PORT=${1:-58080}

echo "Starting server ... "

# start server in background so script continues
python3 -m http.server "$PORT" -d ./html&
SERVER_PID=$!

sleep 2
URL="http://localhost:$PORT/?q=displayAll"

echo -e "Server started.\n"
echo "Server PID:         $SERVER_PID"
echo "Running on Port:    $PORT"

IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -n "$IP" ]; then
   echo "Internal IP:        http://$IP:$PORT"
fi

echo -ne "Local URL:          $URL \n\n         --> Opening URL ... "

open "$URL"

echo -e "done.\n"

# cleanup on CTRL+C
trap "echo ""; echo 'Stopping server...'; kill $SERVER_PID; exit" INT

wait $SERVER_PID