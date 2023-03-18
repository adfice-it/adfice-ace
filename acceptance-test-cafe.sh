#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
set -x

PORT=$(node bin/free-port.js)
if [ "_${PORT}_" == "__" ] || [ $PORT -lt 1024 ]; then
	PORT=$(bin/free-port)
fi

date
BASE_URL="http://127.0.0.1:$PORT"
node adfice-webserver-runner.js $PORT &
CHILD_PID=%1

MAX_TRIES=10
TRIES=0
SERVED=0
while [ $TRIES -lt $MAX_TRIES ] && [ $SERVED -eq 0 ]; do
	TRIES=$(( 1 + $TRIES ))
	sleep 1
	if curl $BASE_URL; then
		SERVED=1
	fi
done

if [ "_${BROWSER_INIT_TIMEOUT_MS}_" == "__" ]; then
BROWSER_INIT_TIMEOUT_MS=$(( 5 * 60 * 1000 ))
fi

date
./node_modules/.bin/testcafe \
 "firefox:headless" \
 $1 $BASE_URL \
 --browser-init-timeout $BROWSER_INIT_TIMEOUT_MS
EXIT_CODE=$?
date

kill $CHILD_PID

exit $EXIT_CODE
