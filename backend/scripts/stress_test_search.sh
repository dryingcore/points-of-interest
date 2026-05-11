#!/bin/bash

ENV_FILE="$(dirname "$0")/../.env"

if [ -f "$ENV_FILE" ]; then
  ENV_PORT=$(grep -E "^SERVER_PORT=" "$ENV_FILE" | cut -d '=' -f2)
fi

SERVER_PORT=${ENV_PORT:-3000}
API_URL="http://localhost:${SERVER_PORT}/pois/search"

NUM_REQUESTS=100
CONCURRENCY=50

echo "================================================="
echo "Stress Testing POI Search Endpoint"
echo "Target URL: $API_URL"
echo "Total Requests: $NUM_REQUESTS"
echo "Concurrency: $CONCURRENCY"
echo "================================================="

generate_urls() {
  for ((i=1; i<=NUM_REQUESTS; i++)); do
    x=$((RANDOM % 100))
    y=$((RANDOM % 100))
    dmax=$((RANDOM % 50 + 10))
    echo "$API_URL?x=$x&y=$y&dmax=$dmax"
  done
}

echo "Starting stress test... (This might take a few seconds)"
START_TIME=$(date +%s.%N)

generate_urls | xargs -n 1 -P $CONCURRENCY -I {} curl -s -o /dev/null -w "%{http_code} %{time_total}\n" "{}" > stress_results.txt

END_TIME=$(date +%s.%N)

DURATION=$(awk "BEGIN {print $END_TIME - $START_TIME}")

echo "Test completed in ${DURATION} seconds."
echo ""
echo "--- Results Analysis ---"

awk '
BEGIN { min=999999; max=0; sum=0; success=0; err=0 }
{
  code=$1
  time=$2
  
  if (code == 200) success++
  else err++
  
  sum += time
  if (time > max) max = time
  if (time < min) min = time
}
END {
  print "Successful Requests (HTTP 200): " success
  print "Failed/Error Requests:          " err
  print ""
  print "--- Response Times (Seconds) ---"
  if (success + err > 0) {
    printf "Average Time: %.4f s\n", sum / (success + err)
  }
  printf "Min Time:     %.4f s\n", min
  printf "Max Time:     %.4f s\n", max
}' stress_results.txt

echo "================================================="

rm -f stress_results.txt
