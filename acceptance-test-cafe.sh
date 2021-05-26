#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

node AdficeWebserver.js &
CHILD_PID=%1
sleep 1

./node_modules/.bin/testcafe "firefox:headless" acceptance-test-cafe.js
EXIT_CODE=$?

kill $CHILD_PID

exit $EXIT_CODE
