#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw
PORT=$(node bin/free-port.js)
if [ "_${PORT}_" == "__" ] || [ $PORT -lt 1024 ]; then
	PORT=$(bin/free-port)
fi

BASE_URL="http://127.0.0.1:$PORT"
node AdficeWebserver.js $PORT &
CHILD_PID=%1
sleep 1

# acceptance-test-cafe.js $BASE_URL

if [ "_${SLOW_TEST}_" == '__' ]; then
TEST_NAME=acceptance-test-cafe.js
else
TEST_NAME=slow-acceptance-test.js
fi;

./node_modules/.bin/testcafe \
 "firefox:headless" \
 $TEST_NAME $BASE_URL
EXIT_CODE=$?

kill $CHILD_PID

exit $EXIT_CODE
