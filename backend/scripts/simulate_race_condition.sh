#!/bin/bash

ENV_FILE="$(dirname "$0")/../.env"

if [ -f "$ENV_FILE" ]; then
  ENV_PORT=$(grep -E "^SERVER_PORT=" "$ENV_FILE" | cut -d '=' -f2)
fi

SERVER_PORT=${ENV_PORT:-3000}
API_URL="http://localhost:${SERVER_PORT}/pois"
POI_NAME="Race Condition Test POI $RANDOM"
POI_X=$((RANDOM % 100))
POI_Y=$((RANDOM % 100))

echo "================================================="
echo "Simulating Race Condition for POI Creation"
echo "Target URL: $API_URL"
echo "Payload: { \"name\": \"$POI_NAME\", \"x\": $POI_X, \"y\": $POI_Y }"
echo "================================================="

TMP_OUT1=$(mktemp)
TMP_OUT2=$(mktemp)
TMP_HTTP1=$(mktemp)
TMP_HTTP2=$(mktemp)

PAYLOAD=$(cat <<EOF
{
  "name": "$POI_NAME",
  "x": $POI_X,
  "y": $POI_Y
}
EOF
)

curl -s -w "%{http_code}|%{time_total}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" -o "$TMP_OUT1" > "$TMP_HTTP1" &
PID1=$!

curl -s -w "%{http_code}|%{time_total}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" -o "$TMP_OUT2" > "$TMP_HTTP2" &
PID2=$!

wait $PID1
wait $PID2

HTTP1_RESULT=$(cat "$TMP_HTTP1")
HTTP1_CODE=$(echo "$HTTP1_RESULT" | cut -d'|' -f1)
HTTP1_TIME=$(echo "$HTTP1_RESULT" | cut -d'|' -f2)

HTTP2_RESULT=$(cat "$TMP_HTTP2")
HTTP2_CODE=$(echo "$HTTP2_RESULT" | cut -d'|' -f1)
HTTP2_TIME=$(echo "$HTTP2_RESULT" | cut -d'|' -f2)

echo ""
echo "--- Response 1 (HTTP $HTTP1_CODE | Time: ${HTTP1_TIME}s) ---"
cat "$TMP_OUT1"
echo ""

echo ""
echo "--- Response 2 (HTTP $HTTP2_CODE | Time: ${HTTP2_TIME}s) ---"
cat "$TMP_OUT2"
echo ""
echo ""
echo "================================================="

rm -f "$TMP_OUT1" "$TMP_OUT2" "$TMP_HTTP1" "$TMP_HTTP2"
