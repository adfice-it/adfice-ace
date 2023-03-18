#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
PORT=$(node bin/free-port.js)
if [ "_${PORT}_" == "__" ] || [ $PORT -lt 1024 ]; then
	PORT=$(bin/free-port)
fi

BASE_URL="http://127.0.0.1:$PORT"
node adfice-webserver-runner.js $PORT &
CHILD_PID=%1
sleep 1

if [ "_${BROWSER_INIT_TIMEOUT_MS}_" == "__" ]; then
BROWSER_INIT_TIMEOUT_MS=$(( 5 * 60 * 1000 ))
fi

./node_modules/.bin/testcafe \
 --browser-init-timeout $BROWSER_INIT_TIMEOUT_MS \
 "firefox:headless" \
 $1 $BASE_URL
EXIT_CODE=$?

kill $CHILD_PID

exit $EXIT_CODE
