#!/bin/bash
# SPDX-License-Identifier: GPL-3.0-or-later
# Copyright (C) 2021 S. K. Medlock, E. K. Herman, K. M. Shaw

PORT=8888
node AdficeWebserver.js $PORT &
CHILD_PID=%1
sleep 1
FILE="patient-validation_id=68.out"

rm -fv "$FILE"
URL="localhost:${PORT}/patient-validation?id=68"
curl --silent $URL > "$FILE"
CURL_EXIT_CODE=$?

kill $CHILD_PID

if [ $CURL_EXIT_CODE -ne 0 ]; then
	echo "curl failed" 2>&2
	exit $CURL_EXIT_CODE;
fi

if [ $(grep -c '63b' "$FILE") -eq 0 ]; then
	echo "'63b' not found in patient" >&2
	exit 1;
fi

if [ $(grep -c 'refpages/refpage13.html' "$FILE") -eq 0 ]; then
	echo 'refpages not found' >&2
	exit 1;
fi

rm -fv "$FILE"
