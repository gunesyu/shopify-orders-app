#!/bin/sh

npm run migrate

# Wait for ngrok to start
sleep 10

# Fetch the ngrok tunnel URL with retries
MAX_RETRIES=5
RETRY_COUNT=0
TUNNEL_URL=""

while [ -z "$TUNNEL_URL" ] && [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    TUNNEL_URL=$(curl -s ngrok:4040/api/tunnels | jq -r '.tunnels[0].public_url')
    if [ -z "$TUNNEL_URL" ]; then
        echo "Failed to fetch ngrok URL. Retrying in 5 seconds..."
        RETRY_COUNT=$((RETRY_COUNT + 1))
        sleep 5
    fi
done

if [ -z "$TUNNEL_URL" ]; then
    echo "Failed to fetch ngrok URL after $MAX_RETRIES retries. Exiting."
    exit 1
fi

echo "Tunnel URL: ${TUNNEL_URL}"

npm install -g @shopify/cli &&
    npm run start:debug
